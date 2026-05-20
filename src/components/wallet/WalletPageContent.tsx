"use client";
import CacheLink from "@/components/commons/CacheLink";
import { useWalletPageWithCache } from "@/hooks/cache/useWalletPageWithCache";
import { cx } from "@/lib/functions";
import { Transaction, TransactionItem } from "@/lib/interfaces";
import { motion, Variants } from "framer-motion";
import { ArrowLeftCircle, Calendar, Clock, CreditCard, Gift, RefreshCw, ShoppingBag, TrendingUp } from "lucide-react";
import { memo, useMemo, type ElementType } from "react";

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

function normalizeItem(item: TransactionItem) {
  if (typeof item.offeringId === 'object' && item.offeringId !== null) {
    return {
      ...item.offeringId,
      quantity: item.quantity,
      price: item.price ?? item.offeringId.price,
      name: item.offeringId.name ?? 'Jeton',
    };
  }

  return {
    ...item,
    name: item.name ?? 'Jeton',
    price: item.price ?? item.unitPrice ?? 0,
  };
}

function WalletTabs({
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
        Transactions
      </button>
    </div>
  );
}

const StatsCard = memo(function StatsCard({
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

function TransactionsToolbar({
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

interface OfferingItemCardProps {
  item: any;
  index: number;
}

const OfferingItemCard = memo(function OfferingItemCard({
  item,
  index,
}: OfferingItemCardProps) {

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

const TransactionCard = memo(function TransactionCard({
  transaction,
}: {
  transaction: Transaction;
  index: number;
}) {

  const normalizedItems = useMemo(
    () => transaction.items.map((item) => normalizeItem(item)),
    [transaction.items]
  );

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
                ID :   {transaction.transactionId?.slice(-12)}
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
        </div>

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
      </div>
    </motion.div>
  );
});

function TransactionEmptyState() {
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
        Vos prochains achats de jetons apparaîtront ici.
      </p>
    </motion.div>
  );
}

function UnusedOfferingsSection({
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

function BottomCtas({ href, label }: { href: string; label: string }) {
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
        Acquerir des Jetons
      </CacheLink>
    </motion.div>
  );
}

const LoadingScreen = () => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center">
    <div className="relative">
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
    </div>
    <p className="mt-4 text-sm text-gray-500">Chargement de vos transactions</p>
  </div>
);

export default function WalletPageContent() {
  const {
    setSortOrder, onRefresh, setActiveTab,
    unusedError, isLoading, unusedOfferings, stats, sortOrder, filteredTransactions,
    backLink: { href, label }, activeTab, isRefreshing,
  } = useWalletPageWithCache();

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <WalletTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "transactions" ? (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-5"
        >
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

          <TransactionsToolbar
            onRefresh={onRefresh}
            isRefreshing={isRefreshing}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />

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
  );
}