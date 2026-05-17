"use client";
import CacheLink from "@/components/commons/CacheLink";
import { useWalletPageWithCache } from "@/hooks/cache/useWalletPageWithCache";
import { cx } from "@/lib/functions";
import { Transaction, TransactionItem } from "@/lib/interfaces";
import { AnimatePresence, motion, Variants } from "framer-motion";
import {
  ArrowLeftCircle,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  CreditCard,
  Gift,
  Package,
  RefreshCw,
  ShoppingBag,
  TrendingUp,
  Wallet
} from "lucide-react";
import { memo, useMemo, useState, type ElementType } from "react";

// ==================== CONSTANTES D'ANIMATION ====================
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
};


export function getCategoryConfig() {
   return { label: 'Banque', color: 'bg-amber-100 text-amber-700' };
}

export function normalizeItem(item: TransactionItem) {
  if (typeof item.offeringId === 'object' && item.offeringId !== null) {
    return {
      ...item.offeringId,
      quantity: item.quantity,
      price: item.price ?? item.offeringId.price,
      name: item.offeringId.name ?? 'jeton',
    };
  }

  return {
    ...item,
    category: 'banque',
    name: item.name ?? 'jeton',
    price: item.price ?? item.unitPrice ?? 0,
  };
}

// ==================== HERO SECTION ====================
export function WalletHero() {
  return (
    <motion.div variants={fadeInUp} className="text-center mb-8">
      <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 px-3 py-1.5 mb-4">
        <Wallet className="h-3.5 w-3.5 text-indigo-600" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
          Porte-monnaie
        </span>
      </div> 
      <p className="mx-auto mt-3 max-w-md text-sm text-gray-500">
        Gérez vos jetons disponibles, suivez vos dépenses et retrouvez
        vos dernières transactions.
      </p>
    </motion.div>
  );
}

