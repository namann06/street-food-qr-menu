import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Shop from '@/models/Shop';
import { JWT } from 'next-auth/jwt';

interface CustomUser {
  id: string;
  email: string;
  name: string;
  role: string;
  shopId?: string;
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Please provide email and password');
          }

          // Connect to DB with timeout
          try {
            await Promise.race([
              connectDB(),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Database connection timeout')), 5000)
              )
            ]);
          } catch (error) {
            console.error('Database connection error:', error);
            throw new Error('Unable to connect to database. Please try again.');
          }

          // Find user with timeout
          let user;
          try {
            user = await User.findOne({ email: credentials.email }).maxTimeMS(3000).exec();
          } catch (error) {
            console.error('User lookup error:', error);
            throw new Error('Error looking up user. Please try again.');
          }

          if (!user) {
            throw new Error('No user found with this email');
          }

          // Verify password
          let isValid;
          try {
            isValid = await bcrypt.compare(credentials.password, user.password);
          } catch (error) {
            console.error('Password verification error:', error);
            throw new Error('Error verifying password. Please try again.');
          }

          if (!isValid) {
            throw new Error('Invalid password');
          }

          // Find shop with timeout
          let shop;
          try {
            shop = await Shop.findOne({ owner: user._id }).maxTimeMS(3000).exec();
          } catch (error) {
            console.error('Shop lookup error:', error);
            // Don't throw here, shop is optional
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            shopId: shop ? shop._id.toString() : undefined,
          };
        } catch (error) {
          console.error('Authorization error:', error);
          throw error;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as CustomUser).role;
        token.shopId = (user as CustomUser).shopId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.shopId = token.shopId as string | undefined;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
