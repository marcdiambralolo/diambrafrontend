export type DateLike = Date | string | number | null | undefined;

export interface Offering {
  createdAt?: string | Date;
  updatedAt?: string | Date;
  offeringId: string;
  _id?: string;
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OfferingAlternative {
  offeringId: string;
  quantity: number;
  name?: string;
  price?: number;
  createdAt?: string;
  updatedAt?: string;
  _id?: string;
}

export interface WalletOffering {
  offeringId: string;
  quantity: number;
  name: string;
  price: number;
}

export interface FormErrors {
  [key: string]: string;
}

export interface Stats {
  totalTransactions: number;
  totalSpent: number;
}

export interface TransactionItem {
  offeringId: OfferingDetails | string;
  quantity?: number;
  price?: number;
  unitPrice?: number;
  totalPrice?: number;
  name?: string;
  category?: any;
}

export interface OfferingDetails {
  _id: string;
  name: string;
  price: number;
}

export interface Payment {
  id: string;
  reference: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  method: string;
  customerName: string;
  customerPhone: string;
  createdAt: string;
  completedAt?: string;
}

export interface User {
  _id?: string;
  nom: string;
  prenoms: string;
  username: string;
  gender: 'male' | 'female';
  country: string;
  phone: string;
  dateNaissance?: Date;
  paysNaissance?: string;
  villeNaissance?: string;
  heureNaissance?: string;
  password?: string;
  role?: Role;
  secretCode?: string;
  createdAt: string | number | Date;
  customPermissions?: Permission[];
  address?: string;
  city?: string;
  isActive?: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  lastLogin?: Date;
  preferences?: {
    language?: string;
    notifications?: boolean;
    newsletter?: boolean;
  };
  rating?: number;
  totalConsultations?: number;
  credits?: number;
  status?: string;
  consultationsCount?: number;
  avatar?: string;
  updatedAt?: string | Date;
  [key: string]: unknown;
}

export interface Consultation {
  _id: string;
  userId: string;
  clientId?: {
    _id: string;
    username: string;
    country: string;
  };
  paymentId?: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  combinaison: string;
  timeSpent: string;
  idjeu: string | GameConfiguration
  [key: string]: unknown;
}

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST'
}

export enum Permission {
  CREATE_USER = 'CREATE_USER',
  READ_USER = 'READ_USER',
  READ_ANY_USER = 'READ_ANY_USER',
  UPDATE_USER = 'UPDATE_USER',
  UPDATE_ANY_USER = 'UPDATE_ANY_USER',
  DELETE_USER = 'DELETE_USER',
  DELETE_ANY_USER = 'DELETE_ANY_USER',
  CREATE_CONSULTATION = 'CREATE_CONSULTATION',
  READ_CONSULTATION = 'READ_CONSULTATION',
  READ_ANY_CONSULTATION = 'READ_ANY_CONSULTATION',
  UPDATE_CONSULTATION = 'UPDATE_CONSULTATION',
  UPDATE_ANY_CONSULTATION = 'UPDATE_ANY_CONSULTATION',
  DELETE_CONSULTATION = 'DELETE_CONSULTATION',
  ASSIGN_CONSULTANT = 'ASSIGN_CONSULTANT',
  COMPLETE_CONSULTATION = 'COMPLETE_CONSULTATION',
  CREATE_SERVICE = 'CREATE_SERVICE',
  READ_SERVICE = 'READ_SERVICE',
  UPDATE_SERVICE = 'UPDATE_SERVICE',
  DELETE_SERVICE = 'DELETE_SERVICE',
  CREATE_PAYMENT = 'CREATE_PAYMENT',
  READ_PAYMENT = 'READ_PAYMENT',
  READ_ANY_PAYMENT = 'READ_ANY_PAYMENT',
  REFUND_PAYMENT = 'REFUND_PAYMENT',
  VIEW_ANALYTICS = 'VIEW_ANALYTICS',
  VIEW_LOGS = 'VIEW_LOGS',
  MANAGE_ROLES = 'MANAGE_ROLES',
  MANAGE_PERMISSIONS = 'MANAGE_PERMISSIONS',
  SYSTEM_CONFIG = 'SYSTEM_CONFIG'
}

export interface Transaction {
  offeringId: any;
  _id: string;
  transactionId: string;
  paymentToken: string;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  completedAt: string;
  items: TransactionItem[];
  createdAt: string;
  updatedAt: string;
  type?: 'purchase' | 'consumption' | 'refund';
  metadata?: Record<string, unknown>;
}

export interface GameConfiguration {
  id?: string;
  _id?: string;
  startgameDate: Date;
  endgameDate: Date;
  isActive: boolean;
  status: 'pending' | 'active' | 'ended' | 'cancelled';
}

export interface LastEndedGame {
  id: string;
  isActive: boolean;
  status: string;
  startgameDate: string;
  endgameDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FormData {
  month?: string;
  year?: string;
  day?: string;
  secretCode: string;
  nom: string;
  prenoms: string;
  dateNaissance: string;
  country: string;
  phone?: string;
  gender?: string;
}