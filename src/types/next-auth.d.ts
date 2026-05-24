import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'ADMIN' | 'SITE_MANAGER' | 'FINANCE' | 'RECRUITER';
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    role?: 'ADMIN' | 'SITE_MANAGER' | 'FINANCE' | 'RECRUITER';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId?: string;
    role?: 'ADMIN' | 'SITE_MANAGER' | 'FINANCE' | 'RECRUITER';
  }
}
