import NextAuth, { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { getPrisma } from '@/lib/prisma';
import { env } from '@/lib/env';
import type { Role } from '@/lib/rbac';

const googleClientId = env.GOOGLE_CLIENT_ID?.trim();
const googleClientSecret = env.GOOGLE_CLIENT_SECRET?.trim();

const providers: NextAuthConfig['providers'] = [
  Credentials({
    name: 'Credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' }
    },
    async authorize(credentials) {
      const email = credentials?.email?.toString().toLowerCase().trim();
      const password = credentials?.password?.toString();

      if (!email || !password) {
        return null;
      }

      const prisma = await getPrisma();
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user?.passwordHash) {
        return null;
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);

      if (!isValid) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      };
    }
  })
];

if (googleClientId && googleClientSecret) {
  providers.unshift(
    Google({
      clientId: googleClientId,
      clientSecret: googleClientSecret
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: env.AUTH_SECRET ?? env.NEXTAUTH_SECRET ?? 'mindhatch-development-secret',
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login'
  },
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = ((user as { role?: Role }).role ?? 'RECRUITER') as Role;
        token.userId = user.id;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId ?? token.sub ?? '';
        session.user.role = (token.role as 'ADMIN' | 'SITE_MANAGER' | 'FINANCE' | 'RECRUITER') ?? 'RECRUITER';
      }

      return session;
    }
  }
});
