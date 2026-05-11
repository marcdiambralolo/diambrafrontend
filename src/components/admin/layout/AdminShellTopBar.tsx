"use client";
import { Menu } from "lucide-react";
import React from "react";

interface AdminShellTopBarProps {
  setShowMobileSidebar: (show: boolean) => void;
}

export function AdminShellTopBar({ setShowMobileSidebar }: AdminShellTopBarProps) {
  return (
    <div className="sticky top-0 z-30 flex items-center justify-between border-b border-[#1C3A6B] bg-[#0F1C3F]/94 px-4 py-3 shadow-sm backdrop-blur-md lg:hidden">
      <button
        onClick={() => setShowMobileSidebar(true)}
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#162A56] border border-[#2E5AA6] text-[#E5E7EB] transition-colors hover:bg-[#2E5AA6] hover:text-white"
      >
        <Menu className="h-5 w-5 text-[#4F83D1]" />
      </button>

      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#2E5AA6] to-[#4F83D1] shadow-[0_12px_24px_-16px_rgba(79,131,209,0.9)]">
          <span className="inline-block w-5 h-5"><svg viewBox="0 0 24 24" fill="none" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 2l2 7h7l-5.5 4 2 7-5.5-4-5.5 4 2-7L3 9h7z"></path></svg></span>
        </div>
        <span className="text-sm font-black text-[#E5E7EB]">Admin</span>
      </div>

      <div className="w-10" />
    </div>
  );
}