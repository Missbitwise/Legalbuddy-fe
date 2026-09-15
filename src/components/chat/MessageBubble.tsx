"use client";

import React, { useMemo, useState, useEffect } from "react";
import { marked } from "marked";
import { Message } from "@/types/conversation.types";
import { formatTime } from "@/lib/utils/date";
import { speakText, stopSpeech } from "@/lib/utils/speech";
import {
  Scale,
  User as UserIcon,
  Copy,
  Check,
  Pencil,
  Volume2,
  VolumeX,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface MessageBubbleProps {
  message: Message;
  onEditAndResend?: (messageId: string, newContent: string) => Promise<void> | void;
  isSending?: boolean;
}

export function MessageBubble({
  message,
  onEditAndResend,
  isSending = false,
}: MessageBubbleProps) {
  const isUser = message.role === "USER";
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Sync editText if message.content updates
  useEffect(() => {
    setEditText(message.content);
  }, [message.content]);

  // Clean up speech synthesis if component unmounts while speaking
  useEffect(() => {
    return () => {
      if (isSpeaking) {
        stopSpeech();
      }
    };
  }, [isSpeaking]);

  const formattedHtml = useMemo(() => {
    if (isUser) return null;
    try {
      return marked.parse(message.content || "");
    } catch {
      return message.content;
    }
  }, [message.content, isUser]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    } else {
      const started = speakText(message.content, {
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
      if (!started) {
        setIsSpeaking(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditText(message.content);
    setIsEditing(false);
  };

  const handleSubmitEdit = async () => {
    const trimmed = editText.trim();
    if (!trimmed || trimmed === message.content || isSubmitting) {
      setIsEditing(false);
      return;
    }

    if (onEditAndResend) {
      setIsSubmitting(true);
      try {
        await onEditAndResend(message.id, trimmed);
        setIsEditing(false);
      } catch (err) {
        console.error("Failed to resend prompt:", err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      handleCancelEdit();
    } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey || !e.shiftKey)) {
      e.preventDefault();
      handleSubmitEdit();
    }
  };

  return (
    <div
      className={cn(
        "flex gap-3.5 max-w-4xl mx-auto py-5 px-3 sm:px-6 transition-colors group",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar Icon */}
      <div
        className={cn(
          "w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-md mt-0.5 border",
          isUser
            ? "bg-slate-900 border-slate-700 text-slate-100"
            : "bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 border-blue-400/40 text-white shadow-md shadow-blue-600/30"
        )}
      >
        {isUser ? <UserIcon className="w-4 h-4" /> : <Scale className="w-4 h-4 font-bold" />}
      </div>

      {/* Message Content Container */}
      <div
        className={cn(
          "flex-1 min-w-0 space-y-1.5",
          isUser && !isEditing && "text-right"
        )}
      >
        {/* Header Metadata */}
        <div
          className={cn(
            "flex items-center gap-2 text-[11px] text-slate-400",
            isUser && !isEditing && "justify-end"
          )}
        >
          <span className="font-semibold text-slate-300">
            {isUser ? "You" : "LegalBuddy Assistant"}
          </span>
          <span>•</span>
          <span>{formatTime(message.createdAt)}</span>
        </div>

        {/* Bubble Container */}
        <div
          className={cn(
            "relative text-left text-sm rounded-2xl leading-relaxed shadow-xl border transition-all",
            isUser
              ? isEditing
                ? "w-full bg-slate-900 border-blue-500/50 p-4 rounded-xl"
                : "inline-block bg-slate-900 text-slate-100 border-slate-800 rounded-tr-xs p-5 max-w-full"
              : "inline-block bg-slate-900/90 text-slate-100 border-slate-800/90 rounded-tl-xs hover:border-blue-500/30 p-5 max-w-full"
          )}
        >
          {isUser ? (
            isEditing ? (
              /* Inline Edit Mode (ChatGPT Style) */
              <div className="space-y-3">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={3}
                  className="w-full bg-slate-950 text-slate-100 border border-slate-700/80 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 resize-y min-h-[75px]"
                  placeholder="Edit your prompt..."
                  autoFocus
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={isSubmitting}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700 cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitEdit}
                    disabled={isSubmitting || !editText.trim()}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Resending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3 h-3" />
                        <span>Send</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* Regular User Prompt View */
              <div className="space-y-2">
                <p className="whitespace-pre-wrap font-normal text-slate-200">{message.content}</p>
                
                {/* User Action Bar (Edit & Copy) */}
                <div className="flex items-center justify-end gap-1.5 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Edit Prompt Button */}
                  {onEditAndResend && (
                    <div className="relative group/tooltip">
                      <button
                        onClick={() => {
                          setEditText(message.content);
                          setIsEditing(true);
                        }}
                        disabled={isSending}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all border border-transparent hover:border-slate-700 cursor-pointer disabled:opacity-40"
                        title="Edit prompt"
                        aria-label="Edit prompt"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-slate-800 text-[11px] font-medium text-slate-200 rounded-md shadow-lg border border-slate-700 whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity z-10">
                        Edit prompt
                      </span>
                    </div>
                  )}

                  {/* Copy Prompt Button */}
                  <div className="relative group/tooltip">
                    <button
                      onClick={handleCopy}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all border border-transparent hover:border-slate-700 cursor-pointer"
                      title="Copy prompt"
                      aria-label="Copy prompt"
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-slate-800 text-[11px] font-medium text-slate-200 rounded-md shadow-lg border border-slate-700 whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity z-10">
                      {copied ? "Copied!" : "Copy"}
                    </span>
                  </div>
                </div>
              </div>
            )
          ) : (
            /* Assistant Message View */
            <div>
              <div
                className="prose prose-invert prose-sm max-w-none space-y-3 prose-headings:font-bold prose-headings:text-white prose-p:text-slate-200 prose-p:leading-relaxed prose-a:text-blue-400 prose-strong:text-blue-200 prose-strong:font-semibold prose-ul:list-disc prose-ol:list-decimal prose-li:my-1"
                dangerouslySetInnerHTML={{ __html: formattedHtml as string }}
              />

              {/* Bottom Action Bar for AI Response */}
              <div className="flex items-center gap-1.5 pt-3 border-t border-slate-800/60 mt-3">
                {/* Read Aloud Button with Tooltip */}
                <div className="relative group/speaker">
                  <button
                    onClick={handleToggleSpeech}
                    className={cn(
                      "p-1.5 rounded-lg transition-all flex items-center gap-1 text-xs font-medium border cursor-pointer",
                      isSpeaking
                        ? "bg-blue-600/20 border-blue-500/50 text-blue-400 animate-pulse"
                        : "text-slate-400 hover:text-white hover:bg-slate-800 border-transparent hover:border-slate-700"
                    )}
                    title={isSpeaking ? "Stop reading" : "Read aloud"}
                    aria-label="Read aloud"
                  >
                    {isSpeaking ? (
                      <VolumeX className="w-3.5 h-3.5 text-blue-400" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                  {/* Floating tooltip explicitly labeled "Read aloud" */}
                  <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-slate-800 text-[11px] font-medium text-slate-200 rounded-md shadow-lg border border-slate-700 whitespace-nowrap opacity-0 group-hover/speaker:opacity-100 transition-opacity z-10">
                    {isSpeaking ? "Stop reading" : "Read aloud"}
                  </span>
                </div>

                {/* Copy Answer Button */}
                <div className="relative group/tooltip">
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all border border-transparent hover:border-slate-700 cursor-pointer"
                    title="Copy answer text"
                    aria-label="Copy answer text"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-slate-800 text-[11px] font-medium text-slate-200 rounded-md shadow-lg border border-slate-700 whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity z-10">
                    {copied ? "Copied!" : "Copy"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

