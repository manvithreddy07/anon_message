import 'next-auth';
import { DefaultSession } from "next-auth";
declare module "next-auth" {
  interface Session {
    user: {
      _id?: string;
      username?: string;
      isVerified?: boolean;
      isAcceptingMessages?: boolean;
      image?: string | null;
      email?: string | null;
    } & DefaultSession["user"];
  }
  interface User {
    _id?: string;
    username?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    image?: string | null;
    email?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    username?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    image?: string | null;
    email?: string;
  }
}