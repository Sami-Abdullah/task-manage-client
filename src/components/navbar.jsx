"use client";
import Link from "next/link";
import { useSession, signOut } from "@/lib/auth";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { data, isPending } = useSession();
  const router = useRouter();
  const user = data?.user;

  async function logout() {
    await signOut();
    router.replace("/");
  }

  return (
    <header className="border-b border-base-300 bg-base-200/50 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="font-extrabold text-xl text-primary">TaskFlow</Link>
        <div className="flex gap-4 items-center">
          {isPending ? null : !user ? (
            <Link href="/register" className="btn btn-primary btn-sm md:btn-md">Register</Link>
          ) : (
            <>
              <span className="text-sm hidden sm:block">
                {user.name} <span className="badge badge-sm">{user.role}</span>
              </span>
              <button className="btn btn-ghost btn-sm md:btn-md" onClick={logout}>Sign out</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}