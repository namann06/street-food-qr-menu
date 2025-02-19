import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    role: string;
    shopId?: string;
  }

  interface Session {
    user: {
      id: string;
      role: string;
      shopId?: string;
    } & DefaultSession['user'];
  }
}
