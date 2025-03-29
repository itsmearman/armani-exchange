import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import bcrypt from "bcryptjs";

// برای محیط توسعه - در پروژه واقعی از دیتابیس استفاده کنید
const USERS = [
  {
    id: "1",
    email: "test@example.com",
    password: "$2b$10$mKgiSHMGVBjwvz.7YOMoGuVahUx3f4VKy8JPyalPM36onn.dlFD3y",
    // password:"password123",
    name: "Test User 1",
  },
  {
    id: "2",
    email: "afggf@sgf",
    password: "$2y$10$NIb6qI.OQghDVpy5MQ.zKO2cANrlN6YM6hEKkr4Seje0ldaMZrvW.",
    // password:"password123",
    name: "Test User 2",
  },
];

export const authConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          // 1. بررسی وجود ایمیل و رمز
          if (!credentials?.email || !credentials?.password) {
            throw new Error("لطفا ایمیل و رمز عبور را وارد کنید");
          }

          // 2. پیدا کردن کاربر
          // در پروژه واقعی: const user = await getUserByEmail(credentials.email);
          const user = USERS.find(user => user.email === credentials.email);

          if (!user?.email || !user.password) {
            throw new Error("کاربری با این ایمیل یافت نشد");
          }

          // 3. مقایسه رمز عبور
          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          ) ;

          if (!isPasswordValid) {
            throw new Error("رمز عبور اشتباه است");
          }

          // 4. برگرداندن اطلاعات کاربر
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login', // صفحه برای نمایش خطاهای احراز هویت
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 روز
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);