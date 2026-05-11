"use client";

import { SimpleMessage } from "@/lib/api/services/simple-message.service";
import { usersService } from "@/lib/api/services/users.service";
import { useAuth } from "@/lib/auth/AuthContext";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { simpleMessageService } from "@/lib/api/services/simple-message.service";

export const CONSTANTS = {
    PAGE_SIZE: 10,
    DEBOUNCE_DELAY_MS: 200,
    REFRESH_INTERVAL_MS: 30000,
    MAX_MESSAGE_PREVIEW: 100,
    ANIMATION_DURATION: 0.2,
} as const;

export interface UserInfo {
    id: string;
    nom: string;
    prenoms: string;
    username: string;
    email?: string;
    avatar?: string;
}

export interface EnrichedMessage extends SimpleMessage {
    fromUserInfo?: UserInfo;
    toUserInfo?: UserInfo;
    isStarred?: boolean;
    isArchived?: boolean;
}

export type ViewMode = "inbox" | "sent" | "starred" | "archived";

export function safeText(value: unknown) {
    return typeof value === "string" ? value : "";
}

export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debouncedValue;
}

export const enhancedMessageService = {
    ...simpleMessageService,
    getSent: async (userId: string): Promise<SimpleMessage[]> => {
        if ("getSent" in simpleMessageService && typeof (simpleMessageService as any).getSent === "function") {
            return (simpleMessageService as any).getSent(userId);
        }
        const allMessages = await simpleMessageService.getInbox(userId);
        return allMessages.filter((msg) => msg.fromUserId === userId);
    },
    getStarred: async (userId: string): Promise<SimpleMessage[]> => {
        const allMessages = await simpleMessageService.getInbox(userId);
        return allMessages.filter((msg) => (msg as any).isStarred === true);
    },
    getArchived: async (userId: string): Promise<SimpleMessage[]> => {
        const allMessages = await simpleMessageService.getInbox(userId);
        return allMessages.filter((msg) => (msg as any).isArchived === true);
    },
};

