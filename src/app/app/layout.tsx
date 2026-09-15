"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/useAuth";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileDrawer } from "@/components/layout/MobileDrawer";
import { Spinner } from "@/components/ui/Spinner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { token, isInitializing, fetchUser } = useAuthStore();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (!isInitializing && !token) {
      router.push("/login");
    }
  }, [isInitializing, token, router]);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#060a14] flex flex-col items-center justify-center space-y-3">
        <Spinner size="lg" className="text-blue-500" />
        <p className="text-xs text-slate-400 font-medium animate-pulse">
          Initializing LegalBuddy Workspace...
        </p>
      </div>
    );
  }

  if (!token) {
    return null;
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden lg:flex shrink-0" />

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header onToggleMobileSidebar={() => setMobileDrawerOpen(true)} />
        <main className="flex-1 flex flex-col min-h-0 bg-slate-950 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
