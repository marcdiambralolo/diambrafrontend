'use client';
import CacheLink from '@/components/commons/CacheLink';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Clock, CreditCard, DollarSign, FileText, TrendingUp, Users } from 'lucide-react';
import React, { memo, useMemo } from 'react';

export interface DetailItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  color: string;
}

export interface DetailCardItemProps {
  item: DetailItem;
  index: number;
}

export const DetailCardItem = memo<DetailCardItemProps>(({ item, index }) => (
  <div
    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-all"
    style={{ transitionDelay: `${index * 50}ms` }}
  >
    <span className="text-gray-700 flex items-center gap-2 text-sm font-medium">
      <div className={`p-1 bg-${item.color}-100 rounded`}>
        <item.icon className={`w-3 h-3 text-${item.color}-600`} />
      </div>
      {item.label}
    </span>

    <span className="font-bold text-gray-900 text-sm">{item.value}</span>
  </div>
));
 
export interface ProgressBarProps {
  percentage: string | number;
  label: string;
  delay?: number;
  color?: string;
}

export const ProgressBar = memo<ProgressBarProps>(({
  percentage,
  label,
  delay = 0,
  color = 'blue'
}) => (
  <div className="mt-4 pt-3 border-t border-gray-100">
    <div className="flex justify-between text-xs mb-1.5">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold text-gray-900">{percentage}%</span>
    </div>
    
    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: 'easeOut', delay }}
        className={`h-full bg-gradient-to-r from-${color}-500 to-${color}-600 rounded-full`}
      />
    </div>
  </div>
));
 
export interface DetailCardProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  items: DetailItem[];
  progressLabel: string;
  progressValue: string | number;
  progressColor: string;
  progressDelay: number;
  linkHref: string;
}

export const DetailCard = memo<DetailCardProps>(({
  title,
  icon: Icon,
  iconColor,
  items,
  progressLabel,
  progressValue,
  progressColor,
  progressDelay,
  linkHref
}) => (
  <motion.div
    whileHover={{ y: -3 }}
    className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 p-4 transition-all"
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className={`p-1.5 bg-${iconColor}-50 rounded-lg`}>
          <Icon className={`w-4 h-4 text-${iconColor}-600`} />
        </div>
        <h3 className="text-base font-bold text-gray-900">{title}</h3>
      </div>
      <CacheLink
        href={linkHref}
        className="text-blue-600 hover:text-blue-700 text-xs font-semibold hover:underline transition-colors"
      >
        Voir tout →
      </CacheLink>
    </div>

    <div className="space-y-2.5">
      {items.map((item, index) => (
        <DetailCardItem key={index} item={item} index={index} />
      ))}
    </div>
    <ProgressBar
      percentage={progressValue}
      label={progressLabel}
      delay={progressDelay}
      color={progressColor}
    />
  </motion.div>
));

type DashboardStats = {
  users: { total: number; active: number; new: number; inactive: number };
  consultations: { total: number; pending: number; completed: number; revenue: number };
  payments: { pending: number; completed: number; failed: number };
};

type DerivedDashboardStats = {
  consultationSuccessRate?: string | number;
  paymentSuccessRate?: string | number;
  activeUserRate?: string | number;
};

export interface DetailItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  color: string;
}

export interface DetailsGridProps {
  stats: DashboardStats;
  derivedStats: DerivedDashboardStats;
}

function toNumber(value: string | number | undefined): number {
  return typeof value === 'number' ? value : Number.parseFloat(value ?? '0');
}

export const DetailsGrid = memo<DetailsGridProps>(({ stats, derivedStats }) => {
  const usersItems = useMemo<DetailItem[]>(() => [
    { icon: CheckCircle, label: 'Actifs', value: stats.users.active, color: 'green' },
    { icon: TrendingUp, label: 'Nouveaux', value: stats.users.new, color: 'blue' },
    { icon: Clock, label: 'Inactifs', value: stats.users.inactive, color: 'gray' },
  ], [stats.users]);

  const consultationsItems = useMemo<DetailItem[]>(() => [
    { icon: CheckCircle, label: 'Complétées', value: stats.consultations.completed, color: 'green' },
    { icon: DollarSign, label: 'Revenu', value: `${stats.consultations.revenue.toLocaleString()} F`, color: 'amber' },
  ], [stats.consultations]);

  const paymentsItems = useMemo<DetailItem[]>(() => [
    { icon: Clock, label: 'En attente', value: stats.payments.pending, color: 'orange' },
    { icon: CheckCircle, label: 'Réussis', value: stats.payments.completed, color: 'green' },
    { icon: AlertCircle, label: 'Échoués', value: stats.payments.failed, color: 'red' },
  ], [stats.payments]);

  return (
    <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">

      <DetailCard
        title="Utilisateurs"
        icon={Users}
        iconColor="blue"
        items={usersItems}
        progressLabel="Taux d'activation"
        progressValue={toNumber(derivedStats?.activeUserRate)}
        progressColor="blue"
        progressDelay={0}
        linkHref={`/admin/users?r=${Date.now()}`}
      />

      <DetailCard
        title="Jeux"
        icon={FileText}
        iconColor="green"
        items={consultationsItems}
        progressLabel="Taux de complétion"
        progressValue={toNumber(derivedStats?.consultationSuccessRate)}
        progressColor="green"
        progressDelay={0.2}
        linkHref={`/admin/consultations?r=${Date.now()}`}
      />

      <DetailCard
        title="Paiements"
        icon={CreditCard}
        iconColor="blue"
        items={paymentsItems}
        progressLabel="Taux de succès"
        progressValue={toNumber(derivedStats?.paymentSuccessRate)}
        progressColor="blue"
        progressDelay={0.4}
        linkHref={`/admin/payments?r=${Date.now()}`}
      />

    </motion.div>
  );
});

DetailsGrid.displayName = 'DetailsGrid';