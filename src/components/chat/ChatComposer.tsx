"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Mic, Square, Loader2, AlertCircle, AudioLines } from "lucide-react";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { voiceApi } from "@/lib/api/voice.api";
import { VoiceCallInterface } from "@/components/voice/VoiceCallInterface";
import { cn } from "@/lib/utils/cn";

export interface ChatComposerProps {
  onSend: (text: string) => Promise<void>;
  isSending: boolean;
  disabled?: boolean;
}

export function ChatComposer({ onSend, isSending, disabled }: ChatComposerProps) {
  const [text, setText] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [dictateError, setDictateError] = useState<string | null>(null);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    isRecording,
    recordingTime,
    permissionError,
    startRecording,
    stopRecording,
    resetRecording,
  } = useVoiceRecorder();

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        180
      )}px`;
    }
  }, [text]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || isSending || disabled) return;
    setText("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    try {
      await onSend(trimmed);
    } catch {
      setText(trimmed);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Dictation Workflow (Audio -> Text directly into input bar)
  const handleMicClick = async () => {
    setDictateError(null);
    if (isRecording) {
      setIsTranscribing(true);
      try {
        const blob = await stopRecording();
        if (blob) {
          const res = await voiceApi.dictate(blob);
          if (res.text) {
            setText((prev) => (prev ? `${prev} ${res.text}` : res.text));
          } else {
            setDictateError("No speech detected in audio clip.");
          }
        }
      } catch (err: any) {
        setDictateError(err.response?.data?.message || "Dictation failed. Could not process speech.");
      } finally {
        setIsTranscribing(false);
      }
    } else {
      await startRecording();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 pb-5">
      {/* Dictation error notice */}
      {(permissionError || dictateError) && (
        <div className="mb-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{permissionError || dictateError}</span>
          </div>
          <button
            onClick={() => {
              resetRecording();
              setDictateError(null);
            }}
            className="text-xs font-semibold hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Dictation recording banner */}
      {isRecording && (
        <div className="mb-2.5 p-3 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-200 flex items-center justify-between shadow-xl animate-pulse">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span>Listening to dictation ({recordingTime}s)... Speak your legal query.</span>
          </div>
          <button
            onClick={handleMicClick}
            className="px-3 py-1 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 flex items-center gap-1.5 shadow-md shadow-blue-600/30 cursor-pointer"
          >
            <Square className="w-3 h-3 fill-white" /> Transcribe to Text
          </button>
        </div>
      )}

      {/* Modern Pill Typebar matching screenshot */}
      <div className="relative flex items-center bg-[#1e2025]/90 sm:bg-slate-900/90 backdrop-blur-xl rounded-full border border-slate-800/90 px-4 sm:px-5 py-2 shadow-2xl focus-within:border-blue-500/50 transition-all gap-2">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything"
          rows={1}
          disabled={disabled || isSending || isTranscribing}
          className="w-full resize-none bg-transparent px-2 py-1.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none max-h-44 custom-scrollbar disabled:opacity-50"
        />

        {/* Right Action Icons Container */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Send Button (active when user types text) */}
          {text.trim() && (
            <div className="relative group/tooltip flex items-center animate-in fade-in zoom-in-95 duration-150">
              <button
                type="button"
                onClick={handleSend}
                disabled={isSending || disabled || isTranscribing}
                className="p-2 rounded-full bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
                title="Send"
                aria-label="Send"
              >
                {isSending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
              <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-slate-800 text-[11px] font-medium text-slate-200 shadow-xl border border-slate-700/80 pointer-events-none opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap z-30">
                Send
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
              </div>
            </div>
          )}

          {/* Dictation Mic Button with 'Dictation' Hover Tooltip */}
          <div className="relative group/tooltip flex items-center">
            <button
              type="button"
              onClick={handleMicClick}
              disabled={disabled || isSending || isTranscribing}
              className={cn(
                "p-2 rounded-full transition-all cursor-pointer",
                isRecording
                  ? "bg-red-600/20 text-red-400 animate-pulse"
                  : isTranscribing
                  ? "text-blue-400"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/80"
              )}
              title="Dictation"
              aria-label="Dictation"
            >
              {isTranscribing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isRecording ? (
                <Square className="w-4 h-4 fill-red-400 text-red-400" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>
            <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-slate-800 text-[11px] font-medium text-slate-200 shadow-xl border border-slate-700/80 pointer-events-none opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap z-30">
              Dictation
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
            </div>
          </div>

          {/* Start Voice Button: Round Blue Button with 'Start Voice' Hover Tooltip */}
          <div className="relative group/tooltip flex items-center">
            <button
              type="button"
              onClick={() => setIsVoiceModalOpen(true)}
              disabled={disabled || isSending || isTranscribing}
              className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
              title="Start Voice"
              aria-label="Start Voice"
            >
              <AudioLines className="w-4 h-4" />
            </button>
            <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-slate-800 text-[11px] font-medium text-slate-200 shadow-xl border border-slate-700/80 pointer-events-none opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap z-30">
              Start Voice
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
            </div>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-center text-slate-500 mt-2">
        Press <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 text-slate-400 rounded-md">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 text-slate-400 rounded-md">Shift + Enter</kbd> for new line.
      </p>

      {/* Embedded Voice Call Modal */}
      {isVoiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
            onClick={() => setIsVoiceModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-xl animate-in zoom-in-95 duration-200">
            <VoiceCallInterface onClose={() => setIsVoiceModalOpen(false)} isModal />
          </div>
        </div>
      )}
    </div>
  );
}
