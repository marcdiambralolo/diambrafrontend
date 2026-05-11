import { ConsultationChoiceStatusDto } from './api/services/consultation-status.service';

export enum UserType {
  BASIQUE = 'BASIQUE',
  PREMIUM = 'PREMIUM',
  INTEGRAL = 'INTEGRAL',
}

type UnknownRecord = Record<string, unknown>;
export type Category = 'animal' | 'vegetal' | 'beverage';
export type StepType = 'selection' | 'form' | 'offering' | 'processing' | 'success' | 'confirm';
export type GenerationStep = 'loading' | 'success' | 'error';
export type SortOrder = "newest" | "oldest" | "amount_high" | "amount_low";
export type OfferingCategory = "animal" | "vegetal" | "beverage";

export type PractitionerReview = {
  id: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: number;
};

export type ReviewFeedbackTone = "success" | "error";

export interface ConsultationData {
  _id: string;
  title: string;
  description: string;
  alternatives: { offeringId: string; quantity: number }[];
  formData?: UnknownRecord;
  status: string;
}

export interface Offering {
  createdAt?: string | Date;
  updatedAt?: string | Date;
  offeringId: string;
  visible: boolean;
  _id?: string;
  id: string;
  name: string;
  price: number;
  priceUSD: number;
  category: 'animal' | 'vegetal' | 'beverage';
  description: string;
  quantity: number;
}

export interface OfferingAlternative {
  category: Category;
  offeringId: string;
  quantity: number;
  name?: string;
  price?: number;
  icon?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  _id?: string;
  priceUSD?: number;
}

export interface WalletOffering {
  offeringId: string;
  quantity: number;
  name: string;
  category: string;
  price: number;
  illustrationUrl?: string;
}

export interface ConsultationOffering {
  isFree?: boolean;
  price?: number;
  alternatives: OfferingAlternative[];
}

export interface OfferingAlternative {
  category: 'animal' | 'vegetal' | 'beverage';
  offeringId: string;
  quantity: number;
  name?: string;
  price?: number;
  icon?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  _id?: string;
  priceUSD?: number;
}

export interface ConsultationOffering {
  price?: number;
  alternatives: OfferingAlternative[];
}

export type ButtonStatus = 'CONSULTER' | 'RÉPONSE EN ATTENTE' | "VOIR L'ANALYSE";

import type { GradeConfig } from './types/grade-config.types';

export interface ConsultationChoice {
  _id?: string;
  title: string;
  description: string;
  frequence?: any;
  participants?: any;
  order?: number;
  offering: ConsultationOffering;
  consultationCount?: number;
  buttonStatus: 'CONSULTER' | 'RÉPONSE EN ATTENTE' | "VOIR L'ANALYSE" | "VOIR LA RÉPONSE";
  consultationId: string | null;
  prompt?: string;
  pdfFile?: string | File | null;
  gradeId: string | GradeConfig; // Typé selon la BD
  choiceId: string;
  choiceTitle: string;
  hasActiveConsultation: boolean;
  consultButtonStatus?: ButtonStatus;
  showButtons?: boolean;
}

export interface FormErrors {
  [key: string]: string;
}

export interface FormData {
  nom: string;
  prenoms: string;
  dateNaissance: string;
  paysNaissance: string;
  villeNaissance: string;
  heureNaissance: string;
  country?: string;
  phone?: string;
  gender?: string;
  prompt?: string;
}

export interface Rubrique {
  typeconsultation?: ConsultationType | string;
  id?: string;
  _id?: string;
  titre?: string;
  type?: ConsultationType;
  description?: string;
  categorie?: string;
  consultationChoices: ConsultationChoice[];
  createdAt?: string;
  updatedAt?: string;
  categorieId?: string;
} 
 
export interface ConsultationFormData {
  nom: string;
  prenoms: string;
  genre: string;
  dateNaissance: string;
  paysNaissance: string;
  villeNaissance: string;
  heureNaissance: string;
  numeroSend?: string;
  phone?: string;
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
  category?: OfferingCategory;
  illustrationUrl?: string;
}

export interface OfferingDetails {
  _id: string;
  name: string;
  price: number;
  category: OfferingCategory;
  description?: string;
  illustrationUrl?: string;
}

