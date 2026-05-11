"use client";
import { motion } from "framer-motion";
import { memo } from "react";

const LiveBadge = memo(() => (
  <motion.div
    animate={{ scale: [1, 1.05, 1] }}
    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-1"
  >
    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
    
    <span className="text-xs font-semibold">LIVE</span>
  </motion.div>
));

LiveBadge.displayName = "LiveBadge";

export default LiveBadge;