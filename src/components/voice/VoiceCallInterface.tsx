"use client";

import React, { useState, useEffect } from "react";
import { Mic, Square, Loader2, Volume2, PhoneOff, AlertCircle, Scale, ShieldCheck, X } from "lucide-react";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { voiceApi } from "@/lib/api/voice.api";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

export type VoiceState = "idle" | "recording" | "processing" | "speaking" | "error";

export interface VoiceCallInterfaceProps {
  onClose?: () => void;
  isModal?: boolean;
}

export function VoiceCallInterface({ onClose, isModal = false }: VoiceCallInterfaceProps = {}) {
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    isRecording,
    recordingTime,
    permissionError,
    startRecording,
    stopRecording,
    resetRecording,
  } = useVoiceRecorder();

  const { isPlaying, playAudioBlob, stopAudio } = useAudioPlayer();

  useEffect(() => {
    if (permissionError) {
      setVoiceState("error");
      setErrorMessage(permissionError);
    }
  }, [permissionError]);

  const handleToggleRecord = async () => {
    setErrorMessage(null);

    if (voiceState === "recording") {
      setVoiceState("processing");
      try {
        const audioBlob = await stopRecording();
        if (!audioBlob) {
          throw new Error("No speech recorded.");
        }

        const result = await voiceApi.voiceConversation(audioBlob, conversationId || undefined);

        if (result.conversationId) {
          setConversationId(result.conversationId);
        }

        setVoiceState("speaking");
        await playAudioBlob(result.audioBlob);
        setVoiceState("idle");
      } catch (err: any) {
        console.error("Voice conversation error:", err);
        setVoiceState("error");
        setErrorMessage(
          err.response?.data?.message || err.message || "Could not process speech query."
        );
      }
    } else {
      stopAudio();
      resetRecording();
      await startRecording();
      setVoiceState("recording");
    }
  };

  const handleEndCall = () => {
    stopAudio();
    resetRecording();
    setVoiceState("idle");
    setErrorMessage(null);
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-4 sm:p-6 text-center select-none w-full",
        !isModal && "min-h-[calc(100vh-5rem)]"
      )}
    >
      <div className="w-full max-w-xl space-y-8 bg-[#090f1e]/95 border border-blue-500/25 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(37,99,235,0.25)] backdrop-blur-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-600/15 via-transparent to-transparent pointer-events-none" />

        {/* Close Button if opened in modal */}
        {onClose && (
          <button
            onClick={() => {
              handleEndCall();
              onClose();
            }}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-20"
            title="Close voice consultation"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header */}
        <div className="space-y-2.5 relative z-10">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xl shadow-blue-600/30 border border-blue-400/40">
            <Scale className="w-7 h-7 font-bold" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Interactive Voice Consultation
          </h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            Speak naturally with LegalBuddy to receive instant audio responses grounded in statutory information.
          </p>
        </div>

        {/* Orb Visualizer */}
        <div className="relative py-10 flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center">
            {voiceState === "recording" && (
              <div className="absolute w-44 h-44 rounded-full bg-red-500/20 animate-ping" />
            )}
            {voiceState === "speaking" && (
              <div className="absolute w-48 h-48 rounded-full bg-blue-500/20 animate-pulse" />
            )}
            {voiceState === "processing" && (
              <div className="absolute w-40 h-40 rounded-full border-2 border-dashed border-blue-400 animate-spin" />
            )}

            <div
              className={cn(
                "relative z-10 w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl border border-white/10",
                voiceState === "recording"
                  ? "bg-red-600 text-white scale-110 shadow-red-500/30"
                  : voiceState === "speaking"
                  ? "bg-blue-600 text-white shadow-blue-500/40"
                  : voiceState === "processing"
                  ? "bg-slate-800 text-blue-400 border-blue-500/30"
                  : voiceState === "error"
                  ? "bg-red-950 text-red-400 border-red-500/40"
                  : "bg-slate-950 text-blue-400 hover:scale-105 hover:border-blue-500/50"
              )}
            >
              {voiceState === "recording" ? (
                <Mic className="w-12 h-12 animate-pulse" />
              ) : voiceState === "speaking" ? (
                <Volume2 className="w-12 h-12 animate-bounce" />
              ) : voiceState === "processing" ? (
                <Loader2 className="w-12 h-12 animate-spin" />
              ) : voiceState === "error" ? (
                <AlertCircle className="w-12 h-12" />
              ) : (
                <Mic className="w-12 h-12" />
              )}
            </div>
          </div>

          {/* Equalizer Bars */}
          {voiceState === "speaking" && (
            <div className="flex items-center gap-1.5 mt-8 h-8">
              <span className="w-1.5 bg-blue-400 rounded-full h-full animate-bounce delay-75" />
              <span className="w-1.5 bg-blue-400 rounded-full h-full animate-bounce delay-150" />
              <span className="w-1.5 bg-blue-400 rounded-full h-full animate-bounce delay-300" />
              <span className="w-1.5 bg-blue-400 rounded-full h-full animate-bounce delay-100" />
              <span className="w-1.5 bg-blue-400 rounded-full h-full animate-bounce delay-200" />
            </div>
          )}

          {/* Status Label */}
          <div className="mt-8 text-center">
            <span
              className={cn(
                "inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border shadow-md",
                voiceState === "recording"
                  ? "bg-red-500/10 text-red-400 border-red-500/30"
                  : voiceState === "speaking"
                  ? "bg-blue-500/15 text-blue-300 border-blue-500/30"
                  : voiceState === "processing"
                  ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                  : "bg-slate-950 text-slate-400 border-slate-800"
              )}
            >
              {voiceState === "recording" && `Listening to speech... (${recordingTime}s)`}
              {voiceState === "processing" && "Analyzing & Retrieving Legal Context..."}
              {voiceState === "speaking" && "LegalBuddy Speaking..."}
              {voiceState === "idle" && "Tap Microphone to Speak"}
              {voiceState === "error" && "Voice Error Occurred"}
            </span>

            {errorMessage && (
              <p className="mt-3 text-xs text-red-400 max-w-xs mx-auto leading-relaxed">{errorMessage}</p>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 pt-2 relative z-10">
          {voiceState === "idle" || voiceState === "error" ? (
            <Button
              onClick={handleToggleRecord}
              variant="blue"
              size="lg"
              className="gap-2.5 px-8 rounded-full shadow-[0_0_25px_rgba(37,99,235,0.4)] hover:shadow-[0_0_35px_rgba(37,99,235,0.6)] text-sm"
            >
              <Mic className="w-5 h-5" /> Start Voice Call
            </Button>
          ) : voiceState === "recording" ? (
            <Button
              onClick={handleToggleRecord}
              variant="primary"
              size="lg"
              className="gap-2.5 px-8 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-xl border border-red-500/30 text-sm"
            >
              <Square className="w-4 h-4 fill-white" /> Stop & Process Speech
            </Button>
          ) : (
            <Button
              onClick={handleEndCall}
              variant="outline"
              size="lg"
              className="gap-2.5 px-7 rounded-full border-red-500/40 text-red-400 hover:bg-red-500/10 text-sm"
            >
              <PhoneOff className="w-5 h-5" /> End Voice Call
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
