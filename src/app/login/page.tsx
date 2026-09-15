"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Scale, Lock, ShieldCheck, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      await login({ email, password });
      router.push("/app");
    } catch {
      // Error handled in store
    }
  };

  return (
    <div className="min-h-screen bg-[#060a14] flex items-center justify-center p-4 selection:bg-blue-600/30 selection:text-blue-300 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/15 via-[#060a14] to-[#060a14] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 bg-[#090f1e]/90 border border-blue-500/25 p-8 rounded-3xl shadow-[0_0_50px_rgba(37,99,235,0.2)] backdrop-blur-2xl relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400/40 group-hover:scale-105 transition-transform">
              <Scale className="w-6 h-6 font-bold" />
            </div>
            <span className="font-bold text-2xl text-white tracking-tight">
              LEGAL<span className="text-blue-400">BUDDY</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Sign in to your account
          </h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Access your saved legal consultations, voice assistant, and document library.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center justify-between">
              <span>{error}</span>
              <button
                type="button"
                onClick={clearError}
                className="font-bold hover:underline"
              >
                ×
              </button>
            </div>
          )}

          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="blue"
            className="w-full py-3.5 text-sm font-semibold shadow-[0_0_25px_rgba(37,99,235,0.4)] hover:shadow-[0_0_35px_rgba(37,99,235,0.6)]"
            isLoading={isLoading}
          >
            Sign In to Account <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <div className="pt-2 border-t border-slate-800/80 text-center text-xs text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" /> Protected Session
          </span>
          <Link
            href="/register"
            className="text-blue-400 font-semibold hover:underline"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
