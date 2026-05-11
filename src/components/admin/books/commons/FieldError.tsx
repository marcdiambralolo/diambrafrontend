"use client";
import React, { memo } from "react";

const FieldError = memo(function FieldError({ msg }: { msg?: string }) {
 
  if (!msg) return null;
  
  return (
    <p className="mt-1 text-[11px] font-semibold text-red-600 dark:text-red-400">
      {msg}
    </p>
  );
});

FieldError.displayName = "FieldError";

export default FieldError;