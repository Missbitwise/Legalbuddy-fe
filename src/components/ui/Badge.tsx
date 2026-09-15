import React from "react";
import { cn } from "@/lib/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "slate" | "amber" | "green" | "blue" | "red" | "gold";
}

export function Badge({ className, variant = "slate", children, ...props }: BadgeProps) {
  const base = "inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider border transition-colors";

  const variants = {
    slate: "bg-slate-900 text-slate-300 border-slate-800",
    gold: "bg-blue-500/15 text-blue-300 border-blue-500/30 shadow-sm shadow-blue-500/10",
    amber: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    blue: "bg-blue-600/20 text-blue-300 border-blue-500/40 shadow-sm shadow-blue-600/20",
    red: "bg-red-500/10 text-red-400 border-red-500/30",
  };

  return (
    <span className={cn(base, variants[variant], className)} {...props}>
      {children}
    </span>
  );
}
