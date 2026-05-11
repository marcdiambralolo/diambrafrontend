"use client";
import { motion } from "framer-motion";
import { AdminLogoutButton } from "../commons/AdminLogoutButton";
import { AdminSidebarHeader } from "./AdminSidebarHeader";
import { AdminSidebarNav } from "./AdminSidebarNav";

interface AdminShellDesktopSidebarProps {
  pathname: string;
  handleLogout: () => void;
  isLoggingOut: boolean;
}

export function AdminShellDesktopSidebar({ pathname, handleLogout, isLoggingOut, }: AdminShellDesktopSidebarProps) {

  return (
    <motion.nav
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="theme-dark-panel hidden w-16 flex-col border-r border-gray-200 bg-white shadow-sm transition-all duration-300 lg:flex lg:w-64 dark:bg-[color:var(--theme-layer-2)]"
    >
      <div className="flex flex-col items-center border-b border-gray-200 p-2 lg:items-start lg:p-3 dark:border-[color:var(--theme-separator)]">
        <AdminSidebarHeader />
      </div>

      <div className="flex-1 p-1 lg:p-2 overflow-y-auto">
        <AdminSidebarNav pathname={pathname} />
      </div>

      <div className="border-t border-gray-200 p-2 lg:p-2 dark:border-[color:var(--theme-separator)]">
        <AdminLogoutButton onLogout={handleLogout} isLoggingOut={isLoggingOut} />
      </div>
    </motion.nav>
  );
}