type ResumeAnalysisInput = {
  id: string;
  filename: string;
  sourceType: string;
  status: string;
  createdAt: Date;
  rawText: string | null;
  parsedData: Record<string, unknown> | null;
};

type PipelineStage = {
  label: string;
  score: number;
};

export type ResumeAnalysis = {
  candidateName: string;
  targetRole: string;
  jobSummary: string;
  skills: string[];
  yearsExperience: number;
  education: string;
  technicalScore: number;
  experienceScore: number;
  semanticScore: number;
  overallScore: number;
  readiness: 'Ready' | 'Review' | 'Watchlist';
  topGap: string;
  interviewQuestions: string[];
  auditTrail: string[];
  pipeline: PipelineStage[];
};

import { compareTextSimilarity } from '@/lib/embeddings';
import { canonicalSkills, getSkillAliases } from '@/lib/skill-taxonomy';

const EDUCATION_PATTERNS: Array<[string, RegExp]> = [
  ['PhD', /\b(ph\.d|phd|doctorate)\b/i],
  ['Master\'s', /\b(master|msc|m\.s\.|ms)\b/i],
  ['Bachelor\'s', /\b(bachelor|bsc|b\.s\.|bs|ba|b\.a\.)\b/i],
  ['Diploma', /\b(diploma|associate|associates|certificate)\b/i]
];

function readField(input: ResumeAnalysisInput, key: string) {
  const value = input.parsedData?.[key];
  return typeof value === 'string' ? value : '';
}

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9+./\s-]/g, ' ');
}

function normalizeSkill(skill: string) {
  return normalizeText(skill).replace(/\s+/g, ' ').trim();
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.max(minimum, Math.min(maximum, value));
}

function round(value: number) {
  return Math.round(value);
}

function extractSkills(text: string) {
  const normalized = normalizeText(text);
  const skills = new Set<string>();

  for (const skill of canonicalSkills) {
    const aliases = getSkillAliases(skill);
    if (aliases.some((alias) => normalized.includes(alias))) {
      skills.add(skill);
    }
  }

  return [...skills];
}

function extractYearsExperience(text: string) {
  const normalized = normalizeText(text);
  const matches = [...normalized.matchAll(/(\d{1,2}(?:\.\d)?)\s*\+?\s*years?/g)].map((match) => Number(match[1]));

  if (matches.length) {
    return Math.max(...matches);
  }

  return 0;
}

function extractEducation(text: string) {
  for (const [label, pattern] of EDUCATION_PATTERNS) {
    if (pattern.test(text)) {
      return label;
    }
  }

  return 'Not stated';
}

function buildQuestions(skills: string[], targetRole: string) {
  const questions = skills.slice(0, 5).map((skill) => `Tell me about a project where you used ${skill}.`);

  if (!questions.length && targetRole) {
    questions.push(`How does your background prepare you for the ${targetRole} role?`);
  }

  if (!questions.length) {
    questions.push('Walk me through the strongest evidence of impact in this resume.');
  }

  return questions;
}

export async function analyzeResume(input: ResumeAnalysisInput): Promise<ResumeAnalysis> {
  const candidateName = readField(input, 'candidateName') || input.filename.replace(/\.[^.]+$/, '').trim();
  const targetRole = readField(input, 'targetRole');
  const jobSummary = readField(input, 'jobSummary');

  const analysisText = [input.rawText, candidateName, targetRole, jobSummary, input.filename].filter(Boolean).join('\n');
  const resumeSkills = extractSkills(analysisText);
  const roleSkillsText = [targetRole, jobSummary].filter(Boolean).join('\n');
  const roleSkills = extractSkills(roleSkillsText);
  const overlap = roleSkills.filter((skill) => resumeSkills.includes(skill));
  const missing = roleSkills.filter((skill) => !resumeSkills.includes(skill));
  const yearsExperience = extractYearsExperience(analysisText);
  const education = extractEducation(analysisText);

  const embeddingSimilarity = roleSkillsText ? Math.max(0, Math.min(1, await compareTextSimilarity(analysisText, roleSkillsText))) : 0;

  const technicalScore = roleSkills.length
    ? clamp(round((overlap.length / roleSkills.length) * 100 + embeddingSimilarity * 20), 15, 100)
    : clamp(40 + resumeSkills.length * 4 + embeddingSimilarity * 15, 25, 95);

  const experienceScore = clamp(round(yearsExperience * 14 + Math.min(35, analysisText.length / 120)), 15, 100);
  const semanticScore = clamp(round(technicalScore * 0.45 + experienceScore * 0.25 + embeddingSimilarity * 100 * 0.3), 15, 100);
  const overallScore = round((technicalScore + experienceScore + semanticScore) / 3);

  const readiness: ResumeAnalysis['readiness'] = overallScore >= 75 ? 'Ready' : overallScore >= 50 ? 'Review' : 'Watchlist';
  const topGap =
    missing[0] ??
    (roleSkills[0] ? `Needs stronger evidence for ${roleSkills[0]}` : resumeSkills[0] ? `Add more detail around ${resumeSkills[0]}` : 'Need more role-specific evidence');

  const interviewQuestions = buildQuestions(missing.length ? missing : resumeSkills, targetRole);

  const parseScore = input.rawText?.trim() ? 100 : 48;
  const normalizeScore = clamp(40 + resumeSkills.length * 5 + Math.round(embeddingSimilarity * 25), 35, 100);
  const interviewScore = clamp(50 + interviewQuestions.length * 10, 50, 100);

  return {
    candidateName,
    targetRole,
    jobSummary,
    skills: resumeSkills,
    yearsExperience,
    education,
    technicalScore,
    experienceScore,
    semanticScore,
    overallScore,
    readiness,
    topGap,
    interviewQuestions,
    auditTrail: [
      `Parsed ${input.filename} into structured resume data`,
      `Normalized ${resumeSkills.length} skill signals from the uploaded resume`,
      `Computed embedding similarity against the target role description`,
      `Matched ${overlap.length} role signals against the provided target role`,
      `Prepared ${interviewQuestions.length} interview questions from the actual upload`
    ],
    pipeline: [
      { label: 'Parse', score: parseScore },
      { label: 'Normalize', score: normalizeScore },
      { label: 'Match', score: technicalScore },
      { label: 'Interview Plan', score: interviewScore }
    ]
  };
}

export async function summarizeUpload(input: ResumeAnalysisInput) {
  const analysis = await analyzeResume(input);

  return {
    candidateName: analysis.candidateName,
    targetRole: analysis.targetRole,
    jobSummary: analysis.jobSummary,
    skills: analysis.skills,
    yearsExperience: analysis.yearsExperience,
    education: analysis.education,
    analysis: {
      technicalScore: analysis.technicalScore,
      experienceScore: analysis.experienceScore,
      semanticScore: analysis.semanticScore,
      overallScore: analysis.overallScore,
      readiness: analysis.readiness,
      topGap: analysis.topGap,
      interviewQuestions: analysis.interviewQuestions,
      auditTrail: analysis.auditTrail,
      pipeline: analysis.pipeline
    }
  };
}