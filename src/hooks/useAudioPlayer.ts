"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export interface UseAudioPlayerReturn {
  isPlaying: boolean;
  playAudioBlob: (blob: Blob) => Promise<void>;
  stopAudio: () => void;
}

export function useAudioPlayer(): UseAudioPlayerReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  const playAudioBlob = useCallback(
    (blob: Blob): Promise<void> => {
      return new Promise((resolve, reject) => {
        stopAudio();

        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;

        audio.onplay = () => setIsPlaying(true);
        audio.onended = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(url);
          resolve();
        };
        audio.onerror = (err) => {
          setIsPlaying(false);
          URL.revokeObjectURL(url);
          reject(err);
        };

        audio.play().catch((err) => {
          setIsPlaying(false);
          URL.revokeObjectURL(url);
          reject(err);
        });
      });
    },
    [stopAudio]
  );

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  return {
    isPlaying,
    playAudioBlob,
    stopAudio,
  };
}
