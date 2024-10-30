import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  token?: string;
}

const secretKey = process.env.NEXTAUTH_SECRET!;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'email@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      // @ts-ignore
      async authorize(credentials: { email: string; password: string }) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          const response = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const user = await response.json();

          if (!response.ok) {
            return Promise.reject(new Error(user.message || 'Login failed'));
          }

          if (user && user.token) {
            console.log(user)
            return {
              id: user.adminId,
              email: user.email,
              name: `${user.firstName} ${user.lastName}`,
              token: user.token,
            };
          }
          return null;
        } catch (error) {
          return Promise.reject(new Error('Authentication error, please try again'));
        }
      },
    }),
  ],
  secret: secretKey,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      if (token?.id) {
        session.user = {
          ...session.user,
          // @ts-ignore
          id: token.id as string,
        };
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/', // Custom sign-in page
    error: '/', // Error page to display authentication errors
  },
};

export default NextAuth(authOptions);
