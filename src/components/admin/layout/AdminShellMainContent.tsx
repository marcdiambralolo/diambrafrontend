"use client";
import { motion } from "framer-motion";
import React from "react";

interface AdminShellMainContentProps {
  children: React.ReactNode;
}

export function AdminShellMainContent({ children }: AdminShellMainContentProps) {
  return (
    <main className="flex-1 overflow-y-auto bg-[#0F1C3F] text-[#E5E7EB] border-l border-[#1C3A6B]">
      <div className="p-2 sm:p-4 lg:p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {children}
        </motion.div>
      </div>
    </main>
  );
} 