'use client';

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export type PipelineStage = {
  label: string;
  score: number;
};

export function ResumeAnalysisChart({ data }: { data: PipelineStage[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="resumeAnalysisGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(173 92% 55%)" stopOpacity={0.35} />
              <stop offset="95%" stopColor="hsl(173 92% 55%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} stroke="rgba(255,255,255,0.45)" />
          <YAxis tickLine={false} axisLine={false} domain={[0, 100]} stroke="rgba(255,255,255,0.45)" />
          <Tooltip
            contentStyle={{
              background: 'rgba(15, 23, 42, 0.96)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 18,
              color: 'white'
            }}
          />
          <Area type="monotone" dataKey="score" stroke="hsl(173 92% 55%)" strokeWidth={3} fill="url(#resumeAnalysisGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