export function useMessagerie() {
    const { user } = useAuth();

    const [messages, setMessages] = useState<EnrichedMessage[]>([]);
    const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [currentView, setCurrentView] = useState<ViewMode>("inbox");
    const [usersCache, setUsersCache] = useState<Map<string, UserInfo>>(new Map());
    const [searchQuery, setSearchQuery] = useState("");
    const [sending, setSending] = useState(false);
    const [page, setPage] = useState(1);

    const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const loadingRef = useRef(false);

    // Enrichir les messages avec les infos utilisateurs
    const enrichMessages = useCallback(
        async (rawMessages: SimpleMessage[]): Promise<EnrichedMessage[]> => {
            const ids = new Set<string>();

            rawMessages.forEach((msg) => {
                if (msg.fromUserId) ids.add(msg.fromUserId);
                if (msg.toUserId) ids.add(msg.toUserId);
            });

            const usersToLoad = Array.from(ids).filter((id) => !usersCache.has(id));

            if (usersToLoad.length > 0) {
                const loadedEntries = await Promise.all(
                    usersToLoad.map(async (id) => {
                        try {
                            const userInfo = await usersService.getById(id);
                            return [
                                id,
                                {
                                    id: userInfo._id as string,
                                    nom: userInfo.nom || "",
                                    prenoms: userInfo.prenoms || "",
                                    username: userInfo.username || "",
                                    email: userInfo.email as string,
                                    avatar: (userInfo as any).avatar,
                                } satisfies UserInfo,
                            ] as const;
                        } catch {
                            return null;
                        }
                    })
                );

                setUsersCache((prev) => {
                    const next = new Map(prev);
                    loadedEntries.forEach((entry) => {
                        if (entry) next.set(entry[0], entry[1]);
                    });
                    return next;
                });
            }

            return rawMessages.map((msg) => ({
                ...msg,
                fromUserInfo: usersCache.get(msg.fromUserId),
                toUserInfo: usersCache.get(msg.toUserId),
                isStarred: Boolean((msg as any).isStarred),
                isArchived: Boolean((msg as any).isArchived),
            }));
        },
        [usersCache]
    );

    // Charger les messages
    const loadMessages = useCallback(async () => {
        if (!user?._id || loadingRef.current) return;

        loadingRef.current = true;
        setLoading(true);

        try {
            let rawMessages: SimpleMessage[] = [];

            switch (currentView) {
                case "inbox":
                    rawMessages = await enhancedMessageService.getInbox(user._id);
                    break;
                case "sent":
                    rawMessages = await enhancedMessageService.getSent(user._id);
                    break;
                case "starred":
                    rawMessages = await enhancedMessageService.getStarred(user._id);
                    break;
                case "archived":
                    rawMessages = await enhancedMessageService.getArchived(user._id);
                    break;
            }

            const enriched = await enrichMessages(rawMessages);

            enriched.sort((a, b) => {
                const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return bTime - aTime;
            });

            setMessages(enriched);
        } catch (error) {
            console.error("Erreur chargement messagerie :", error);
        } finally {
            loadingRef.current = false;
            setLoading(false);
        }
    }, [currentView, enrichMessages, user?._id]);

    // Chargement initial
    useEffect(() => {
        void loadMessages();
    }, [loadMessages]);

    // Rafraîchissement périodique
    useEffect(() => {
        refreshIntervalRef.current = setInterval(() => {
            void loadMessages();
        }, CONSTANTS.REFRESH_INTERVAL_MS);

        return () => {
            if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
        };
    }, [loadMessages]);

    // Reset page quand la vue ou la recherche change
    useEffect(() => {
        setPage(1);
    }, [currentView, searchQuery]);

    // Filtrer les messages par recherche
    const filteredMessages = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return messages;

        return messages.filter((msg) => {
            const fromUser = msg.fromUserInfo;
            const toUser = msg.toUserInfo;
            const fromName = fromUser ? `${fromUser.prenoms} ${fromUser.nom}`.toLowerCase() : "";
            const toName = toUser ? `${toUser.prenoms} ${toUser.nom}`.toLowerCase() : "";

            return (
                safeText(msg.subject).toLowerCase().includes(query) ||
                safeText(msg.text).toLowerCase().includes(query) ||
                fromName.includes(query) ||
                toName.includes(query)
            );
        });
    }, [messages, searchQuery]);

    const totalPages = Math.max(1, Math.ceil(filteredMessages.length / CONSTANTS.PAGE_SIZE));

    const paginatedMessages = useMemo(() => {
        const start = (page - 1) * CONSTANTS.PAGE_SIZE;
        return filteredMessages.slice(start, start + CONSTANTS.PAGE_SIZE);
    }, [filteredMessages, page]);

    const selectedMessage = useMemo(
        () => messages.find((m) => m._id === selectedMessageId) ?? null,
        [messages, selectedMessageId]
    );

    // Nettoyer la sélection si le message n'existe plus
    useEffect(() => {
        if (!selectedMessageId) return;
        const stillExists = messages.some((m) => m._id === selectedMessageId);
        if (!stillExists) {
            setSelectedMessageId(null);
        }
    }, [messages, selectedMessageId]);

    const unreadCount = useMemo(() => {
        return messages.filter((m) => (m as any).read === false || (m as any).isRead === false).length;
    }, [messages]);

    const handleSelectMessage = useCallback((messageId: string) => {
        setSelectedMessageId(messageId);
        
        // Marquer comme lu
        setMessages((prev) =>
            prev.map((m) =>
                m._id === messageId ? { ...m, read: true, isRead: true } as any : m
            )
        );
    }, []);

    const handleAdvancedFilter = useCallback(() => {
        // TODO: Implémenter un vrai modal de filtres
        alert("Fonctionnalité de filtres avancés à implémenter !");
    }, []);

    const handleDeleteMessage = useCallback(
        async (messageId: string) => {
            const ok = window.confirm("Supprimer définitivement ce message ?");
            if (!ok) return;

            try {
                await enhancedMessageService.deleteMessage(messageId);
                setMessages((prev) => prev.filter((m) => m._id !== messageId));

                if (selectedMessageId === messageId) {
                    setSelectedMessageId(null);
                }
            } catch (error) {
                console.error("Erreur suppression :", error);
                alert("Erreur lors de la suppression");
            }
        },
        [selectedMessageId]
    );

    const handleStarMessage = useCallback((messageId: string) => {
        setMessages((prev) =>
            prev.map((m) => (m._id === messageId ? { ...m, isStarred: !m.isStarred } : m))
        );
    }, []);

    const handleArchive = useCallback(async (messageId: string) => {
        setMessages((prev) =>
            prev.map((m) => (m._id === messageId ? { ...m, isArchived: true } : m))
        );

        if (selectedMessageId === messageId) {
            setSelectedMessageId(null);
        }
    }, [selectedMessageId]);

    const handleReply = useCallback(async (messageId: string, replyText: string) => {
        const messageToReply = messages.find((m) => m._id === messageId);
        if (!messageToReply || !user?._id) return;

        setSending(true);

        try {
            await enhancedMessageService.sendSimpleMessage({
                toUserId: messageToReply.fromUserId,
                fromUserId: user._id,
                text: replyText,
                subject: `Re: ${messageToReply.subject || "Message"}`,
            });

            // Rafraîchir les messages après envoi
            await loadMessages();
            return true;
        } catch (error) {
            console.error("Erreur envoi réponse :", error);
            throw error;
        } finally {
            setSending(false);
        }
    }, [messages, user?._id, loadMessages]);

    return {
        // États
        currentView,
        setCurrentView,
        paginatedMessages,
        totalPages,
        page,
        setPage,
        selectedMessage,
        unreadCount,
        searchQuery,
        setSearchQuery,
        loading,
        sending,
        filteredMessages,
        
        // Actions
        handleSelectMessage,
        handleDeleteMessage,
        handleStarMessage,
        handleArchive,
        handleReply,
        handleAdvancedFilter,
        loadMessages,
    };
}