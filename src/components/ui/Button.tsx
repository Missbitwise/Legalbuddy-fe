"use client";

import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "gold" | "blue" | "blue-outline";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}


export const buttonBaseStyles =
  "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]";

export const buttonVariantsMap = {
  primary:
    "bg-slate-100 text-slate-950 hover:bg-white focus:ring-slate-300 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white shadow-md shadow-slate-950/50 font-semibold",
  blue:
    "bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white hover:brightness-110 focus:ring-blue-500 font-semibold shadow-lg shadow-blue-600/30 border border-blue-400/40 rounded-full",
  "blue-outline":
    "border border-blue-500/40 bg-blue-950/30 text-blue-200 hover:bg-blue-900/40 hover:text-white hover:border-blue-400 focus:ring-blue-500 rounded-full",
  gold:
    "bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white hover:brightness-110 focus:ring-blue-500 font-semibold shadow-lg shadow-blue-600/30 border border-blue-400/40",
  secondary:
    "bg-slate-800/90 text-slate-100 hover:bg-slate-800 border border-slate-700/80 focus:ring-slate-700",
  outline:
    "border border-slate-700 bg-slate-900/40 text-slate-200 hover:bg-slate-800 hover:text-white hover:border-slate-600 focus:ring-slate-700",
  ghost:
    "bg-transparent text-slate-300 hover:bg-slate-800/60 hover:text-white focus:ring-slate-700",
  danger:
    "bg-red-600/90 text-white hover:bg-red-600 focus:ring-red-500 shadow-md shadow-red-600/20 border border-red-500/30",
};

export const buttonSizesMap = {
  sm: "text-xs px-3.5 py-1.5 gap-1.5",
  md: "text-sm px-4 py-2.5 gap-2",
  lg: "text-base px-6 py-3.5 gap-2.5",
  icon: "p-2.5 aspect-square",
};

export interface ButtonVariantOptions {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "gold" | "blue" | "blue-outline";
  size?: "sm" | "md" | "lg" | "icon";
  className?: string;
}

export function buttonVariants({
  variant = "primary",
  size = "md",
  className = "",
}: ButtonVariantOptions = {}) {
  return cn(buttonBaseStyles, buttonVariantsMap[variant], buttonSizesMap[size], className);
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      leftIcon,
      rightIcon,
      type = "button",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={buttonVariants({ variant, size, className })}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
