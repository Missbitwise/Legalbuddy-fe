"use client";

import React, { useEffect, useRef } from "react";
import { Message } from "@/types/conversation.types";
import { MessageBubble } from "./MessageBubble";
import { DisclaimerBanner } from "./DisclaimerBanner";
import { Scale, Sparkles, ArrowRight, ShieldCheck, FileCheck } from "lucide-react";

export interface ChatWindowProps {
  messages: Message[];
  isSending: boolean;
  onSelectPrompt?: (promptText: string) => void;
  onEditAndResend?: (messageId: string, newContent: string) => Promise<void> | void;
}

const PROMPT_SUGGESTIONS = [
  {
    title: "Tenant Rights & Property",
    prompt: "What are my rights as a tenant if my landlord fails to address major repairs or habitability issues?",
    category: "Housing & Leases",
  },
  {
    title: "Employment & Severance",
    prompt: "Can an employer terminate employment without prior notice, and what statutory severance rights apply?",
    category: "Labor & Workplace",
  },
  {
    title: "Legal Notice Guidance",
    prompt: "What immediate legal steps should I take if I receive a formal legal notice or lawsuit document?",
    category: "Disputes & Litigation",
  },
  {
    title: "Contract Review & Clauses",
    prompt: "What key liability and non-compete clauses should I scrutinize before signing a commercial contract?",
    category: "Business Contracts",
  },
];

export function ChatWindow({
  messages,
  isSending,
  onSelectPrompt,
  onEditAndResend,
}: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto px-4 py-8 custom-scrollbar">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Welcome Hero */}
          <div className="text-center space-y-4 py-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-2xl shadow-blue-600/30 border border-blue-400/40">
              <Scale className="w-9 h-9 font-bold" />
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Legal Guidance, Empowered by AI
            </h2>
            <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
              Ask legal questions to get clear, structured explanations grounded directly in verified legal documents and statutes.
            </p>
          </div>

          {/* Prompt Cards Grid */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recommended Consultation Topics</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {PROMPT_SUGGESTIONS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectPrompt && onSelectPrompt(item.prompt)}
                  className="group text-left p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl hover:border-blue-500/50 hover:bg-slate-900/90 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider block mb-1.5">
                      {item.category}
                    </span>
                    <h3 className="font-semibold text-sm text-white mb-1.5 group-hover:text-blue-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      &quot;{item.prompt}&quot;
                    </p>
                  </div>
                  <div className="flex items-center justify-end mt-4 text-xs font-medium text-slate-500 group-hover:text-blue-400 transition-colors">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <DisclaimerBanner />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      <div className="divide-y divide-slate-800/40">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            onEditAndResend={onEditAndResend}
            isSending={isSending}
          />
        ))}

        {/* Thinking State */}
        {isSending && (
          <div className="flex gap-3.5 max-w-4xl mx-auto py-5 px-3 sm:px-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md shadow-blue-600/30 border border-blue-400/40 mt-0.5">
              <Scale className="w-4 h-4 font-bold" />
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300 py-2">
              <span className="font-semibold">
                Analyzing legal context and statutes...
              </span>
              <div className="flex space-x-1 items-center">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-75" />
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-150" />
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-300" />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
