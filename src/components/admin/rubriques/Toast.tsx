'use client';
import React, { useEffect, memo } from "react";
import { motion } from "framer-motion";
import { X, CheckCircle, AlertCircle } from "lucide-react";

const Toast = memo(({
  type,
  message,
  onClose
}: {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`fixed top-4 right-4 z-50 max-w-md p-4 rounded-xl shadow-2xl border
                ${type === "success"
          ? "bg-green-50 border-green-200"
          : "bg-red-50 border-red-200"
        }`}
    >
      <div className="flex items-center gap-3">
        {type === "success" ? (
          <CheckCircle className="w-5 h-5 text-green-600" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-600" />
        )}
        
        <p className={`text-sm font-medium ${type === "success" ? "text-green-900" : "text-red-900"
          }`}>
          {message}
        </p>
        <button onClick={onClose} className="ml-auto">
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
});

Toast.displayName = "Toast";

export default Toast;