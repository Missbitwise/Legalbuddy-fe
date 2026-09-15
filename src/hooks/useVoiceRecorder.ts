"use client";

import { useState, useRef, useCallback } from "react";

export interface UseVoiceRecorderReturn {
  isRecording: boolean;
  recordingTime: number;
  audioBlob: Blob | null;
  permissionError: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Blob | null>;
  resetRecording: () => void;
}

export function useVoiceRecorder(): UseVoiceRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const getSupportedMimeType = (): string => {
    const types = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4",
      "audio/ogg",
    ];
    for (const type of types) {
      if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return "";
  };

  const startRecording = useCallback(async () => {
    setPermissionError(null);
    setAudioBlob(null);
    audioChunksRef.current = [];
    setRecordingTime(0);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Audio recording is not supported in this browser.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getSupportedMimeType();
      const options = mimeType ? { mimeType } : undefined;

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(200); // chunk every 200ms
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error("Microphone error:", err);
      let message = "Could not access microphone.";
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        message = "Microphone permission denied. Please allow microphone access in your browser.";
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        message = "No microphone found on your device.";
      } else if (err.message) {
        message = err.message;
      }
      setPermissionError(message);
    }
  }, []);

  const stopRecording = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current || mediaRecorderRef.current.state === "inactive") {
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
        resolve(audioBlob);
        return;
      }

      mediaRecorderRef.current.onstop = () => {
        const mimeType = mediaRecorderRef.current?.mimeType || "audio/webm";
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        setAudioBlob(blob);
        setIsRecording(false);

        if (timerRef.current) {
          clearInterval(timerRef.current);
        }

        // Stop all audio tracks to release microphone
        mediaRecorderRef.current?.stream.getTracks().forEach((track) => track.stop());
        resolve(blob);
      };

      mediaRecorderRef.current.stop();
    });
  }, [audioBlob]);

  const resetRecording = useCallback(() => {
    setIsRecording(false);
    setRecordingTime(0);
    setAudioBlob(null);
    setPermissionError(null);
    audioChunksRef.current = [];
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  return {
    isRecording,
    recordingTime,
    audioBlob,
    permissionError,
    startRecording,
    stopRecording,
    resetRecording,
  };
}
