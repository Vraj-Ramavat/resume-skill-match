export type SkillNode = {
  category: string;
  skill: string;
  aliases: string[];
};

export const skillTaxonomy: SkillNode[] = [
  { category: 'Frontend', skill: 'React', aliases: ['react', 'react.js', 'reactjs'] },
  { category: 'Frontend', skill: 'Next.js', aliases: ['next.js', 'nextjs', 'next js'] },
  { category: 'Frontend', skill: 'TypeScript', aliases: ['typescript', 'ts'] },
  { category: 'Frontend', skill: 'JavaScript', aliases: ['javascript', 'js'] },
  { category: 'Frontend', skill: 'Tailwind CSS', aliases: ['tailwind css', 'tailwindcss'] },
  { category: 'Frontend', skill: 'Radix UI', aliases: ['radix ui'] },
  { category: 'Frontend', skill: 'shadcn/ui', aliases: ['shadcn/ui', 'shadcn ui'] },
  { category: 'Frontend', skill: 'TanStack Query', aliases: ['tanstack query', 'react query'] },
  { category: 'Frontend', skill: 'TanStack Table', aliases: ['tanstack table'] },
  { category: 'Frontend', skill: 'Zustand', aliases: ['zustand'] },
  { category: 'Backend', skill: 'Node.js', aliases: ['node.js', 'nodejs'] },
  { category: 'Backend', skill: 'FastAPI', aliases: ['fastapi'] },
  { category: 'Backend', skill: 'REST APIs', aliases: ['rest api', 'rest apis', 'restful api', 'restful apis'] },
  { category: 'Backend', skill: 'GraphQL', aliases: ['graphql'] },
  { category: 'Backend', skill: 'JWT', aliases: ['jwt'] },
  { category: 'Backend', skill: 'OAuth', aliases: ['oauth'] },
  { category: 'Backend', skill: 'bcrypt', aliases: ['bcrypt', 'bcryptjs'] },
  { category: 'Data', skill: 'PostgreSQL', aliases: ['postgresql', 'postgres'] },
  { category: 'Data', skill: 'SQLite', aliases: ['sqlite'] },
  { category: 'Data', skill: 'Prisma', aliases: ['prisma'] },
  { category: 'Data', skill: 'Redis', aliases: ['redis'] },
  { category: 'Data', skill: 'ChromaDB', aliases: ['chromadb', 'chroma db', 'chroma'] },
  { category: 'Data', skill: 'Vector Embeddings', aliases: ['embedding', 'embeddings', 'vector embedding', 'vector embeddings'] },
  { category: 'Data', skill: 'Data Analysis', aliases: ['analysis', 'analytics', 'metrics'] },
  { category: 'Cloud', skill: 'AWS', aliases: ['aws', 'amazon web services'] },
  { category: 'Cloud', skill: 'Google Cloud', aliases: ['google cloud', 'gcp'] },
  { category: 'Cloud', skill: 'Azure', aliases: ['azure'] },
  { category: 'Cloud', skill: 'Terraform', aliases: ['terraform'] },
  { category: 'Cloud', skill: 'Kubernetes', aliases: ['kubernetes', 'k8s'] },
  { category: 'Cloud', skill: 'Docker', aliases: ['docker'] },
  { category: 'DevOps', skill: 'CI/CD', aliases: ['ci/cd', 'ci cd', 'github actions', 'gitlab ci'] },
  { category: 'DevOps', skill: 'Git', aliases: ['git', 'github'] },
  { category: 'DevOps', skill: 'Linux', aliases: ['linux'] },
  { category: 'AI/ML', skill: 'LLM', aliases: ['llm', 'llms', 'large language model', 'large language models'] },
  { category: 'AI/ML', skill: 'LangGraph', aliases: ['langgraph'] },
  { category: 'AI/ML', skill: 'Llama 3', aliases: ['llama 3', 'llama3'] },
  { category: 'AI/ML', skill: 'Machine Learning', aliases: ['machine learning', 'ml'] },
  { category: 'AI/ML', skill: 'Prompt Engineering', aliases: ['prompt engineering', 'prompting'] },
  { category: 'Security', skill: 'Security', aliases: ['security', 'secure'] },
  { category: 'Security', skill: 'Sentry', aliases: ['sentry'] },
  { category: 'Integration', skill: 'Stripe', aliases: ['stripe'] },
  { category: 'Integration', skill: 'Shippo', aliases: ['shippo'] },
  { category: 'Integration', skill: 'ImageKit', aliases: ['imagekit'] },
  { category: 'Integration', skill: 'Upstash', aliases: ['upstash'] },
  { category: 'Integration', skill: 'QStash', aliases: ['qstash'] },
  { category: 'Documents', skill: 'ExcelJS', aliases: ['exceljs', 'excel js'] },
  { category: 'Documents', skill: 'jsPDF', aliases: ['jspdf', 'js pdf'] },
  { category: 'Documents', skill: 'QRCode', aliases: ['qrcode', 'qr code'] },
  { category: 'Leadership', skill: 'Leadership', aliases: ['leadership', 'mentoring', 'team lead', 'staff engineer', 'principal engineer'] },
  { category: 'Leadership', skill: 'Testing', aliases: ['test', 'testing', 'unit test', 'integration test'] }
];

export const canonicalSkills = [...new Set(skillTaxonomy.map((entry) => entry.skill))];

export function getSkillAliases(skill: string) {
  return skillTaxonomy.find((entry) => entry.skill === skill)?.aliases ?? [];
}