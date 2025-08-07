import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account, profile }) {
      // Store the user ID (from profile or account)
      if (account && profile) {
        token.userId = profile.sub ?? profile.id; // <- fallback
      }
      return token;
    },
    async session({ session, token }) {
      // Inject it into session.user
      if (session?.user && token?.userId) {
        session.user.id = token.userId as string;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };