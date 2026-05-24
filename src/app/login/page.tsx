import { LoginForm } from '@/components/auth/login-form';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <section className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
        <div className="mb-8 space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-primary">MindHatch</p>
          <h1 className="text-3xl font-semibold text-white">Sign in to review candidates</h1>
          <p className="text-sm leading-6 text-slate-300">Use your recruiter or admin account to access the matching pipeline and interview plans.</p>
        </div>
        <LoginForm />
      </section>
    </main>
  );
}
