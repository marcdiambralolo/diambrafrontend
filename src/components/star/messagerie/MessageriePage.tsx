"use client";
import { useMessagerie } from "@/hooks/messaging/useMessagerie";
import { SimpleMessage } from "@/lib/api/services/simple-message.service";
import { motion, AnimatePresence } from "framer-motion";
import {
  Archive,
  ArrowLeft,
  CheckCheck,
  Filter,
  Inbox,
  LayoutGrid,
  List,
  Mail, Paperclip,
  RefreshCw,
  Reply,
  Search,
  Send,
  Smile,
  Star,
  Trash2,
  X,
  Menu
} from "lucide-react";
import { memo, useCallback, useEffect, useRef, useState } from "react";

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

// ==================== ÉDITEUR DE RÉPONSE ====================
const RichReplyEditor = memo(function RichReplyEditor({
  onSubmit,
  sending,
  onCancel,
  autoFocus = true,
}: {
  onSubmit: (reply: string) => Promise<void>;
  sending: boolean;
  onCancel?: () => void;
  autoFocus?: boolean;
}) {
  const [reply, setReply] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(async () => {
    if (!reply.trim() || sending) return;
    await onSubmit(reply.trim());
    setReply("");
  }, [reply, sending, onSubmit]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="mt-4 rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm"
    >
      <textarea
        ref={textareaRef}
        className="w-full p-4 text-sm resize-none focus:outline-none min-h-[100px]"
        placeholder="Écrire votre réponse... (Shift+Enter pour sauter une ligne)"
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        disabled={sending}
        autoFocus={autoFocus}
      />
      <div className="flex items-center justify-between p-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <button type="button" className="p-2 rounded-lg hover:bg-gray-200 transition">
            <Paperclip className="w-4 h-4 text-gray-500" />
          </button>
          <button type="button" className="p-2 rounded-lg hover:bg-gray-200 transition">
            <Smile className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-1.5 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-200 transition"
            >
              Annuler
            </button>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium hover:shadow-lg transition disabled:opacity-50"
            disabled={sending || !reply.trim()}
          >
            {sending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Envoi...
              </div>
            ) : (
              "Envoyer"
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
});

// ==================== COMPOSANT DE VUE MESSAGE (MOBILE OPTIMISÉ) ====================
function MessageDetailView({
  message,
  currentView,
  onBack,
  onReply,
  onArchive,
  onStar,
  onDelete,
  sending,
  replySuccess,
}: {
  message: EnrichedMessage;
  currentView: string;
  onBack: () => void;
  onReply: (reply: string) => Promise<void>;
  onArchive: () => void;
  onStar: () => void;
  onDelete: () => void;
  sending: boolean;
  replySuccess: boolean;
}) {
  const [showReplyEditor, setShowReplyEditor] = useState(false);
  
  // Fermer l'éditeur et revenir à la liste après envoi réussi
  useEffect(() => {
    if (replySuccess) {
      setShowReplyEditor(false);
    }
  }, [replySuccess]);

  const userInfo = currentView === "sent" ? message.toUserInfo : message.fromUserInfo;
  const displayName = userInfo
    ? `${userInfo.prenoms} ${userInfo.nom}`.trim() || userInfo.username
    : message.fromUserId;

  return (
    <motion.div
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 bg-white overflow-y-auto"
    >
      {/* Header fixe */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                onClick={onBack}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
                aria-label="Retour"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="h-6 w-px bg-gray-200 mx-1" />
              <button
                onClick={onArchive}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
                aria-label="Archiver"
              >
                <Archive className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={onStar}
                className="p-2 rounded-lg hover:bg-yellow-50 transition"
                aria-label="Marquer d'importance"
              >
                <Star className={`w-5 h-5 transition ${message.isStarred ? "fill-yellow-500 text-yellow-500" : "text-gray-600"}`} />
              </button>
              <button
                onClick={onDelete}
                className="p-2 rounded-lg hover:bg-red-50 transition"
                aria-label="Supprimer"
              >
                <Trash2 className="w-5 h-5 text-gray-600 hover:text-red-600" />
              </button>
            </div>
            <button 
              onClick={() => setShowReplyEditor(!showReplyEditor)}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium hover:shadow-lg transition flex items-center gap-2"
            >
              <Reply className="w-4 h-4" />
              <span className="hidden sm:inline">Répondre</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contenu du message */}
      <div className="px-4 py-6 pb-24">
        {/* Expéditeur */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-gray-900">{displayName}</h2>
            <p className="text-xs text-gray-400">{message.fromUserId}</p>
          </div>
          <div className="text-right text-xs text-gray-400">
            {message.createdAt && (
              <>
                <div>{new Date(message.createdAt).toLocaleDateString("fr-FR")}</div>
                <div>{new Date(message.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</div>
              </>
            )}
          </div>
        </div>

        {/* Sujet */}
        <div className="mb-6 pb-4 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-900">{message.subject || "Sans objet"}</h1>
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Reçu</span>
          </div>
        </div>

        {/* Corps du message */}
        <div className="mb-8">
          <div className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
            {message.text}
          </div>
        </div>

        {/* Formulaire de réponse */}
        <AnimatePresence>
          {showReplyEditor && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                Répondre à {displayName}
              </h3>
              <RichReplyEditor
                onSubmit={async (reply) => {
                  await onReply(reply);
                  // Le useEffect ci-dessus fermera l'éditeur
                }}
                sending={sending}
                onCancel={() => setShowReplyEditor(false)}
                autoFocus={true}
              />
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ==================== SIDEBAR MOBILE ====================
function MobileSidebar({
  currentView,
  setCurrentView,
  unreadCount,
  isOpen,
  onClose,
}: {
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  unreadCount: number;
  isOpen: boolean;
  onClose: () => void;
}) {
  const items = [
    { id: "inbox" as ViewMode, label: "Boîte de réception", icon: Inbox, badge: unreadCount },
    { id: "sent" as ViewMode, label: "Messages envoyés", icon: Send, badge: 0 },
    { id: "starred" as ViewMode, label: "Messages importants", icon: Star, badge: 0 },
    { id: "archived" as ViewMode, label: "Archives", icon: Archive, badge: 0 },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 shadow-xl"
          >
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Menu</h2>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <nav className="p-3 space-y-1">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setCurrentView(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition ${
                    currentView === item.id
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  {item.badge > 0 && (
                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-red-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ==================== COMPOSANT PRINCIPAL OPTIMISÉ MOBILE ====================
export function SimpleInboxTabs() {
  const {
    setCurrentView,
    setPage,
    handleSelectMessage,
    handleDeleteMessage,
    handleStarMessage,
    handleArchive,
    handleReply,
    setSearchQuery,
    loadMessages,
    searchQuery,
    sending,
    paginatedMessages,
    loading,
    totalPages,
    unreadCount,
    page,
    selectedMessage,
    currentView,
    filteredMessages,
  } = useMessagerie();

  const [showMessageDetail, setShowMessageDetail] = useState(false);
  const [layoutMode, setLayoutMode] = useState<"list" | "grid">("list");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [replySuccess, setReplySuccess] = useState(false);

  const onSelectMessage = useCallback((messageId: string) => {
    handleSelectMessage(messageId);
    setShowMessageDetail(true);
    setReplySuccess(false);
  }, [handleSelectMessage]);

  const handleBackToList = useCallback(() => {
    setShowMessageDetail(false);
    setReplySuccess(false);
  }, []);

  const handleReplyWithCallback = useCallback(async (reply: string) => {
    if (selectedMessage?._id) {
      await handleReply(selectedMessage._id, reply);
      setReplySuccess(true);
      // Retour automatique à la liste après 1 seconde
      setTimeout(() => {
        handleBackToList();
      }, 1000);
    }
  }, [handleReply, selectedMessage, handleBackToList]);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
      {/* Barre d'outils mobile flottante */}
      {!showMessageDetail && isMobile && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-6 right-6 z-30 p-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition"
          onClick={() => loadMessages()}
        >
          <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
        </motion.button>
      )}

      {(!showMessageDetail || !isMobile) && (
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
          {/* Header mobile */}
          <div className="flex items-center justify-between mb-4 md:mb-8">
            <div className="flex items-center gap-3">
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <Menu className="w-5 h-5 text-gray-600" />
                </button>
              )}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Messagerie
                </h1>
                <p className="text-xs md:text-sm text-gray-500 mt-0.5">
                  {unreadCount > 0 && `${unreadCount} message${unreadCount > 1 ? "s" : ""} non lu${unreadCount > 1 ? "s" : ""}`}
                </p>
              </div>
            </div>
            {!isMobile && (
              <button
                onClick={() => setLayoutMode(layoutMode === "list" ? "grid" : "list")}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
              >
                {layoutMode === "list" ? (
                  <LayoutGrid className="w-4 h-4 text-gray-500" />
                ) : (
                  <List className="w-4 h-4 text-gray-500" />
                )}
              </button>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar desktop */}
            {!isMobile && (
              <div className="w-72 flex-shrink-0">
                <div className="sticky top-6">
                  <nav className="space-y-1">
                    {[
                      { id: "inbox" as ViewMode, label: "Boîte de réception", icon: Inbox, badge: unreadCount },
                      { id: "sent" as ViewMode, label: "Messages envoyés", icon: Send, badge: 0 },
                      { id: "starred" as ViewMode, label: "Messages importants", icon: Star, badge: 0 },
                      { id: "archived" as ViewMode, label: "Archives", icon: Archive, badge: 0 },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setCurrentView(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition ${
                          currentView === item.id
                            ? "bg-indigo-50 text-indigo-700"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="w-4 h-4" />
                          <span className="text-sm font-medium">{item.label}</span>
                        </div>
                        {item.badge > 0 && (
                          <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-red-500 text-white">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            )}

            {/* Sidebar mobile */}
            <MobileSidebar
              currentView={currentView}
              setCurrentView={setCurrentView}
              unreadCount={unreadCount}
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />

            {/* Liste des messages */}
            <div className="flex-1 min-w-0">
              {/* Barre de recherche */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-200 bg-white text-sm shadow-sm"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    onClick={() => loadMessages()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-gray-100"
                  >
                    <Filter className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Liste */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => loadMessages()}
                      className="p-1.5 rounded-lg hover:bg-gray-100 transition"
                      disabled={loading}
                    >
                      <RefreshCw className={`w-4 h-4 text-gray-500 ${loading ? "animate-spin" : ""}`} />
                    </button>
                  </div>
                  <div className="text-sm text-gray-500">
                    {filteredMessages.length} message{filteredMessages.length > 1 ? "s" : ""}
                  </div>
                </div>

                <div className="divide-y divide-gray-50 max-h-[calc(100vh-280px)] overflow-y-auto">
                  {loading && (
                    <div className="p-12 text-center">
                      <div className="inline-block w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                    </div>
                  )}

                  {!loading && paginatedMessages.length === 0 && (
                    <div className="p-12 text-center">
                      <Mail className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                      <p className="text-gray-500">Aucun message</p>
                    </div>
                  )}

                  {paginatedMessages.map((msg) => {
                    const isUnread = (msg as any).read === false;
                    const senderInfo = currentView === "sent" ? msg.toUserInfo : msg.fromUserInfo;
                    const displayName = senderInfo?.username || `${senderInfo?.prenoms} ${senderInfo?.nom}`.trim() || msg.fromUserId;

                    return (
                      <motion.div
                        key={msg._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-3 md:p-4 cursor-pointer transition hover:bg-gray-50 border-l-4 ${
                          selectedMessage?._id === msg._id ? "border-l-indigo-500 bg-indigo-50/30" : "border-l-transparent"
                        }`}
                        onClick={() => onSelectMessage(msg._id!)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 ${
                            isUnread ? "from-indigo-500 to-purple-600" : "from-gray-400 to-gray-500"
                          }`}>
                            {displayName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                              <div className="flex items-center gap-2">
                                <span className={`truncate text-sm ${isUnread ? "font-semibold text-gray-900" : "text-gray-600"}`}>
                                  {displayName}
                                </span>
                                {isUnread && <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />}
                              </div>
                              <span className="text-xs text-gray-400 flex-shrink-0">
                                {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }) : ""}
                              </span>
                            </div>
                            {msg.subject && (
                              <div className={`text-sm truncate ${isUnread ? "font-medium" : "text-gray-500"}`}>
                                {msg.subject}
                              </div>
                            )}
                            <div className="text-xs text-gray-400 truncate mt-0.5">
                              {msg.text?.slice(0, 60)}...
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Pagination mobile optimisée */}
                {totalPages > 1 && (
                  <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-3 py-1.5 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-100 transition"
                    >
                      ← Préc.
                    </button>
                    <span className="text-sm text-gray-600">
                      {page} / {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-3 py-1.5 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-100 transition"
                    >
                      Suiv. →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vue message détaillée */}
      <AnimatePresence>
        {showMessageDetail && selectedMessage && (
          <MessageDetailView
            message={selectedMessage}
            currentView={currentView}
            onBack={handleBackToList}
            onReply={handleReplyWithCallback}
            onArchive={() => handleArchive(selectedMessage._id!)}
            onStar={() => handleStarMessage(selectedMessage._id!)}
            onDelete={() => {
              handleDeleteMessage(selectedMessage._id!);
              handleBackToList();
            }}
            sending={sending}
            replySuccess={replySuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function MessageriePage() {
  return (
    <div className="w-full min-h-screen">
      <SimpleInboxTabs />
    </div>
  );
}