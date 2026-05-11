import React, { memo } from "react";
import { cx } from '@/lib/functions';

const ShellCard = memo(function ShellCard({ children, }: { children: React.ReactNode; }) {
    return (
        <div
            className={cx(
                "relative overflow-hidden border rounded-2xl shadow-[0_8px_32px_-18px_rgba(46,90,166,0.18)] backdrop-blur",
                "border-[#1C3A6B] bg-[#162A56]"
            )}
        >
            {children}
        </div>
    );
});

export default ShellCard;
