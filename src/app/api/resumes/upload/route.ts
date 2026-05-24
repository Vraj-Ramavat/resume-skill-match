import { NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { summarizeUpload } from '@/lib/resume-analysis';

function sourceTypeFromFile(file: File) {
  if (file.type) {
    return file.type;
  }

  const lowerName = file.name.toLowerCase();

  if (lowerName.endsWith('.pdf')) return 'application/pdf';
  if (lowerName.endsWith('.docx')) return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  if (lowerName.endsWith('.txt')) return 'text/plain';
  if (lowerName.match(/\.(png|jpg|jpeg|webp|tif|tiff)$/)) return file.type || 'image/*';

  return 'application/octet-stream';
}

async function extractResumeText(file: File, sourceType: string) {
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    if (sourceType === 'text/plain') {
      return await file.text();
    }

    if (sourceType === 'application/pdf') {
      const pdfParseModule = await import('pdf-parse');
      const pdfParse = pdfParseModule as unknown as (data: Buffer) => Promise<{ text?: string }>;
      const parsed = await pdfParse(buffer);
      return parsed.text ?? '';
    }

    if (sourceType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const mammoth = await import('mammoth');
      const parsed = await mammoth.extractRawText({ buffer });
      return parsed.value ?? '';
    }

    if (sourceType.startsWith('image/')) {
      const { extractTextWithOcr } = await import('@/lib/ocr');
      return await extractTextWithOcr(buffer);
    }
  } catch {
    return '';
  }

  return '';
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file');
  const candidateName = String(formData.get('candidateName') ?? '').trim();
  const targetRole = String(formData.get('targetRole') ?? '').trim();
  const jobSummary = String(formData.get('jobSummary') ?? '').trim();

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'A resume file is required.' }, { status: 400 });
  }

  const allowedTypes = new Set([
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ]);
  const sourceType = sourceTypeFromFile(file);

  if (!(allowedTypes.has(sourceType) || sourceType.startsWith('image/'))) {
    return NextResponse.json({ error: 'Only PDF, DOCX, and TXT files are supported for upload.' }, { status: 400 });
  }

  const rawText = await extractResumeText(file, sourceType);
  const uploadSummary = await summarizeUpload({
    id: '',
    filename: file.name,
    sourceType,
    status: 'ANALYZED',
    createdAt: new Date(),
    rawText,
    parsedData: {
      candidateName: candidateName || null,
      targetRole: targetRole || null,
      jobSummary: jobSummary || null
    }
  });

  const prisma = await getPrisma();
  const resume = await prisma.resume.create({
    data: {
      filename: file.name,
      sourceType,
      rawText,
      parsedData: {
        candidateName: candidateName || null,
        targetRole: targetRole || null,
        jobSummary: jobSummary || null,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        extractedSkills: uploadSummary.skills,
        yearsExperience: uploadSummary.yearsExperience,
        education: uploadSummary.education,
        analysis: uploadSummary.analysis
      },
      status: 'ANALYZED'
    }
  });

  return NextResponse.json({
    resume: {
      id: resume.id,
      filename: resume.filename,
      status: resume.status,
      candidateName: candidateName || null,
      targetRole: targetRole || null,
      extractedSkills: uploadSummary.skills,
      analysis: uploadSummary.analysis
    }
  });
}
