import type { LucideIcon } from 'lucide-react';

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'failure'
  | 'no paid'
  | 'already_used'
  | 'error';

export interface StatusConfig {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  gradient: string;
  iconBg: string;
  iconColor: string;
  showDetails: boolean;
}

export interface PaymentSummary {
  amount?: number;
  method?: string;
  reference?: string;
}

export type PaymentKind = 'consultation' | 'book';

export interface PersonalInfo {
  userId?: string;
  consultationId?: string;
  bookId?: string;
  type?: 'consultation' | 'book';
  productType?: string;
  [key: string]: unknown;
}

export interface PaymentData {
  _id?: string;
  tokenPay: string;
  numeroSend: string;
  nomclient: string;
  Montant: number;
  frais: number;
  statut: string;
  createdAt: string;
  personal_Info?: PersonalInfo[];
  [key: string]: unknown;
} 