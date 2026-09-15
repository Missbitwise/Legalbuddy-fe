// Speech synthesis utility for Read Aloud functionality

let activeKeepAliveTimer: NodeJS.Timeout | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;

function clearKeepAlive() {
  if (activeKeepAliveTimer) {
    clearInterval(activeKeepAliveTimer);
    activeKeepAliveTimer = null;
  }
}

/**
 * Strips markdown formatting from AI text so that it reads out as natural prose.
 */
export function stripMarkdown(markdown: string): string {
  if (!markdown) return "";

  let text = markdown
    // Remove fenced code blocks
    .replace(/```[\s\S]*?```/g, "")
    // Remove inline code
    .replace(/`([^`]+)`/g, "$1")
    // Remove headers (#, ##, etc.)
    .replace(/^#{1,6}\s+/gm, "")
    // Remove bold and italic (***text***, **text**, *text*, ___text___, __text__, _text_)
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, "$1")
    // Remove markdown links [text](url) -> keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Remove blockquotes (> quote)
    .replace(/^\s*>\s+/gm, "")
    // Remove bullet points / list numbers
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    // Remove horizontal rules
    .replace(/^-{3,}|^\*{3,}|^_{3,}/gm, "")
    // Normalize newlines and whitespace
    .replace(/\n{2,}/g, ". ")
    .replace(/\n/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();

  return text;
}

/**
 * Reads aloud the given text using the Web Speech API.
 */
export function speakText(
  text: string,
  callbacks?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: any) => void;
  }
): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    console.warn("Web Speech API is not supported in this browser.");
    return false;
  }

  // Stop any active speech
  stopSpeech();

  const cleanText = stripMarkdown(text);
  if (!cleanText) return false;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  currentUtterance = utterance;

  // Rate and pitch for natural conversational delivery
  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  // Choose a clean English voice if available
  const voices = window.speechSynthesis.getVoices();
  if (voices && voices.length > 0) {
    const preferredVoice =
      voices.find(
        (v) =>
          v.lang.startsWith("en") &&
          (v.name.includes("Natural") ||
            v.name.includes("Google") ||
            v.name.includes("Samantha") ||
            v.name.includes("David") ||
            v.name.includes("Zira"))
      ) || voices.find((v) => v.lang.startsWith("en"));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
  }

  utterance.onstart = () => {
    callbacks?.onStart?.();

    // Workaround for Chromium 15-second speech synthesis pause bug
    clearKeepAlive();
    activeKeepAliveTimer = setInterval(() => {
      if (typeof window !== "undefined" && window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      } else {
        clearKeepAlive();
      }
    }, 10000);
  };

  utterance.onend = () => {
    clearKeepAlive();
    currentUtterance = null;
    callbacks?.onEnd?.();
  };

  utterance.onerror = (e) => {
    clearKeepAlive();
    currentUtterance = null;
    callbacks?.onError?.(e);
  };

  window.speechSynthesis.speak(utterance);
  return true;
}

/**
 * Stops any ongoing speech synthesis.
 */
export function stopSpeech(): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return;
  }

  clearKeepAlive();
  currentUtterance = null;
  window.speechSynthesis.cancel();
}
