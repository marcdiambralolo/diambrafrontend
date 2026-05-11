"use client";
import { motion } from "framer-motion";
import { memo } from "react";

const ActivityBackground = memo(() => (
  <div className="absolute inset-0 opacity-10">
    <motion.div
      animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute -top-20 -right-20 w-48 h-48 bg-white rounded-full blur-3xl"
    />
  </div>
));

ActivityBackground.displayName = "ActivityBackground";

export default ActivityBackground;