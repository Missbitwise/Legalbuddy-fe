"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Plus,
  MessageSquare,
  Trash2,
  Mic,
  FileText,
  LogOut,
  Search,
  Scale,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useConversationsStore } from "@/hooks/useConversations";
import { useAuthStore } from "@/hooks/useAuth";
import { groupConversationsByDate } from "@/lib/utils/date";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

export function Sidebar({ className, onCloseMobile }: { className?: string; onCloseMobile?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const displayName = useMemo(() => {
    if (user?.fullName && user.fullName.trim()) {
      return user.fullName.trim();
    }
    if (user?.email) {
      const prefix = user.email.split("@")[0];
      const cleaned = prefix.replace(/[._-]/g, " ").replace(/\d+/g, "").trim();
      if (cleaned) {
        return cleaned
          .split(" ")
          .filter(Boolean)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
      }
      return prefix.charAt(0).toUpperCase() + prefix.slice(1);
    }
    return "User";
  }, [user]);

  const isAdmin = useMemo(() => {
    return user?.role === "ADMIN" || user?.email?.toLowerCase() === "urmilarajapurkar953@gmail.com";
  }, [user]);

  const {
    conversations,
    fetchConversations,
    createNewConversation,
    deleteConversation,
    isLoadingList,
  } = useConversationsStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    return conversations.filter((c) =>
      (c.title || "Legal Consultation")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [conversations, searchQuery]);

  const grouped = useMemo(
    () => groupConversationsByDate(filteredConversations),
    [filteredConversations]
  );

  const handleNewConversation = async () => {
    try {
      const newConv = await createNewConversation();
      if (onCloseMobile) onCloseMobile();
      router.push(`/app/chat/${newConv.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await deleteConversation(deletingId);
      setDeletingId(null);
      if (pathname.includes(deletingId)) {
        router.push("/app");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const renderGroup = (title: string, list: typeof conversations) => {
    if (list.length === 0) return null;

    return (
      <div className="space-y-1 mb-4">
        <h4 className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </h4>
        {list.map((conv) => {
          const isActive = pathname === `/app/chat/${conv.id}`;
          const displayTitle = conv.title || "Legal Consultation";

          return (
            <div
              key={conv.id}
              className={cn(
                "group relative flex items-center justify-between rounded-xl px-3 py-2.5 text-xs transition-all duration-150 cursor-pointer",
                isActive
                  ? "bg-blue-950/40 text-white font-semibold border border-blue-500/40 shadow-md shadow-blue-500/10"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              )}
            >
              <Link
                href={`/app/chat/${conv.id}`}
                onClick={onCloseMobile}
                className="flex items-center gap-2.5 truncate flex-1 min-w-0 pr-2"
              >
                <MessageSquare className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-blue-400 transition-colors" />
                <span className="truncate">{displayTitle}</span>
              </Link>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeletingId(conv.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition-all"
                title="Delete conversation"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <aside
        className={cn(
          "flex flex-col h-full w-72 bg-slate-950 text-slate-100 border-r border-slate-800/80 shadow-2xl select-none",
          className
        )}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <Link
            href="/app"
            className="flex items-center gap-3 group"
            onClick={onCloseMobile}
          >
            <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 border border-blue-400/40 group-hover:scale-105 transition-transform">
              <Scale className="w-5 h-5 font-bold" />
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
                LEGAL<span className="text-blue-400">BUDDY</span>
                <span className="text-[10px] uppercase font-semibold bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/30">
                  Pro
                </span>
              </span>
              <p className="text-[11px] text-slate-400">Legal AI Companion</p>
            </div>
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="p-3 space-y-2 border-b border-slate-800/60">
          <Button
            onClick={handleNewConversation}
            variant="blue"
            className="w-full justify-start gap-2 py-2.5 text-xs font-semibold shadow-md shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" />
            New Legal Consultation
          </Button>

          {isAdmin && (
            <Link
              href="/app/documents"
              onClick={onCloseMobile}
              className={cn(
                "w-full flex items-center justify-start gap-2.5 py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer",
                pathname === "/app/documents"
                  ? "bg-blue-600/20 border-blue-500/40 text-blue-300"
                  : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              <FileText className="w-4 h-4 text-sky-400" />
              Legal Knowledge Documents
            </Link>
          )}
        </div>

        {/* Search Input */}
        <div className="px-3 pt-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search past consultations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-slate-900/90 border border-slate-800 pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
            />
          </div>
        </div>

        {/* Conversation History List */}
        <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
          {isLoadingList ? (
            <div className="space-y-3 py-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-8 bg-slate-900/60 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-10 px-2 space-y-2">
              <MessageSquare className="w-8 h-8 mx-auto text-slate-600 opacity-60" />
              <p className="text-xs text-slate-400 font-medium">No consultations saved yet</p>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                Start a conversation to get instant guidance on legal questions.
              </p>
            </div>
          ) : (
            <>
              {renderGroup("Today", grouped.today)}
              {renderGroup("Yesterday", grouped.yesterday)}
              {renderGroup("Previous 7 Days", grouped.previous7Days)}
              {renderGroup("Older", grouped.older)}
            </>
          )}
        </div>

        {/* User Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 rounded-xl bg-slate-900 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400 text-xs shrink-0 shadow-sm">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate flex items-center gap-1.5">
                <span>{displayName}</span>
                {isAdmin && (
                  <span className="text-[9px] px-1.5 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded font-semibold uppercase tracking-wider">
                    Owner
                  </span>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-900 rounded-lg transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        title="Delete Consultation History"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            Are you sure you want to delete this saved legal consultation? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeletingId(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDeleteConfirm}
              isLoading={isDeleting}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
