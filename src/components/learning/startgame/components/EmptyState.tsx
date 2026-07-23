"use client";
import { memo } from "react";

const EmptyState = memo(({ message }: { message: string }) => (
    <div className="text-center text-gray-600 py-8">{message}</div>
));

EmptyState.displayName = 'EmptyState';

export default EmptyState;