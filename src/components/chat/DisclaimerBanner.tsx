import React from "react";
import { ShieldAlert } from "lucide-react";

export function DisclaimerBanner() {
  return (
    <div className="bg-blue-500/10 border border-blue-500/25 rounded-xl p-3.5 text-xs text-blue-200 flex items-start gap-3 my-3">
      <ShieldAlert className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
      <div className="leading-relaxed">
        <span className="font-semibold text-blue-300">Legal Information Advisory:</span> LegalBuddy provides AI-generated legal guidance based on verified document references. Responses do not constitute formal legal advice or an attorney-client representation. Always consult a qualified lawyer for official legal counsel.
      </div>
    </div>
  );
}
