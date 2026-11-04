"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Scale } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { authApi } from "@/lib/api/auth.api";

export default function ResetPasswordPage() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setToken(new URLSearchParams(window.location.search).get("token") || "");
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!token) return setError("This reset link is missing its token. Request a new one.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirmPassword) return setError("Passwords do not match.");
    setLoading(true);
    try {
      await authApi.resetPassword(token, password);
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || "We couldn't reset your password. Request a new link and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#060a14] p-4 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/15 via-[#060a14] to-[#060a14]" />
      <section className="relative z-10 w-full max-w-md space-y-7 rounded-3xl border border-blue-500/25 bg-[#090f1e]/90 p-8 shadow-[0_0_50px_rgba(37,99,235,0.2)] backdrop-blur-2xl">
        <header className="space-y-4 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="rounded-2xl border border-blue-400/40 bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 p-2.5"><Scale className="h-6 w-6" /></span>
            <span className="text-2xl font-bold tracking-tight">LEGAL<span className="text-blue-400">BUDDY</span></span>
          </Link>
          <h1 className="pt-2 text-xl font-bold">Set a new password</h1>
          <p className="text-sm text-slate-400">Choose a secure password with at least 8 characters.</p>
        </header>
        {success ? (
          <div role="status" className="space-y-5">
            <p className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300">Your password has been updated. You can now sign in.</p>
            <Link href="/login" className="flex items-center justify-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300"><ArrowLeft className="h-4 w-4" /> Go to sign in</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">{error}</p>}
            <Input label="New Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} autoComplete="new-password" />
            <Input label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={8} autoComplete="new-password" />
            <Button type="submit" variant="blue" className="w-full py-3.5" isLoading={loading}>Update password</Button>
            <Link href="/forgot-password" className="flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-white"><ArrowLeft className="h-4 w-4" /> Request another link</Link>
          </form>
        )}
      </section>
    </main>
  );
}
