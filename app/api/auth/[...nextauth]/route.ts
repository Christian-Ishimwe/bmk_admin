import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
     async authorize(credentials) {
  if (!credentials?.email || !credentials?.password) {
    console.error('Missing email or password');
    return null;
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
      console.error('Login failed:', user.message || 'Unknown error');
      return null;
    }

    if (user && user.token) {
      return {
        id: user.adminId,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        token: user.token,
      };
    }
    return null;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user  && token) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.accessToken = token
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        //@ts-ignore
        session.user.id = token.id
        //@ts-ignore
        session.user.email = token.email
        //@ts-ignore
        session.user.name = token.name
        //@ts-ignore
        session.accessToken = token.accessToken
      }
      return session
    }
  },
  pages: {
    signIn: '/',
  },
  session: {
    strategy: 'jwt',
  },
})

export { handler as GET, handler as POST }