import { ResumeUploadPanel } from '@/components/resume/resume-upload-panel';
import { ResumeDashboard, type ResumeRecord } from '@/components/resume/resume-dashboard';
import { getPrisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const prisma = await getPrisma();
  const resumes = (await prisma.resume.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      filename: true,
      sourceType: true,
      status: true,
      createdAt: true,
      rawText: true,
      parsedData: true
    }
  })) as ResumeRecord[];

  return (
    <main className="space-y-6">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pt-6 sm:px-6 lg:px-8">
        <ResumeUploadPanel />
      </section>
      <ResumeDashboard resumes={resumes} />
    </main>
  );
}
