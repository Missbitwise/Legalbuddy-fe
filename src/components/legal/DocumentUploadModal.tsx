"use client";

import React, { useState } from "react";
import { Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { legalApi } from "@/lib/api/legal.api";

export interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function DocumentUploadModal({ isOpen, onClose, onSuccess }: DocumentUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General Legal");
  const [version, setVersion] = useState("1.0");
  const [sourceUrl, setSourceUrl] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type !== "application/pdf") {
        setError("Only PDF legal documents are currently supported.");
        return;
      }
      setFile(selected);
      if (!title) {
        setTitle(selected.name.replace(/\.[^/.]+$/, ""));
      }
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !category) {
      setError("Please select a PDF file and provide a document title and category.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await legalApi.uploadDocument({
        file,
        title,
        category,
        version,
        sourceUrl: sourceUrl.trim() || undefined,
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setFile(null);
        setTitle("");
        onClose();
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to upload document. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Document for Legal Reference">
      {isSuccess ? (
        <div className="py-8 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
          <h4 className="text-lg font-bold text-white">
            Document Added Successfully!
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
            Your document has been added to LegalBuddy's reference library for grounded statutory analysis.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Drag & Drop File Selector */}
          <div className="relative border-2 border-dashed border-slate-800 rounded-2xl p-6 text-center hover:border-blue-500/60 transition-colors bg-slate-950/60 cursor-pointer">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            {file ? (
              <div className="flex items-center justify-center gap-2 text-slate-100 font-medium text-sm">
                <FileText className="w-5 h-5 text-blue-400" />
                <span className="truncate max-w-xs">{file.name}</span>
                <span className="text-xs text-slate-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
            ) : (
              <div className="space-y-1.5">
                <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-200">
                  Drop PDF document here, or <span className="text-blue-400 underline">browse</span>
                </p>
                <p className="text-xs text-slate-400">Supports PDF format up to 50MB</p>
              </div>
            )}
          </div>

          <Input
            label="Document Title *"
            placeholder="e.g. Commercial Lease Agreement Act 2024"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Category *"
              placeholder="e.g. Real Estate, Workplace, Civil"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
            <Input
              label="Version"
              placeholder="e.g. 1.0"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
            />
          </div>

          <Input
            label="Official Source Link (Optional)"
            placeholder="https://example.com/legal-act.pdf"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="blue" type="submit" isLoading={isLoading} className="shadow-lg shadow-blue-600/30">
              Upload & Index
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
