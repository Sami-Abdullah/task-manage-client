"use client";
import { useForm } from "react-hook-form";
import { signUp } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  async function submit(values) {
    setErrorMsg("");
    const { error } = await signUp.email(values);
    if (error) return setErrorMsg(error.message || "Registration failed");
    router.replace("/operator");
  }

  return (
    <div className="min-h-screen grid place-items-center bg-base-200 px-4 py-8">
      <form onSubmit={handleSubmit(submit)} className="card bg-base-100 p-6 sm:p-8 w-full max-w-sm space-y-4 shadow-xl border border-base-300">
        <h1 className="text-2xl font-extrabold text-center text-primary">Register</h1>
        
        <div className="form-control w-full">
          <label className="label"><span className="label-text">Name</span></label>
          <input {...register("name", { required: true })} placeholder="Jane Doe" className="input input-bordered w-full" />
        </div>

        <div className="form-control w-full">
          <label className="label"><span className="label-text">Email</span></label>
          <input {...register("email", { required: true })} type="email" placeholder="you@company.com" className="input input-bordered w-full" />
        </div>
        
        <div className="form-control w-full">
          <label className="label"><span className="label-text">Password</span></label>
          <input {...register("password", { required: true, minLength: 6 })} type="password" placeholder="Min 8 characters" className="input input-bordered w-full" />
        </div>

        {errorMsg && <div className="alert alert-error text-sm py-2">{errorMsg}</div>}

        <button disabled={isSubmitting} className="btn btn-primary w-full mt-2">
          {isSubmitting ? <span className="loading loading-spinner loading-sm" /> : "Create Account"}
        </button>
        
        <p className="text-center text-sm text-base-content/60 mt-2">
          Already have an account? <Link href="/" className="link link-primary">Sign In</Link>
        </p>
      </form>
    </div>
  );
}