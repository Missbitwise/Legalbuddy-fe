"use client";

import React from "react";
import { VoiceCallInterface } from "@/components/voice/VoiceCallInterface";

export default function VoicePage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center h-full overflow-y-auto custom-scrollbar">
      <VoiceCallInterface />
    </div>
  );
}
