"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Scale } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { authApi } from "@/lib/api/auth.api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const result = await authApi.requestPasswordReset(email.trim());
      setMessage(result.message);
    } catch (err: any) {
      setError(err?.response?.data?.message || "We couldn't send the reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#060a14] p-4 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/15 via-[#060a14] to-[#060a14]" />
      <section className="relative z-10 w-full max-w-md space-y-7 rounded-3xl border border-blue-500/25 bg-[#090f1e]/90 p-8 shadow-[0_0_50px_rgba(37,99,235,0.2)] backdrop-blur-2xl">
        <header className="space-y-3 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="rounded-2xl border border-blue-400/40 bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 p-2.5"><Scale className="h-6 w-6" /></span>
            <span className="text-2xl font-bold tracking-tight">LEGAL<span className="text-blue-400">BUDDY</span></span>
          </Link>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-300"><Mail className="h-5 w-5" /></div>
          <h1 className="text-xl font-bold">Forgot your password?</h1>
          <p className="text-sm text-slate-400">Enter your account email and we’ll send you a link to reset your password.</p>
        </header>
        {message ? (
          <div role="status" className="space-y-5">
            <p className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300">{message}</p>
            <Link href="/login" className="flex items-center justify-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300"><ArrowLeft className="h-4 w-4" /> Back to sign in</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <p role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">{error}</p>}
            <Input label="Email Address" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            <Button type="submit" variant="blue" className="w-full py-3.5" isLoading={loading}>Send reset link</Button>
            <Link href="/login" className="flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-white"><ArrowLeft className="h-4 w-4" /> Back to sign in</Link>
          </form>
        )}
      </section>
    </main>
  );
}
