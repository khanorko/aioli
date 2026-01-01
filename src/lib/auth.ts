import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getUserByEmail, createUser } from "./db";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      // Create or get user in our database
      let dbUser = await getUserByEmail(user.email);
      if (!dbUser) {
        dbUser = await createUser(user.email);
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user && user.email) {
        const dbUser = await getUserByEmail(user.email);
        if (dbUser) {
          token.userId = dbUser.id;
          token.credits = dbUser.credits;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.credits = token.credits as number;
      }
      return session;
    },
  },
};
