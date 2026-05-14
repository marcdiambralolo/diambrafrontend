export interface Offering {
  createdAt?: string | Date;
  updatedAt?: string | Date;
  offeringId: string;
  _id?: string;
  id: string;
  name: string;
  price: number;
  category: 'banque';
  description: string;
  quantity: number;
}

export interface OfferingAlternative {
  category: 'banque';
  offeringId: string;
  quantity: number;
  name?: string;
  price?: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  _id?: string;
}

export interface WalletOffering {
  offeringId: string;
  quantity: number;
  name: string;
  category: string;
  price: number;
}

export interface ConsultationOffering {
  price?: number;
  alternatives: OfferingAlternative[];
}

export interface OfferingAlternative {
  category: 'banque';
  offeringId: string;
  quantity: number;
  name?: string;
  price?: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  _id?: string;
}

export interface ConsultationOffering {
  price?: number;
  alternatives: OfferingAlternative[];
}

export interface ConsultationChoice {
  _id?: string;
  title: string;
  description: string;
  offering: ConsultationOffering;
  consultationId: string | null;
  choiceId: string;
  choiceTitle: string;
}

export interface FormErrors {
  [key: string]: string;
}

export interface Rubrique {
  id?: string;
  _id?: string;
  titre?: string;
  description?: string;
  categorie?: string;
  consultationChoices: ConsultationChoice[];
  createdAt?: string;
  updatedAt?: string;
  categorieId?: string;
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
  category: any;
  description?: string;
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
  photo?: string;
  presentation?: string;
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
  createdAt: string | number | Date;
  customPermissions?: Permission[];
  dateOfBirth?: Date;
  address?: string;
  city?: string;
  isActive?: boolean;
  premium?: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  lastLogin?: Date;
  preferences?: {
    language?: string;
    notifications?: boolean;
    newsletter?: boolean;
  };
  specialties?: string[];
  bio?: string;
  rating?: number;
  totalConsultations?: number;
  credits?: number;
  status?: string;
  consultationsCount?: number;
  avatar?: string;
  updatedAt?: string | Date;
  lastGradeUpdate?: Date | string;
  subscriptionStartDate?: Date | string;
  subscriptionEndDate?: Date | string;
  premiumRubriqueId?: string;
  nomconsultant?: string;
  [key: string]: unknown;
}

export interface Consultation {
  _id: string;
  userId: string;
  clientId?: {
    _id: string;
  };
  consultantId?: string;
  rubriqueId: string;
  paymentId?: string;
  isPaid: boolean;
  metadata?: Record<string, unknown>;
  title: string;
  description: string;
  formData?: any;
  result: unknown;
  price: number;
  createdAt: string;
  updatedAt: string;
  clientName?: string;
  ui?: any;
  completedAt?: string;
  [key: string]: unknown;
}

export interface CategorieAdmin {
  _id: string;
  id?: string;
  nom?: string;
  titre?: string;
  description: string;
  rubriques?: Rubrique[];
  consultationChoices?: EnrichedChoice[];
  categorie?: string;
  categorieId?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  CONSULTANT = 'CONSULTANT',
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
export interface EnrichedChoice {
  consultationCount: undefined;
  choice: ConsultationChoice;
}

export type TransactionFilter = "all" | "simulation" | "real";

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