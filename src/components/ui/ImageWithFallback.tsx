"use client";
import { cx } from "@/lib/functions";
import Image, { ImageProps } from "next/image";
import { useState } from "react";

export function ImageWithFallback({
    src, alt, className, ...props
}: ImageProps & { className?: string }) {
    const [error, setError] = useState(false);

    if (error || !src) {
        return (
            <div
                className={cx(
                    "flex items-center justify-center rounded-full",
                    "bg-amber-50 shadow-lg shadow-amber-200/50",
                    className
                )}
                aria-label="Fallback star icon"
            >
                <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="drop-shadow-md animate-pulse"
                >
                    <path
                        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                        fill="#FBBF24"
                        stroke="#D97706"
                        strokeWidth="1.2"
                    />
                </svg>
            </div>
        );
    }

    return (
        <Image
            src={src}
            alt={alt}
            className={cx("object-cover", className)}
            onError={() => setError(true)}
            {...props}
        />
    );
}