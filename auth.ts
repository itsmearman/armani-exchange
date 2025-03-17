import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

// This would typically come from your database
const USERS = [
  {
    id: "1",
    email: "test@example.com",
    // This is 'password123' hashed with bcrypt
    // password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LHZzpZCHWVUbvCGTi",
    password: "password123",
    name: "Test User",
  },
];

export const { auth, handlers } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "test@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Missing credentials");
          }

          // In a real application, you would fetch this from your database
          const user = USERS.find((user) => user.email === credentials.email);

          if (!user) {
            throw new Error(
              "User not found. Please check your email or sign up."
            );
          }

          const isPasswordValid = await (credentials.password as string,
          user.password);

          if (!isPasswordValid) {
            throw new Error("Invalid password. Please try again.");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          // Log the error for debugging (in a real app, use proper logging)
          console.error("Authentication error:", error);
          // Rethrow the error to be handled by NextAuth
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  // Add callbacks to handle errors
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export type Session = {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};
