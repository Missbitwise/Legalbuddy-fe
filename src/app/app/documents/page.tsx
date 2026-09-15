"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FileText, Upload, Database, ShieldCheck, Scale, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DocumentUploadModal } from "@/components/legal/DocumentUploadModal";
import { useAuthStore } from "@/hooks/useAuth";
import { Spinner } from "@/components/ui/Spinner";

export default function DocumentsPage() {
  const router = useRouter();
  const { user, isInitializing } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isAdmin = user?.role === "ADMIN" || user?.email?.toLowerCase() === "urmilarajapurkar953@gmail.com";

  useEffect(() => {
    if (!isInitializing && user && !isAdmin) {
      router.replace("/app");
    }
  }, [isInitializing, user, isAdmin, router]);

  if (isInitializing || !isAdmin) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-3">
        <Spinner size="lg" className="text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar space-y-8 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Verified Knowledge Reference</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Legal Document Library
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Official statutes, contracts, and legal acts referenced by LegalBuddy to generate grounded responses.
          </p>
        </div>

        <Button
          variant="blue"
          onClick={() => setIsModalOpen(true)}
          className="gap-2 shadow-lg shadow-blue-600/30 shrink-0"
        >
          <Upload className="w-4 h-4" /> Add Legal Document
        </Button>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-white">Direct Document Analysis</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            LegalBuddy searches uploaded documents to extract precise clauses and statutory references for your queries.
          </p>
        </Card>

        <Card className="space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-white">Instant Reference Index</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Uploaded PDFs are indexed automatically in the background, making them available for immediate inquiry.
          </p>
        </Card>

        <Card className="space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-white">Privacy & Security Guarantee</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            All uploaded legal documentation remains private, protected, and accessible only to authorized accounts.
          </p>
        </Card>
      </div>

      {/* Reference Library Card */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-8 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-white flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-blue-400" />
            Knowledge Reference Overview
          </h3>
          <Badge variant="blue">Active Reference</Badge>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          LegalBuddy compares your questions against verified legal acts, tenant laws, workplace regulations, and contract terms. Upload relevant legal contracts or statutory acts in PDF format to expand the legal context available for your consultations.
        </p>

        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="text-xs gap-2 border-slate-700 text-slate-200 hover:bg-slate-800"
          >
            <Upload className="w-4 h-4" /> Upload Document to Library
          </Button>
        </div>
      </div>

      {/* Upload Modal */}
      <DocumentUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
