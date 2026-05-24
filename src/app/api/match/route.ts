import { NextResponse } from 'next/server';
import { z } from 'zod';

const matchRequestSchema = z.object({
  candidateSkills: z.array(z.string()).default([]),
  jobSkills: z.array(z.string()).default([]),
  candidateSummary: z.string().default(''),
  jobSummary: z.string().default('')
});

function normalizeSkill(skill: string) {
  return skill.toLowerCase().replace(/[^a-z0-9+]/g, ' ').replace(/\s+/g, ' ').trim();
}

export async function POST(request: Request) {
  const payload = matchRequestSchema.parse(await request.json());

  const normalizedCandidate = new Set(payload.candidateSkills.map(normalizeSkill));
  const normalizedJob = new Set(payload.jobSkills.map(normalizeSkill));

  const overlap = [...normalizedJob].filter((skill) => normalizedCandidate.has(skill));
  const missing = [...normalizedJob].filter((skill) => !normalizedCandidate.has(skill));
  const semanticScore = normalizedJob.size === 0 ? 0 : Math.round((overlap.length / normalizedJob.size) * 100);

  return NextResponse.json({
    score: {
      technical: semanticScore,
      experience: Math.min(100, semanticScore + 5),
      semantic: semanticScore,
      overall: Math.round((semanticScore + Math.min(100, semanticScore + 5)) / 2)
    },
    overlap,
    missing,
    summary: {
      candidateSummary: payload.candidateSummary,
      jobSummary: payload.jobSummary
    },
    interviewQuestions: missing.slice(0, 5).map((skill) => `Tell us about your experience with ${skill}.`)
  });
}
