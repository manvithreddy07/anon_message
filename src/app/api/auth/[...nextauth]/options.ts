import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: {
          label: "Email or Username",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
// eslint-disable-next-line @typescript-eslint/no-explicit-any
      async authorize(credentials):Promise<any> {
        await dbConnect();
        try {
          if (!credentials?.identifier || !credentials?.password) {
            throw new Error(
              "Please enter both email/username and password."
            );
          }
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
          if (!user) {
            throw new Error(
              "No user found with this email or username."
            );
          }
          // Prevent password login for Google accounts
          if (user.authProvider === "google") {
            throw new Error(
              "This account was created with Google. Please sign in using Google."
            );
          }
          if (!user.isVerified) {
            throw new Error(
              "Please verify your account before logging in."
            );
          }
          if (!user.password) {
            throw new Error("Password not found for this account.");
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isPasswordCorrect) {
            throw new Error("Incorrect password.");
          }
          return user;
        } catch (error) {
          if (error instanceof Error) {
            throw error;
          }
          throw new Error("Something went wrong.");
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") {
        return true;
      }
      if (!user.email) {
        return false;
      }
      await dbConnect();
      const existingUser = await UserModel.findOne({
        email: user.email,
      });
      // User already exists
      if (existingUser) {
        // Don't allow Google login for Credentials account
        if (existingUser.authProvider === "credentials") {
          throw new Error(
            "An account with this email already exists. Please sign in using your email and password."
          );
        }
        return true;
      }
      // Generate unique username
      const baseUsername = user.email.split("@")[0];
      let username = baseUsername;
      while (await UserModel.findOne({ username })) {
        username = `${baseUsername}${Math.floor(
          1000 + Math.random() * 9000
        )}`;
      }
      await UserModel.create({
        username,
        email: user.email,
        authProvider: "google",
        image: user.image ?? "",
        isVerified: true,
        isAcceptingMessages: true,
      });
      return true;
    },
    async jwt({ token, user }) {
      // Fetch from DB only during sign in
      if (user?.email) {
        await dbConnect();
        const dbUser = await UserModel.findOne({
          email: user.email,
        });
        if (dbUser) {
          token._id = dbUser._id.toString();
          token.username = dbUser.username;
          token.email = dbUser.email;
          token.image = dbUser.image;
          token.isVerified = dbUser.isVerified;
          token.isAcceptingMessages = dbUser.isAcceptingMessages;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user._id = token._id as string;
        session.user.username = token.username as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
        session.user.isVerified = token.isVerified as boolean;
        session.user.isAcceptingMessages =
          token.isAcceptingMessages as boolean;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/sign-in",
    error:'/sign-in'
  },
};

