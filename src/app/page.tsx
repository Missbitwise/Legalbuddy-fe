"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Scale,
  Sparkles,
  Mic,
  MessageSquareQuote,
  ScanText,
  FileSignature,
  BookOpenCheck,
  ShieldCheck,
  Lock,
  Database,
  FileCheck2,
  UserCheck,
  ListFilter,
  AlertTriangle,
  Award,
  CheckCircle2,
  Cpu,
  Mail,
  Send,
  Volume2,
  ChevronRight,
  Bot,
  MessageSquare,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { HeroAnimation } from "@/components/HeroAnimation";
import { useAuthStore } from "@/hooks/useAuth";

export default function LandingPage() {
  const { token } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const appDestination = mounted && token ? "/app" : "/login";

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!contactEmail || !contactMessage) return;

    setContactSubmitted(true);

    setTimeout(() => {
      setContactSubmitted(false);
      setContactEmail("");
      setContactMessage("");
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#060a14] text-slate-100 flex flex-col selection:bg-blue-600/30 selection:text-blue-300 relative overflow-x-hidden font-sans">
      {/* Background Ambient Neon Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[500px] bg-blue-600/10 blur-[130px] rounded-full" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-indigo-600/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-10 left-1/3 w-[550px] h-[450px] bg-sky-500/10 blur-[140px] rounded-full" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b08_1px,transparent_1px),linear-gradient(to_bottom,#1e293b08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* NAVBAR */}
      <header className="border-b border-blue-500/15 bg-[#070b14]/85 backdrop-blur-xl sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400/40 group-hover:scale-105 group-hover:shadow-blue-500/50 transition-all">
              <Scale className="w-5 h-5 font-bold" />
            </div>

            <div className="flex items-center tracking-tight">
              <span className="font-extrabold text-xl text-white tracking-wider">
                LEGAL
              </span>
              <span className="font-extrabold text-xl text-blue-400 tracking-wider">
                BUDDY
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#services"
              className="text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors"
            >
              Services
            </a>

            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors"
            >
              How It Works
            </a>

            <a
              href="#privacy"
              className="text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors"
            >
              Privacy
            </a>

            <a
              href="#terms"
              className="text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors"
            >
              Terms
            </a>

            <a
              href="#contact"
              className="text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* Action Button */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className={buttonVariants({
                variant: "blue",
                size: "md",
                className:
                  "rounded-full px-6 py-2 text-xs font-semibold shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] transition-all",
              })}
            >
              Log In
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold uppercase tracking-wider shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                <span>Next-Generation Legal Intelligence</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight uppercase leading-[1.08]">
                INSTANT AI <br />
                <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                  LEGAL GUIDANCE
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-lg">
                Your immediate AI legal partner for Q&amp;A, research, and
                insights, without complex uploads.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  href={appDestination}
                  className={buttonVariants({
                    variant: "blue",
                    size: "lg",
                    className:
                      "rounded-full px-9 py-4 font-bold text-sm tracking-wider uppercase shadow-[0_0_30px_rgba(37,99,235,0.55)] hover:shadow-[0_0_40px_rgba(37,99,235,0.8)] hover:scale-105 transition-all text-center",
                  })}
                >
                  GET STARTED
                </Link>

                <a
                  href="#how-it-works"
                  className={buttonVariants({
                    variant: "blue-outline",
                    size: "lg",
                    className:
                      "rounded-full px-7 py-4 font-semibold text-sm border-blue-500/30 text-slate-200 hover:bg-blue-900/30 transition-all text-center",
                  })}
                >
                  Explore Workflow
                </a>
              </div>

              {/* Quick Feature Badges */}
              <div className="pt-6 flex flex-wrap items-center gap-6 text-xs text-slate-400 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>Statutory Grounding</span>
                </div>

                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-sky-400" />
                  <span>Real-time Voice Consultation</span>
                </div>

                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>End-to-End Encrypted</span>
                </div>
              </div>
            </div>

            {/* Right Side Card */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div className="relative mx-auto w-full max-w-md lg:max-w-lg group">
                {/* Ambient Lighting */}
                <div className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-blue-600/40 via-sky-500/30 to-indigo-600/30 blur-2xl opacity-70 group-hover:opacity-90 transition duration-700 pointer-events-none -z-10" />

                {/* Card */}
                <div className="relative rounded-3xl bg-gradient-to-b from-[#0c1427] via-[#090f20] to-[#070b16] border border-blue-500/30 p-5 sm:p-6 shadow-[0_0_50px_rgba(37,99,235,0.3)] transition-all duration-300 hover:border-blue-400/50">
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-blue-500/15">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30 border border-blue-400/30">
                        <Scale className="w-4 h-4" />
                      </div>

                      <div>
                        <span className="text-xs font-bold text-white tracking-wide block">
                          Legal Insight Assistant
                        </span>

                        <span className="text-[10px] text-slate-400 font-medium">
                          Interactive Intelligence
                        </span>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Active</span>
                    </div>
                  </div>

                  {/* Hero animation */}
                  <div className="relative rounded-2xl overflow-hidden border border-blue-500/20 bg-[#060a14] shadow-inner">
                    <HeroAnimation className="transition-transform duration-500 group-hover:scale-[1.01]" />

                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-blue-400/20 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="relative py-24 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center space-y-3 mb-16">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest">
              ABOUT OUR SERVICES
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase">
              COMPREHENSIVE AI LEGAL SERVICES
            </h2>

            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
              Engineered specifically for legal workflows — translating dense
              statutory provisions into actionable, intelligible analysis.
            </p>
          </div>

          {/* 4 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="group relative rounded-3xl bg-gradient-to-b from-[#0c1427] to-[#070b16] border border-blue-500/25 p-7 flex flex-col transition-all duration-300 hover:-translate-y-2 hover:border-blue-400 hover:shadow-[0_0_35px_rgba(37,99,235,0.3)]">
              <div className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 border border-blue-400/40 group-hover:scale-110 transition-transform">
                  <MessageSquareQuote className="w-7 h-7" />
                </div>

                <div className="space-y-2.5">
                  <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider block">
                    Instant Legal Q&amp;A
                  </span>

                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Instant Legal Q&amp;A
                  </h3>

                  <p className="text-xs text-slate-300/90 leading-relaxed">
                    Ask any legal question and get a precise, AI-powered
                    summary response grounded directly in legal authorities.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative rounded-3xl bg-gradient-to-b from-[#0c1427] to-[#070b16] border border-blue-500/25 p-7 flex flex-col transition-all duration-300 hover:-translate-y-2 hover:border-blue-400 hover:shadow-[0_0_35px_rgba(37,99,235,0.3)]">
              <div className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-sky-500/30 border border-sky-400/40 group-hover:scale-110 transition-transform">
                  <ScanText className="w-7 h-7" />
                </div>

                <div className="space-y-2.5">
                  <span className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider block">
                    Clause Explainer
                  </span>

                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Clause Explainer
                  </h3>

                  <p className="text-xs text-slate-300/90 leading-relaxed">
                    Highlight complex legal text for instant, simplified,
                    human-readable explanations that reveal hidden risk and
                    obligations.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group relative rounded-3xl bg-gradient-to-b from-[#0c1427] to-[#070b16] border border-blue-500/25 p-7 flex flex-col transition-all duration-300 hover:-translate-y-2 hover:border-blue-400 hover:shadow-[0_0_35px_rgba(37,99,235,0.3)]">
              <div className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-sky-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 border border-indigo-400/40 group-hover:scale-110 transition-transform">
                  <FileSignature className="w-7 h-7" />
                </div>

                <div className="space-y-2.5">
                  <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider block">
                    Contract Drafting
                  </span>

                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Contract Drafting Guidance
                  </h3>

                  <p className="text-xs text-slate-300/90 leading-relaxed">
                    Receive step-by-step suggestions and template options for
                    drafting robust contract clauses with statutory compliance.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="group relative rounded-3xl bg-gradient-to-b from-[#0c1427] to-[#070b16] border border-blue-500/25 p-7 flex flex-col transition-all duration-300 hover:-translate-y-2 hover:border-blue-400 hover:shadow-[0_0_35px_rgba(37,99,235,0.3)]">
              <div className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/30 border border-purple-400/40 group-hover:scale-110 transition-transform">
                  <BookOpenCheck className="w-7 h-7" />
                </div>

                <div className="space-y-2.5">
                  <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider block">
                    Legal Research
                  </span>

                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Legal Research
                  </h3>

                  <p className="text-xs text-slate-300/90 leading-relaxed">
                    Query relevant case law summaries and statutory provisions
                    for rapid legal analysis without extensive manual searches.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW LEGALBUDDY WORKS */}
      <section
        id="how-it-works"
        className="relative py-24 bg-[#080d1a]/80 border-y border-blue-500/20 z-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase">
              HOW LEGALBUDDY WORKS
            </h2>

            <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
              Three seamless steps from inquiry to statutory-grounded
              resolution.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Mockup */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl bg-[#090e1c] border border-blue-500/30 p-6 sm:p-8 shadow-[0_0_50px_rgba(37,99,235,0.2)] relative overflow-hidden">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-600/20 blur-3xl rounded-full" />

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>

                    <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Assistant Online</span>
                    </div>
                  </div>

                  {/* Query Bubble */}
                  <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 text-xs text-blue-200">
                    <div className="text-[11px] font-semibold text-blue-400 mb-1 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>YOUR QUESTION</span>
                    </div>

                    &quot;Explain the force majeure clause in this
                    context&quot;
                  </div>

                  {/* Connecting Line */}
                  <div className="flex justify-center py-1">
                    <div className="w-0.5 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 animate-pulse" />
                  </div>

                  {/* AI Legal Analysis Node */}
                  <div className="p-4 rounded-2xl bg-slate-900 border border-blue-500/30 text-xs text-slate-300 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-blue-300">
                      <div className="flex items-center gap-2">
                        <Scale className="w-4 h-4 text-blue-400" />
                        <span>Instant Legal Analysis &amp; Explanation</span>
                      </div>

                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-700/60 font-medium">
                        Voice &amp; Text
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Cross-references verified statutory acts and precedents to provide an immediate, plain-English legal explanation with clear spoken audio.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Steps */}
            <div className="lg:col-span-6 space-y-8 relative">
              {/* Step 1 */}
              <div className="flex items-start gap-5 group">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-600/40 border border-blue-400/40 shrink-0 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-6 h-6" />
                </div>

                <div className="space-y-1.5 pt-1">
                  <h3 className="text-lg font-extrabold text-white tracking-tight">
                    1. Ask Legal Question
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Type your scenario, upload contract clauses, or initiate a
                    real-time voice conversation in plain language.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-5 group">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-600/40 border border-indigo-400/40 shrink-0 group-hover:scale-110 transition-transform">
                  <Cpu className="w-6 h-6" />
                </div>

                <div className="space-y-1.5 pt-1">
                  <h3 className="text-lg font-extrabold text-white tracking-tight">
                    2. AI Legal Analysis
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Our AI assistant checks relevant statutory legal codes,
                    identifies key definitions, and explains your rights and
                    obligations in plain language.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-5 group">
                <div className="w-14 h-14 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-sky-600/40 border border-sky-400/40 shrink-0 group-hover:scale-110 transition-transform">
                  <Volume2 className="w-6 h-6" />
                </div>

                <div className="space-y-1.5 pt-1">
                  <h3 className="text-lg font-extrabold text-white tracking-tight">
                    3. Instant Response
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Receive clear, structured insights along with official legal
                    citations and natural voice explanations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRIVACY & TERMS */}
      <section className="relative py-24 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Privacy */}
            <div
              id="privacy"
              className="rounded-3xl bg-[#090f1e]/90 border border-blue-500/25 p-8 sm:p-10 shadow-[0_0_50px_rgba(37,99,235,0.15)] flex flex-col justify-between relative overflow-hidden"
            >
              <div className="space-y-8">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto shadow-inner">
                    <Scale className="w-6 h-6" />
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase">
                    YOUR DATA PRIVACY MATTERS
                  </h2>

                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Built from the ground up for strict confidentiality and
                    data protection.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Item 1 */}
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-blue-900/30 border border-blue-500/30 text-blue-400 shrink-0 shadow-md">
                      <Database className="w-5 h-5" />
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                        1. DATA COLLECTION
                      </h4>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        We prioritize personal privacy and transparency. Only
                        essential legal queries are processed to generate
                        instant legal assistance.
                      </p>

                      <ul className="text-[11px] text-slate-400 space-y-1 pt-1 list-disc list-inside">
                        <li>Strict data handling policy for legal queries.</li>
                        <li>No unsolicited profiling or dossiers.</li>
                        <li>
                          Zero third-party automated transmission without
                          consent.
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-blue-900/30 border border-blue-500/30 text-blue-400 shrink-0 shadow-md">
                      <Lock className="w-5 h-5" />
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                        2. DATA SECURITY (End-to-End Encryption)
                      </h4>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        Data transmissions and storage use enterprise-grade
                        256-bit encryption. Multi-layer access controls ensure
                        queries remain protected.
                      </p>

                      <ul className="text-[11px] text-slate-400 space-y-1 pt-1 list-disc list-inside">
                        <li>Encrypted audio streams and transcripts.</li>
                        <li>Automated session-token expiry.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-blue-900/30 border border-blue-500/30 text-blue-400 shrink-0 shadow-md">
                      <FileCheck2 className="w-5 h-5" />
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                        3. DATA USAGE &amp; CONSENT
                      </h4>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        Your questions and scenarios remain strictly yours.
                        Consent is central to our platform — your data is never
                        used to train public foundation models.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div
              id="terms"
              className="rounded-3xl bg-[#090f1e]/90 border border-blue-500/25 p-8 sm:p-10 shadow-[0_0_50px_rgba(37,99,235,0.15)] flex flex-col justify-between relative overflow-hidden"
            >
              <div className="space-y-8">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto shadow-inner">
                    <Scale className="w-6 h-6" />
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase">
                    TERMS OF SERVICE
                  </h2>

                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Clear policies guiding informational AI assistance.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Point 1 */}
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-indigo-900/30 border border-indigo-500/30 text-indigo-400 shrink-0 shadow-md">
                      <UserCheck className="w-5 h-5" />
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                        1. ACCEPTANCE OF TERMS
                      </h4>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        By accessing LegalBuddy, you agree to statutory terms
                        and acceptable use guidelines governing automated legal
                        assistance.
                      </p>
                    </div>
                  </div>

                  {/* Point 2 */}
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-indigo-900/30 border border-indigo-500/30 text-indigo-400 shrink-0 shadow-md">
                      <ListFilter className="w-5 h-5" />
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                        2. SERVICE USE LIMITATIONS
                      </h4>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        Platform intended for educational and information
                        purposes. Users retain full autonomy and final
                        responsibility for legal filings.
                      </p>
                    </div>
                  </div>

                  {/* Point 3 */}
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-indigo-900/30 border border-indigo-500/30 text-indigo-400 shrink-0 shadow-md">
                      <AlertTriangle className="w-5 h-5" />
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                        3. DISCLAIMER (AI IS NOT A LAWYER SUBSTITUTE)
                      </h4>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        LegalBuddy provides AI-driven statutory information and
                        analysis, not certified legal representation or
                        attorney-client privileged counsel.
                      </p>
                    </div>
                  </div>

                  {/* Point 4 */}
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-indigo-900/30 border border-indigo-500/30 text-indigo-400 shrink-0 shadow-md">
                      <Award className="w-5 h-5" />
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                        4. INTELLECTUAL PROPERTY
                      </h4>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        All analysis templates and algorithmic systems remain
                        proprietary; user queries and custom legal prompts
                        remain user property.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="relative py-20 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-b from-[#0b1326] to-[#070b16] border border-blue-500/30 p-8 sm:p-12 shadow-[0_0_50px_rgba(37,99,235,0.25)] text-center space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold uppercase">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>Need Specialized Guidance?</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
                CONTACT OUR LEGAL INTELLIGENCE TEAM
              </h2>

              <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
                Have questions about statutory indexing, enterprise API
                access, or custom legal compliance models? Reach out directly.
              </p>
            </div>

            {contactSubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-semibold flex items-center justify-center gap-3 animate-fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />

                <span>
                  Thank you! Your message has been received. We will respond
                  promptly.
                </span>
              </div>
            ) : (
              <form
                onSubmit={handleContactSubmit}
                className="max-w-xl mx-auto space-y-4 text-left"
              >
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Your Email
                  </label>

                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="counsel@firm.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-blue-500/30 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Inquiry Details
                  </label>

                  <textarea
                    required
                    rows={3}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Describe your inquiry or statutory compliance question..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-blue-500/30 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 hover:brightness-110 cursor-pointer active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-blue-500/15 bg-[#050810] py-12 text-xs text-slate-400 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white shadow-md border border-blue-400/30">
              <Scale className="w-4 h-4 font-bold" />
            </div>

            <div>
              <span className="font-extrabold text-sm text-white tracking-wider">
                LEGALBUDDY
              </span>

              <p className="text-[11px] text-slate-500">
                Statutory AI &amp; Real-time Voice Consultation
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
            <a
              href="#services"
              className="hover:text-blue-400 transition-colors"
            >
              Services
            </a>

            <a
              href="#how-it-works"
              className="hover:text-blue-400 transition-colors"
            >
              How It Works
            </a>

            <a
              href="#privacy"
              className="hover:text-blue-400 transition-colors"
            >
              Privacy Policy
            </a>

            <a
              href="#terms"
              className="hover:text-blue-400 transition-colors"
            >
              Terms of Service
            </a>

            <a
              href="#contact"
              className="hover:text-blue-400 transition-colors"
            >
              Contact
            </a>
          </div>

          <div className="text-[11px] text-slate-500">
            © {new Date().getFullYear()} LegalBuddy. All rights reserved. Not
            certified legal advice.
          </div>
        </div>
      </footer>
    </div>
  );
}
