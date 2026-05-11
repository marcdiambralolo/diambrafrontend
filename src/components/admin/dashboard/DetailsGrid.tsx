'use client';
import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, CreditCard, CheckCircle, TrendingUp, Clock, DollarSign, AlertCircle } from 'lucide-react';
import { DetailCard } from './DetailCard';

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
    { icon: Clock, label: 'En attente', value: stats.consultations.pending, color: 'orange' },
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
        title="Consultations"
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