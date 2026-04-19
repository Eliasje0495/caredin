import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  pages: {
    signIn:  "/inloggen",
    signOut: "/",
    error:   "/inloggen",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email:    { label: "E-mail",    type: "email" },
        password: { label: "Wachtwoord", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email.toLowerCase() } });
        if (!user?.password) return null;
        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;
        await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
    CredentialsProvider({
      id: "magic",
      name: "magic",
      credentials: {
        email: { label: "E-mail", type: "email" },
        token: { label: "Token",  type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.token) return null;
        const email = credentials.email.toLowerCase();
        const record = await prisma.verificationToken.findFirst({
          where: { identifier: email, token: credentials.token },
        });
        if (!record) return null;
        if (record.expires < new Date()) {
          await prisma.verificationToken.delete({ where: { identifier_token: { identifier: email, token: credentials.token } } });
          return null;
        }
        await prisma.verificationToken.delete({ where: { identifier_token: { identifier: email, token: credentials.token } } });
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;
        await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) { token.id = (user as any).id; token.role = (user as any).role; }
      return token;
    },
    async session({ session, token }) {
      if (token) { (session.user as any).id = token.id; (session.user as any).role = token.role; }
      return session;
    },
  },
};
