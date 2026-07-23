'use client';

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { User } from "next-auth";
import { MessageCircle, LogOut } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 transition hover:opacity-90"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/30">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-wide text-white">
              Anon<span className="text-cyan-400">Message</span>
            </h1>

            <p className="text-xs text-gray-400">
              Anonymous Feedback
            </p>
          </div>
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-4">

          {session ? (
            <>
              <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 backdrop-blur md:block">
                Welcome,
                <span className="ml-1 font-semibold text-cyan-400">
                  {user.username || user.email}
                </span>
              </div>

              <Button
                onClick={() => signOut()}
                className="rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 transition-all hover:bg-red-500 hover:text-white"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button className="rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 px-6 text-white shadow-lg shadow-cyan-500/30 transition-all hover:scale-105 hover:from-cyan-400 hover:to-blue-500">
                Login
              </Button>
            </Link>
          )}

        </div>
      </div>
    </header>
  );
}