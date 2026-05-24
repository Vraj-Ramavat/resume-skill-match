import { ResumeAnalysisChart } from '@/components/resume/resume-analysis-chart';
import { analyzeResume } from '@/lib/resume-analysis';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export type ResumeRecord = {
  id: string;
  filename: string;
  sourceType: string;
  status: string;
  createdAt: Date;
  rawText: string | null;
  parsedData: {
    candidateName?: string | null;
    targetRole?: string | null;
    jobSummary?: string | null;
    extractedSkills?: string[] | null;
    yearsExperience?: number | null;
    education?: string | null;
  } | null;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export async function ResumeDashboard({ resumes }: { resumes: ResumeRecord[] }) {
  const analyses = await Promise.all(resumes.map(async (resume) => ({ resume, analysis: await analyzeResume(resume) })));
  const latest = analyses[0];
  const latestResume = latest?.resume;
  const latestAnalysis = latest?.analysis;
  const totalSkills = new Set(analyses.flatMap(({ analysis }) => analysis.skills)).size;
  const readyCount = analyses.filter(({ analysis }) => analysis.readiness === 'Ready').length;
  const reviewedCount = analyses.filter(({ analysis }) => analysis.readiness === 'Review').length;

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-10 sm:px-6 lg:px-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Uploaded resumes</CardDescription>
            <CardTitle className="text-4xl text-white">{resumes.length}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Every card below is derived from the uploaded resume records in the database.</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Latest semantic score</CardDescription>
            <CardTitle className="text-4xl text-white">{latestAnalysis ? `${latestAnalysis.semanticScore}%` : 'No data'}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {latestResume ? `${latestResume.filename} · ${formatDate(latestResume.createdAt)}` : 'Upload a resume to start the workflow.'}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Ready for review</CardDescription>
            <CardTitle className="text-4xl text-white">{readyCount}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Reviewed candidates: {reviewedCount}. Extracted skills: {totalSkills}.</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pipeline progress</CardTitle>
          <CardDescription>The visible stages below come directly from the latest uploaded resume and its extracted text.</CardDescription>
        </CardHeader>
        <CardContent>
          {latestAnalysis ? (
            <ResumeAnalysisChart data={latestAnalysis.pipeline} />
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-white/15 bg-white/5 p-10 text-center text-sm text-muted-foreground">
              No resumes have been uploaded yet. Use the upload panel above to start the workflow.
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Uploaded resumes</CardTitle>
          <CardDescription>Each row is calculated from the uploaded resume text, filename, and role details.</CardDescription>
        </CardHeader>
        <CardContent>
          {analyses.length ? (
            <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5">
              <table className="w-full text-sm">
                <thead className="border-b border-white/10 bg-white/5 text-left">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Candidate</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Score</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Readiness</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Skills</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Top Gap</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {analyses.map(({ resume, analysis }) => (
                    <tr key={resume.id} className="transition-colors hover:bg-white/5">
                      <td className="px-4 py-4 align-middle">
                        <div className="space-y-1">
                          <div className="font-semibold text-white">{analysis.candidateName}</div>
                          <div className="text-xs text-muted-foreground">{resume.filename}</div>
                          <div className="text-xs text-muted-foreground">{analysis.targetRole || 'No target role provided'}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 align-middle">
                        <div className="space-y-1 text-white">
                          <div>{analysis.overallScore}% overall</div>
                          <div className="text-xs text-muted-foreground">
                            Tech {analysis.technicalScore}% · Exp {analysis.experienceScore}% · Sem {analysis.semanticScore}%
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 align-middle">
                        <Badge
                          variant={analysis.readiness === 'Ready' ? 'success' : analysis.readiness === 'Review' ? 'warning' : 'secondary'}
                        >
                          {analysis.readiness}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 align-middle text-muted-foreground">
                        {analysis.skills.length ? analysis.skills.slice(0, 6).join(', ') : 'No skills extracted yet'}
                      </td>
                      <td className="px-4 py-4 align-middle text-muted-foreground">{analysis.topGap}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {latestAnalysis ? (
        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <Card>
            <CardHeader>
              <CardTitle>Interview intelligence</CardTitle>
              <CardDescription>These questions come from the actual gaps and skills found in the latest uploaded resume.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Experience</p>
                  <p className="mt-2 text-white">{latestAnalysis.yearsExperience ? `${latestAnalysis.yearsExperience} years detected` : 'No explicit years detected'}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Education</p>
                  <p className="mt-2 text-white">{latestAnalysis.education}</p>
                </div>
              </div>
              <div className="space-y-3 pt-2">
                {latestAnalysis.interviewQuestions.map((question) => (
                  <div key={question} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-200">
                    {question}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Audit trail</CardTitle>
              <CardDescription>The steps below are generated from the uploaded resume analysis, not from canned data.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              {latestAnalysis.auditTrail.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 leading-6 text-slate-200">
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </section>
  );
}
