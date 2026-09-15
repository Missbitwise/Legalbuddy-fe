"use client";

import React, { useEffect } from "react";
import { Sidebar } from "./Sidebar";

export interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      {/* Drawer panel */}
      <div className="relative z-10 w-72 max-w-[80vw] h-full shadow-2xl animate-in slide-in-from-left duration-200">
        <Sidebar onCloseMobile={onClose} className="w-full" />
      </div>
    </div>
  );
}
