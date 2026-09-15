"use client";

import React from "react";
import Link from "next/link";
import { Menu, Scale, FileText, ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { useAuthStore } from "@/hooks/useAuth";

export interface HeaderProps {
  onToggleMobileSidebar: () => void;
  title?: string;
}

export function Header({ onToggleMobileSidebar, title }: HeaderProps) {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "ADMIN" || user?.email?.toLowerCase() === "urmilarajapurkar953@gmail.com";

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <Scale className="w-5 h-5 text-blue-400 lg:hidden" />
          <div>
            <h1 className="font-semibold text-sm sm:text-base text-white tracking-tight truncate">
              {title || "Legal Consultation Workspace"}
            </h1>
            <p className="text-[11px] text-slate-400 hidden sm:block">Grounded legal advice & document reference</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isAdmin && (
          <Link
            href="/app/documents"
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "text-xs gap-1.5 border-slate-800 text-slate-300 hover:bg-slate-900",
            })}
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            Documents
          </Link>
        )}
      </div>
    </header>
  );
}
