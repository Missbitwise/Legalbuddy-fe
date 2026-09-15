import React, { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "bordered" | "glass";
}

export function Card({ className, variant = "glass", children, ...props }: CardProps) {
  const baseStyles = "rounded-2xl p-6 transition-all duration-300";

  const variants = {
    default: "bg-slate-900 border border-slate-800 shadow-xl",
    bordered: "bg-transparent border border-slate-800 hover:border-slate-700",
    glass:
      "bg-slate-900/75 backdrop-blur-xl border border-slate-800/80 shadow-2xl hover:border-blue-500/40 hover:shadow-[0_0_25px_rgba(37,99,235,0.15)]",
  };

  return (
    <div className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </div>
  );
}