// ==================== SUCCESS BANNER ====================
export function SuccessBanner({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className="mb-6"
    >
      <div className="rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500">
            <CheckCircle2 className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-emerald-800">Transaction réussie !</h3>
            <p className="text-sm text-emerald-700">
              Votre commande a bien été enregistrée dans votre wallet.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-500 hover:text-emerald-700 transition-colors"
            type="button"
          >
            ✕
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ==================== TABS ====================
export function WalletTabs({
  activeTab,
  setActiveTab,
}: {
  activeTab: "transactions" | "unused-offerings";
  setActiveTab: (tab: "transactions" | "unused-offerings") => void;
}) {
  return (
    <div className="flex justify-center gap-2 p-1 bg-gray-100 rounded-xl w-fit mx-auto mb-6">
      <button
        className={cx(
          "px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300",
          activeTab === "unused-offerings"
            ? "bg-white text-indigo-600 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        )}
        onClick={() => setActiveTab("unused-offerings")}
        type="button"
      >
        <Gift className="h-4 w-4 inline mr-2" />
        Jetons disponibles
      </button>
      <button
        className={cx(
          "px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300",
          activeTab === "transactions"
            ? "bg-white text-indigo-600 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        )}
        onClick={() => setActiveTab("transactions")}
        type="button"
      >
        <Clock className="h-4 w-4 inline mr-2" />
        Dernières transactions
      </button>
    </div>
  );
}

// ==================== STATS CARDS ====================
export const StatsCard = memo(function StatsCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: ElementType;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -4 }}
      className="flex-1 rounded-xl bg-white border border-gray-100 p-5 shadow-sm text-center"
    >
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100">
        <Icon className="h-5 w-5 text-indigo-600" />
      </div>
      <p className="text-2xl font-black text-gray-900">{value}</p>
      <p className="mt-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
        {label}
      </p>
    </motion.div>
  );
});

// ==================== TRANSACTIONS TOOLBAR ====================
export function TransactionsToolbar({
  onRefresh,
  isRefreshing,
  sortOrder,
  setSortOrder,
}: {
  onRefresh: () => void;
  isRefreshing: boolean;
  sortOrder: "newest" | "oldest" | "amount_high" | "amount_low";
  setSortOrder: (v: "newest" | "oldest" | "amount_high" | "amount_low") => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 mb-4">
      <motion.button
        whileHover={{ rotate: 180 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRefresh}
        disabled={isRefreshing}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-all hover:border-indigo-200 hover:text-indigo-600"
        type="button"
      >
        <RefreshCw className={cx("h-4 w-4", isRefreshing && "animate-spin")} />
      </motion.button>

      <select
        value={sortOrder}
        onChange={(e) =>
          setSortOrder(e.target.value as "newest" | "oldest" | "amount_high" | "amount_low")
        }
        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-200"
      >
        <option value="newest">📅 Plus récent</option>
        <option value="oldest">📅 Plus ancien</option>
        <option value="amount_high">💰 Montant décroissant</option>
        <option value="amount_low">💰 Montant croissant</option>
      </select>
    </div>
  );
}

// ==================== OFFERING ITEM CARD ====================
interface OfferingItemCardProps {
  item: any;
  index: number;
}

const OfferingItemCard = memo(function OfferingItemCard({
  item,
  index,
}: OfferingItemCardProps) {
  const categoryConfig = getCategoryConfig();

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      className="flex items-center gap-3 rounded-lg bg-gray-50 p-3"
    >
           <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-gray-800">{item.name}</p>
        </div>
        <p className="text-xs text-gray-500">
          {item.quantity} × {item.price?.toLocaleString()} FCFA
        </p>
      </div>

      <div className="text-right">
        <p className="text-sm font-bold text-indigo-600">
          {(item.quantity * item.price).toLocaleString()}
        </p>
        <p className="text-[10px] text-gray-400">FCFA</p>
      </div>
    </motion.div>
  );
});

// ==================== TRANSACTION CARD ====================
export const TransactionCard = memo(function TransactionCard({
  transaction,
}: {
  transaction: Transaction;
  index: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const normalizedItems = useMemo(
    () => transaction.items.map((item) => normalizeItem(item)),
    [transaction.items]
  );

  const previewText = useMemo(() => {
    const names = normalizedItems
      .map((i) => i.name)
      .filter(Boolean)
      .slice(0, 2)
      .join(", ");
    return normalizedItems.length > 2 ? `${names}...` : names;
  }, [normalizedItems]);

  return (
    <motion.div
      variants={fadeInUp}
      className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden"
    >
      <div className="p-4">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="h-4 w-4 text-indigo-500" />
              <p className="text-xs font-mono font-semibold text-gray-500">
                {transaction.transactionId?.slice(-8)}
              </p> 
            </div>
            <p className="flex items-center gap-1 text-xs text-gray-400">
              <Calendar className="h-3 w-3" />
              {new Date(transaction.completedAt || transaction.createdAt).toLocaleString("fr-FR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-indigo-600">
              {transaction.totalAmount.toLocaleString()}
            </p>
            <p className="text-[10px] text-gray-400">FCFA</p>
          </div>
        </div>
 
        <div className="mb-3 flex items-center gap-2 rounded-lg bg-gray-50 p-2">
          <div className="flex -space-x-1">
            {normalizedItems.slice(0, 3).map((item, idx) => (
              <div
                key={idx}
                className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-indigo-100 to-purple-100"
              >
                <Package className="h-3 w-3 text-indigo-600" />

              </div>
            ))}
            {normalizedItems.length > 3 && (
              <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-xs font-bold text-gray-600">
                +{normalizedItems.length - 3}
              </div>
            )}
          </div>
          <span className="flex-1 text-xs text-gray-500 truncate">
            {previewText || "Détails de la transaction"}
          </span>
        </div>

        {/* Bouton d'expansion */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center justify-center gap-1 rounded-lg border border-gray-200 bg-white py-2 text-xs font-semibold text-gray-600 transition-all hover:border-indigo-200 hover:text-indigo-600"
          type="button"
        >
          <Package className="h-3.5 w-3.5" />
          {normalizedItems.length} jeton(s)
          <ChevronDown
            className={cx(
              "h-3.5 w-3.5 transition-transform duration-300",
              isExpanded && "rotate-180"
            )}
          />
        </button>

        {/* Liste détaillée */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-3 space-y-2 overflow-hidden"
            >
              {normalizedItems.map((item, idx) => (
                <OfferingItemCard key={idx} item={item} index={idx} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

// ==================== EMPTY STATE ====================
export function TransactionEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl bg-white border border-gray-100 p-10 text-center shadow-sm"
    >
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-purple-100">
        <ShoppingBag className="h-8 w-8 text-indigo-500" />
      </div>
      <h3 className="mb-1 text-lg font-bold text-gray-800">Aucune transaction</h3>
      <p className="text-sm text-gray-500">
        Vos prochains achats apparaîtront ici.
      </p>
    </motion.div>
  );
}

// ==================== UNUSED OFFERINGS SECTION ====================
export function UnusedOfferingsSection({
  unusedError,
  unusedOfferings,
}: {
  unusedError: string | null | undefined;
  unusedOfferings: any[];
}) {
  return (
    <motion.div variants={fadeInUp} className="space-y-4">
      {unusedError ? (
        <div className="rounded-xl bg-red-50 p-4 text-center text-sm text-red-600">
          {unusedError}
        </div>
      ) : unusedOfferings.length === 0 ? (
        <div className="rounded-xl bg-white border border-gray-100 p-10 text-center shadow-sm">
          <Gift className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Aucun jeton disponible</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {unusedOfferings.map((item, idx) => {
            const o = item.offering;
            const category = getCategoryConfig();

            return (
              <motion.div
                key={o?._id || idx}
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                className="rounded-xl bg-white border border-gray-100 p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-28 w-28 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100">
                    <Gift className="h-28 w-28 text-indigo-500" />

                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-gray-800">{o?.name}</h3>
                      <span className={cx("rounded-full px-2 py-0.5 text-[10px] font-bold", category.color)}>
                        {category.label}
                      </span>
                      <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                        x{item.quantity}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">{o?.description}</p>
                    <p className="mt-2 text-sm font-bold text-indigo-600">
                      {o?.price?.toLocaleString()} FCFA
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

// ==================== BOTTOM CTAS ====================
export function BottomCtas({ href, label }: { href: string; label: string }) {
  return (
    <motion.div variants={fadeInUp} className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
      <CacheLink
        href={href}
        className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-orange-600 hover:shadow-lg hover:-translate-y-0.5"
      >
        <ArrowLeftCircle className="h-4 w-4" />
        {label}
      </CacheLink>

      <CacheLink
        href="/star/marcheoffrandes"
        className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
      >
        <ShoppingBag className="h-4 w-4" />
        Marché des Jetons
      </CacheLink>
    </motion.div>
  );
}

// ==================== LOADING SCREEN ====================
export const LoadingScreen = () => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center">
    <div className="relative">
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
    </div>
    <p className="mt-4 text-sm text-gray-500">Chargement de votre espace...</p>
  </div>
);

export default function WalletPageContent() {
  const {
    setSortOrder, dismissBanner, onRefresh, setActiveTab,
    unusedError, isLoading, unusedOfferings, stats, sortOrder, filteredTransactions,
    backLink: { href, label }, activeTab, isRefreshing, showSuccessBanner,
  } = useWalletPageWithCache();

  if (isLoading) return <LoadingScreen />;

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50/50">
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <AnimatePresence>
          {showSuccessBanner && <SuccessBanner onClose={dismissBanner} />}
        </AnimatePresence>

        <WalletHero />

        <WalletTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "transactions" ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-5"
          >
            {/* Stats */}
            <div className="flex gap-4">
              <StatsCard
                label="Total transactions"
                value={stats.totalTransactions}
                icon={ShoppingBag}
              />
              <StatsCard
                label="Total dépensé"
                value={`${stats.totalSpent.toLocaleString()} F`}
                icon={TrendingUp}
              />
            </div>

            {/* Toolbar */}
            <TransactionsToolbar
              onRefresh={onRefresh}
              isRefreshing={isRefreshing}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />

            {/* Liste des transactions */}
            {filteredTransactions.length === 0 ? (
              <TransactionEmptyState />
            ) : (
              <div className="space-y-3">
                {filteredTransactions.map((transaction, index) => (
                  <TransactionCard
                    key={transaction._id}
                    transaction={transaction}
                    index={index}
                  />
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <UnusedOfferingsSection
            unusedError={unusedError}
            unusedOfferings={unusedOfferings}
          />
        )}

        <BottomCtas href={href} label={label} />
      </div>
    </main>
  );
}