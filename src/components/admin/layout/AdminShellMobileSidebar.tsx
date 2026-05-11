"use client";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { AdminLogoutButton } from "../commons/AdminLogoutButton";
import { AdminSidebarHeader } from "./AdminSidebarHeader";
import { AdminSidebarNav } from "./AdminSidebarNav";

interface AdminShellMobileSidebarProps {
  isLoggingOut: boolean;
  showMobileSidebar: boolean;
  setShowMobileSidebar: (show: boolean) => void;
  handleLogout: () => void;
  pathname: string;
}

export function AdminShellMobileSidebar({
  isLoggingOut,
  showMobileSidebar,
  setShowMobileSidebar,
  handleLogout,
  pathname,
}: AdminShellMobileSidebarProps) {

  if (!showMobileSidebar) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setShowMobileSidebar(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
      />

      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-900 shadow-2xl z-50 lg:hidden flex flex-col"
      >
        <div className="p-2 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
          <AdminSidebarHeader />
          <button
            onClick={() => setShowMobileSidebar(false)}
            className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-slate-700"
          >
            <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
        <div className="flex-1 p-2 overflow-y-auto">
          <AdminSidebarNav pathname={pathname} onNav={() => setShowMobileSidebar(false)} isMobile />
        </div>
        <div className="p-3 border-t border-gray-200 dark:border-slate-800">
          <AdminLogoutButton onLogout={handleLogout} isLoggingOut={isLoggingOut} />
        </div>
      </motion.div>
    </>
  );
}