export interface ConsultationConfig {
  id: string;
  titre: string;
  description: string;
  frequence: any;
  participants: any;
  typeTechnique: string;
  offering: {
    alternatives: Array<{
      category: 'animal' | 'vegetal' | 'beverage';
      offeringId: string;
      quantity: number;
    }>;
  };
  noteImplementation?: string;
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
  domains?: string[];
  methods?: string[];
  experience?: string[];
  poster?: string;
  video?: string;
  aspectsTexte: string;
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
  profilePicture?: string;
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
  // Système de grades initiatiques (compatible backend)
  grade?: GradeConfig | null;
  consultationsCompleted?: number;
  rituelsCompleted?: number;
  booksRead?: number;
  lastGradeUpdate?: Date | string;
  // Système de profils utilisateurs (compatible backend)
  userType?: UserType;
  subscriptionStartDate?: Date | string;
  subscriptionEndDate?: Date | string;
  premiumRubriqueId?: string;
  nomconsultant?: string;
  [key: string]: unknown;

  // Pour Premium
}

export interface SpiritualPractice {
  _id: string;
  slug: string;
  title: string;
  description: string;
  detailedGuide?: string;
  benefits?: string[];
  practicalSteps?: string[];
  category?: string;
  readTime?: number;
  publishedAt?: string;
  author?: string;
  views?: number;
  likes?: number;
  comments?: number;
  featured?: boolean;
  trending?: boolean;
}

export interface SpiritualPractice {
  _id: string;
  slug: string;
  title: string;
  description: string;
  detailedGuide?: string;
  benefits?: string[];
  practicalSteps?: string[];
  category?: string;
  readTime?: number;
  publishedAt?: string;
  author?: string;
  views?: number;
  likes?: number;
  comments?: number;
  featured?: boolean;
  trending?: boolean;
}

export enum ConsultationType {
  AUTRE = 'AUTRE',
}

export enum ConsultationStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  AWAITING_PAYMENT = 'AWAITING_PAYMENT',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  FAILED = 'FAILED',
  ERROR = 'ERROR',
  GENERATING = 'GENERATING',
}

export type ConsultationUiState = 'ready' | 'queued' | 'processing' | 'failed' | 'awaiting_payment';
export type ConsultationUiTone = 'amber' | 'emerald' | 'rose' | 'sky';

 

export interface Consultation {
  _id: string;
  userId: string;
  clientId?: {
    _id: string;
  };
  consultantId?: string;
  rubriqueId: string;
  serviceType: ConsultationType;
  results?: UnknownRecord;
  status: ConsultationStatus;
  scheduledDate?: Date;
  completedDate?: Date;
  paymentId?: string;
  isPaid: boolean;
  /** Indique si l'analyse a été notifiée à l'utilisateur */
  analysisNotified?: boolean;
  rating?: number;
  review?: string;
  metadata?: UnknownRecord;
  type: ConsultationType;
  title: string;
  description: string;
  formData?: ConsultationFormData;
  result: unknown;
  price: number;
  attachments: string[];
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  clientName?: string;
  normalizedStatus?: ConsultationStatus | string;
  ui?: any;
  completedAt?: string;
  pdfFile?: string;
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
  typeconsultation?: string;
  categorieId?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface DoneChoice {
  _id: string;
  userId: string;
  consultationId: string;
  choiceTitle: string;
  choiceId: string | null;
  frequence: string;
  participants: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
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

export interface ProcessedUserData {
  _id?: string;
  name: string;
  birthDate: string;
  prenoms: string;
  nom: string;
  phone: string;
  dateNaissance: string;
  lieuNaissance: string;
  heureNaissance: string;
  country: string;
  role: string;
  premium: boolean;
  credits: number;
  totalConsultations: number;
  rating: number;
}

export interface EnrichedChoice {
  consultationCount: undefined;
  choice: ConsultationChoice;
  status: ConsultationChoiceStatusDto;
}

export interface Analysis {
  _id: string;
  id?: string;
  consultationId?: string;
  __v?: number;
  analysisNotified?: boolean;
  analysisId?: string;
  choiceId?: string;
  clientId?: string;
  clientDisplayName?: string;
  completedDate?: string | null;
  createdAt: string;
  dateGeneration?: string;
  description?: string;
  prompt?: string;
  text?: string;
  status?: string;
  normalizedStatus?: ConsultationStatus | string;
  texte: string;
  title?: string;
  titre?: string;
  type?: string;
  ui?: any;
  updatedAt: string;
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
  illustrationUrl?: string;
  type?: 'purchase' | 'consumption' | 'refund';
  metadata?: UnknownRecord;
}
