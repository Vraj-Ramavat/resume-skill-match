'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { CloudUpload, FileText, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

type UploadResponse = {
  resume: {
    id: string;
    filename: string;
    status: string;
  };
};

export function ResumeUploadPanel() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [candidateName, setCandidateName] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [jobSummary, setJobSummary] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      setStatus('error');
      setMessage('Select a resume file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('candidateName', candidateName);
    formData.append('targetRole', targetRole);
    formData.append('jobSummary', jobSummary);

    startTransition(async () => {
      setStatus('idle');
      setMessage('');

      try {
        const response = await fetch('/api/resumes/upload', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          const error = (await response.json().catch(() => null)) as { error?: string } | null;
          throw new Error(error?.error ?? 'Upload failed');
        }

        const data = (await response.json()) as UploadResponse;
        setStatus('success');
        setMessage(`Uploaded ${data.resume.filename}. Next step: normalize skills and run semantic matching.`);
        setFile(null);
        setCandidateName('');
        setTargetRole('');
        setJobSummary('');
        router.refresh();
      } catch (error) {
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Upload failed');
      }
    });
  }

  return (
    <Card className="border-white/10 bg-white/5 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center gap-2 text-primary">
          <Sparkles className="h-4 w-4" />
          <Badge variant="secondary" className="border-white/10 bg-white/10 text-white">
            Primary workflow
          </Badge>
        </div>
        <CardTitle className="text-2xl text-white">Upload a candidate resume</CardTitle>
        <CardDescription>
          This is the starting point of the pipeline: upload the resume, then we parse, normalize, match, and prepare interview questions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200" htmlFor="candidateName">
                Candidate name
              </label>
              <Input id="candidateName" value={candidateName} onChange={(event) => setCandidateName(event.target.value)} placeholder="Ava Chen" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200" htmlFor="targetRole">
                Target role
              </label>
              <Input id="targetRole" value={targetRole} onChange={(event) => setTargetRole(event.target.value)} placeholder="Senior Platform Engineer" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200" htmlFor="jobSummary">
              Job description or hiring notes
            </label>
            <textarea
              id="jobSummary"
              value={jobSummary}
              onChange={(event) => setJobSummary(event.target.value)}
              placeholder="Paste the role requirements, key skills, and team context here."
              className="min-h-32 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <label className="group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[1.5rem] border border-dashed border-white/15 bg-white/5 px-6 py-10 text-center transition hover:border-primary/50 hover:bg-white/8">
            <CloudUpload className="h-10 w-10 text-primary" />
            <div className="space-y-1">
              <p className="text-base font-medium text-white">Drop a PDF, DOCX, or TXT resume here</p>
              <p className="text-sm text-muted-foreground">The file becomes the entry point for extraction and semantic matching.</p>
            </div>
            <input
              type="file"
              accept=".pdf,.docx,.txt,.png,.jpg,.jpeg,.webp,.tif,.tiff"
              className="sr-only"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
          </label>

          {file ? (
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
              <FileText className="h-4 w-4 text-primary" />
              <span className="truncate">{file.name}</span>
              <span className="ml-auto text-muted-foreground">{Math.ceil(file.size / 1024)} KB</span>
            </div>
          ) : null}

          {message ? (
            <div
              className={`rounded-2xl border px-4 py-3 text-sm ${
                status === 'success' ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200' : 'border-rose-400/20 bg-rose-400/10 text-rose-200'
              }`}
            >
              {message}
            </div>
          ) : null}

          <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {isPending ? 'Uploading resume...' : 'Upload and start analysis'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
