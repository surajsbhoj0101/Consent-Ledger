import React from "react";
import { Loader2 } from "lucide-react";

function Loading({ isLoading, loadingMessage }) {
  if (!isLoading) return null;

  return (
    <div
      className="
        fixed inset-0 z-[100] 
        flex items-center justify-center 
        bg-[#0f1219]/60 backdrop-blur-[3px] 
        animate-in fade-in duration-200
      "
    >
      <div 
        className="
          flex flex-col items-center justify-center 
          p-6 rounded-2xl 
          bg-[#1e293b]/40 border border-[#7fa4c4]/20 
          shadow-2xl shadow-black/50
        "
      >
        <Loader2 className="w-10 h-10 text-[#7fa4c4] animate-spin" />
        
        {loadingMessage && (
          <p className="mt-4 text-sm font-medium text-[#b0c5db] animate-pulse tracking-wide">
            {loadingMessage}
          </p>
        )}
      </div>
    </div>
  );
}

export default Loading;