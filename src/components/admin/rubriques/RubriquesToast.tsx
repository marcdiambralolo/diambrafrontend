'use client';
import Toast from "@/components/admin/rubriques/Toast";
import { AnimatePresence } from "framer-motion";
import React from "react";

interface RubriquesToastProps {
  toast: { type: 'success' | 'error' | 'info' | 'warning'; message: string } | null;
  onClose: () => void;
}

export function RubriquesToast({ toast, onClose }: RubriquesToastProps) {
  const toastType: 'success' | 'error' = toast?.type === 'success' ? 'success' : 'error';

  return (
    <AnimatePresence>
      {toast && (
        <Toast
          type={toastType}
          message={toast.message}
          onClose={onClose}
        />
      )}
    </AnimatePresence>
  );
}