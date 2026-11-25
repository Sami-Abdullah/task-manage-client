"use client";
import { useForm } from "react-hook-form";
import { signIn, useSession } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { data, isPending } = useSession();
  const [errorMsg, setErrorMsg] = useState("");
  
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    if (isPending || !data?.user) return;
    router.replace(data.user.role === "supervisor" ? "/supervisor" : "/operator");
  }, [data, isPending, router]);

  async function submit(values) {
    setErrorMsg("");
    const { error } = await signIn.email(values);
    if (error) setErrorMsg(error.message || "Invalid credentials");
  }

  return (
    <div className="min-h-screen grid place-items-center bg-base-200 px-4">
      <form onSubmit={handleSubmit(submit)} className="card bg-base-100 p-6 sm:p-8 w-full max-w-sm space-y-4 shadow-xl border border-base-300">
        <h1 className="text-2xl font-extrabold text-center text-primary">TaskFlow</h1>
        
        <div className="form-control w-full">
          <label className="label"><span className="label-text">Email</span></label>
          <input {...register("email", { required: true })} type="email" placeholder="you@company.com" className="input input-bordered w-full" />
        </div>
        
        <div className="form-control w-full">
          <label className="label"><span className="label-text">Password</span></label>
          <input {...register("password", { required: true })} type="password" placeholder="••••••••" className="input input-bordered w-full" />
        </div>

        {errorMsg && <div className="alert alert-error text-sm py-2">{errorMsg}</div>}

        <button disabled={isSubmitting} className="btn btn-primary w-full mt-2">
          {isSubmitting ? <span className="loading loading-spinner loading-sm" /> : "Sign In"}
        </button>
        
        <p className="text-center text-sm text-base-content/60 mt-2">
          New here? <Link href="/register" className="link link-primary">Register</Link>
        </p>
      </form>
    </div>
  );
}