'use client';
import { BlogArticle, blogService } from "@/lib/api/services/blog.service";
import { QUERY_KEYS } from '@/lib/cache/queryClient';
import { stripMarkdown } from "@/lib/functions";
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

type ShareNavigator = Navigator & {
    share?: (data?: ShareData) => Promise<void>;
};

export const PrimaryBtn =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-extrabold text-white transition duration-200 " +
    "bg-slate-900 hover:bg-slate-800 " +
    "dark:bg-[#2E5AA6] dark:hover:bg-[#4F83D1] " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F83D1] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#070B1A]";

export const SecondaryBtn =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-extrabold transition duration-200 " +
    "border border-slate-200 bg-white text-slate-950 hover:bg-slate-50 " +
    "dark:border-[#2E5AA6] dark:bg-[#162A56] dark:text-white dark:hover:brightness-110 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F83D1] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#070B1A]";

export function useBlogArticle() {
    const params = useParams<{ id: string }>();
    const router = useRouter();

    const id = params?.id ?? '';

    const [shareUrl, setShareUrl] = useState<string>("");
    const [shareState, setShareState] = useState<"idle" | "copied" | "shared" | "error">("idle");

    const {
        data: post = null,
        isLoading: loading,
        error,
    } = useQuery<BlogArticle | null, any>({
        queryKey: QUERY_KEYS.BLOG_DETAIL(id),
        queryFn: () => blogService.getById(id),
        enabled: Boolean(id),
        staleTime: 1000 * 60, // 30 jours
        gcTime: 1000 * 60,
        // staleTime: 1000 * 60 * 60 * 24 * 30,
        // gcTime: 1000 * 60 * 60 * 24 * 30,
    });

    const normalizedContent = useMemo(() => (post?.content ?? '').replace(/\r\n/g, '\n'), [post?.content]);

    useEffect(() => {
        if (typeof window === "undefined") return;
        setShareUrl(window.location.href);
    }, []);

    const metaDescription = useMemo(() => {
        const txt = stripMarkdown(post?.content || "");
        if (!txt) return post?.title || "Article";
        return txt.length > 160 ? `${txt.slice(0, 160)}…` : txt;
    }, [post]);

    const handleBack = useCallback(() => {
        if (typeof window !== "undefined" && window.history.length > 1) router.back();
        else router.push("/star/blog");
    }, [router]);

    const handleShare = useCallback(async () => {
        if (!post) return;

        try {
            setShareState("idle");
            const shareNavigator = navigator as ShareNavigator;

            if (typeof navigator !== "undefined" && typeof shareNavigator.share === 'function' && shareUrl) {
                await shareNavigator.share({
                    title: post.title,
                    text: metaDescription,
                    url: shareUrl,
                });
                setShareState("shared");
                setTimeout(() => setShareState("idle"), 1500);
                return;
            }
            if (typeof navigator !== "undefined" && navigator.clipboard && shareUrl) {
                await navigator.clipboard.writeText(shareUrl);
                setShareState("copied");
                setTimeout(() => setShareState("idle"), 1500);
                return;
            }

            setShareState("error");
            setTimeout(() => setShareState("idle"), 2000);
        } catch {
            setShareState("error");
            setTimeout(() => setShareState("idle"), 2000);
        }
    }, [metaDescription, post, shareUrl]);

    const shareLabel = shareState === "copied" ? "LIEN COPIE" : shareState === "shared"
        ? "PARTAGE" : shareState === "error" ? "IMPOSSIBLE" : "PARTAGER";

    return {
        handleShare, handleBack, loading, post, error, normalizedContent, shareLabel,
    };
}