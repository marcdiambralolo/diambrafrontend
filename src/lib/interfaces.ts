
import { ConsultationChoiceStatusDto } from './api/services/consultation-status.service';
export enum UserType {
  BASIQUE = 'BASIQUE',
  PREMIUM = 'PREMIUM',
  INTEGRAL = 'INTEGRAL',
} 

export type RubriqueOrNone = Rubrique | null;
type UnknownRecord = Record<string, unknown>;
export type Category = 'animal' | 'vegetal' | 'beverage';
export type StepType = 'selection' | 'form' | 'offering' | 'processing' | 'success' | 'confirm';
export type GenerationStep = 'loading' | 'success' | 'error';
export type SortOrder = "newest" | "oldest" | "amount_high" | "amount_low";
export type OfferingCategory = "animal" | "vegetal" | "beverage";
export type HoroscopeTypeId = 'mensuel' | 'annuel';

export type PractitionerReview = {
    id: string;
    author: string;
    rating: number;
    comment: string;
    createdAt: number;
};

export type ReviewFeedbackTone = "success" | "error";

export type FrequenceConsultation =
  | 'UNE_FOIS_VIE'      // Consultation faite une seule fois dans la vie
  | 'ANNUELLE'          // Peut être faite chaque année
  | 'MENSUELLE'         // Peut être faite chaque mois
  | 'QUOTIDIENNE'       // Peut être faite chaque jour
  | 'LIBRE';            // Peut être faite à tout moment

export type TypeParticipants =
  | 'SOLO'              // Uniquement l'utilisateur
  | 'AVEC_TIERS'        // Utilisateur + une personne tierce
  | 'POUR_TIERS'
  | 'GROUPE';

export interface ConsultationData {
  _id: string;
  title: string;
  description: string;
  alternatives: { offeringId: string; quantity: number }[];
  formData?: UnknownRecord;
  status: string;
}

export interface Book {
  price: number | '' | null;
  pageCount: number | null;
  id?: string;
  _id?: string;
  bookId?: string; // ID unique du livre (ex: 'secrets-ancestraux')
  title: string;
  subtitle?: string;
  description: string;
  pages: number;
  category: string;
  author: string;
  rating?: number;
  coverImage?: string;
  pdfFileName?: string;
  offering: ConsultationOffering;
  isAvailable?: boolean;
  isActive: boolean;
  downloadCount?: number;
  purchaseCount?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  deletedAt?: string | Date;
  offeringAlternatives?: OfferingAlternative[],

  __v?: number;
}

export interface SubjectInfo {
  nom: string;
  prenoms: string;
  dateNaissance: string;
  lieuNaissance: string;
  heureNaissance: string;
}

export interface Position {
  planete?: string;
  astre?: string;
  signe?: string;
  maison?: string | number;
  degre?: number;
  retrograde?: boolean;
}

export interface CarteDuCielBase {
  sujet: SubjectInfo;
  positions: Position[];
  aspectsTexte: string;
}

export interface Sujet {
  nom: string;
  prenoms: string;
  dateNaissance: string;
  lieuNaissance: string;
  heureNaissance: string;
}

export interface MissionDeVie {
  titre: string;
  contenu: string;
}

export interface Section {
  titre: string;
  contenu: string;
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
  illustrationUrl?: string;
}

export type Article = {
  _id: string;
  title: string;
  content: string;
  illustrationUrl?: string;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
};

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
  pdfFileName?: string;
  illustrationUrl?: string;
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
  pdfFileName?: string;
  illustrationUrl?: string;
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
  frequence?: FrequenceConsultation;
  participants?: TypeParticipants;
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
  pdfFile?: string;
  prompt?: string;
  gradeId?: string | GradeConfig;
}

export interface MissionDeVie {
  titre: string;
  contenu: string;
}

export interface Metadata {
  processingTime: number;
  tokensUsed: number;
  model: string;
  cached: boolean;
}

export interface AnalyseData {
  consultationId: string;
  sessionId: string;
  timestamp: string;
  carteDuCiel: CarteDuCielBase;
  missionDeVie: MissionDeVie;
  metadata: Metadata;
  dateGeneration: string;
  _id: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface ConsultationData {
  _id: string;
  title: string;
  description: string;
  alternatives: { offeringId: string; quantity: number }[];
  status: string;
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



export interface Tab {
  id: HoroscopeTypeId;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
}

export interface HoroscopeResult {
  zodiacSign: string;
  symbol: string;
  element: string;
  period: string;
  horoscopeType: string;
  generalForecast: string;
  love: string;
  work: string;
  health: string;
  spiritualAdvice: string;
  luckyColor: string;
  dominantPlanet: string;
}

export interface BackendHoroscope {
  _id: string;
  title: string;
  description: string;
  status: string;
  formData?: {
    carteDuCiel?: {
      carteDuCiel?: {
        positions?: Array<{
          planete: string;
          signe: string;
        }>;
      };
    };
  };
  completedDate?: string;
  createdAt: string;
}

export interface SpiritualitePractice {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  createdAt: string;
  featured?: boolean;
  readTime?: string;
  author?: {
    name: string;
    avatar?: string;
  };
}

export interface ConsultationConfig {
  id: string;
  titre: string;
  description: string;
  frequence: FrequenceConsultation;
  typeParticipants: TypeParticipants;
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
  HOROSCOPE = 'HOROSCOPE',
  NUMEROLOGIE = 'NUMEROLOGIE',
  VIE_PERSONNELLE = 'VIE_PERSONNELLE',
  RELATIONS = 'RELATIONS',
  PROFESSIONNEL = 'PROFESSIONNEL',
  ASTROLOGIE_AFRICAINE = 'ASTROLOGIE_AFRICAINE',
  SPIRITUALITE = 'SPIRITUALITE',
  OFFRANDES = 'OFFRANDES',
  NOMBRES_PERSONNELS = 'NOMBRES_PERSONNELS',
  CYCLES_PERSONNELS = 'CYCLES_PERSONNELS',
  CINQ_ETOILES = 'CINQ_ETOILES',
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

export interface ConsultationUi {
  normalizedStatus: ConsultationStatus | string;
  state: ConsultationUiState;
  statusLabel: string;
  statusTone: ConsultationUiTone;
  helperText: string;
  canView: boolean;
  canDownload: boolean;
  viewLabel: string;
  consultButtonStatus: string;
  isFreeConsultation: boolean;
  effectiveIsPaid: boolean;
  requiresPayment: boolean;
  hasAnalysisArtifacts: boolean;
  isPending: boolean;
  isCompleted: boolean;
}

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
  ui?: ConsultationUi;
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

export interface CarteDuCielData {
  sujet: {
    nom: string;
    prenoms: string;
    dateNaissance: string;
    lieuNaissance: string;
    heureNaissance: string;
  };
  positions: Position[];
  aspectsTexte: string;
}

export interface CarteDuCiel {
  sessionId: string;
  timestamp: string;
  carteDuCiel: Position[];
  positions: Position[];
  aspectsTexte: string;
  metadata: {
    processingTime: number;
    tokensUsed: number;
    model: string;
  };
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
  carteDuCiel?: CarteDuCiel | CarteDuCielBase;
}

export interface CarteDuCielData {
  sujet: {
    nom: string;
    prenoms: string;
    dateNaissance: string;
    lieuNaissance: string;
    heureNaissance: string;
  };
  positions: Position[];
}

export interface CinqPortes {
  signesolaire: {
    label: string;
    valeur: string;
    description: string;
    icon: string;
    gradient: string;
  };
  ascendant: {
    label: string;
    valeur: string;
    description: string;
    icon: string;
    gradient: string;
  };
  signeLunaire: {
    label: string;
    valeur: string;
    description: string;
    icon: string;
    gradient: string;
  };
  milieuDuCiel: {
    label: string;
    valeur: string;
    description: string;
    icon: string;
    gradient: string;
  };
  descendant: {
    label: string;
    valeur: string;
    description: string;
    icon: string;
    gradient: string;
  };
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
  ui?: ConsultationUi;
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

export interface BlogPost {
  _id: string;
  title: string;
  illustrationUrl?: string;
  content: string;
  createdAt?: string;
};



// Données des grades et utilitaires associés
export type GradeKey =
  | 'NEOPHYTE'
  | 'ASPIRANT'
  | 'CONTEMPLATEUR'
  | 'CONSCIENT'
  | 'INTEGRATEUR'
  | 'TRANSMUTANT'
  | 'ALIGNE'
  | 'EVEILLE'
  | 'SAGE'
  | 'MAITRE_DE_SOI';








export const GRADE_LEVEL: Record<GradeKey, number> & { [key: string]: number } = {
  NEOPHYTE: 0,
  ASPIRANT: 1,
  CONTEMPLATEUR: 2,
  CONSCIENT: 3,
  INTEGRATEUR: 4,
  TRANSMUTANT: 5,
  ALIGNE: 6,
  EVEILLE: 7,
  SAGE: 8,
  MAITRE_DE_SOI: 9,
};

export const LEVEL_TO_KEY: Record<number, GradeKey> = Object.fromEntries(
  Object.entries(GRADE_LEVEL).map(([k, v]) => [v, k as GradeKey]),
) as Record<number, GradeKey>;


export type Stage = {
  points: { label: string; text: string }[];
};

export const STAGES: Stage[] = [
  {
    points: [
      { label: 'Découverte', text: 'Vous découvrez le chemin initiatique et ses principes.' },
      { label: 'Intégration', text: 'Vous commencez à intégrer les premiers enseignements.' },
      { label: 'Ouverture', text: 'Votre esprit s’ouvre à de nouvelles perspectives.' },
    ],
  },
  {
    points: [
      { label: 'Pratique', text: 'Vous appliquez les rituels et exercices proposés.' },
      { label: 'Observation', text: 'Vous observez les premiers changements en vous.' },
      { label: 'Partage', text: 'Vous échangez avec la communauté sur vos expériences.' },
    ],
  },
  {
    points: [
      { label: 'Maîtrise', text: 'Vous maîtrisez les bases et progressez vers l’autonomie.' },
      { label: 'Transmission', text: 'Vous commencez à transmettre vos acquis.' },
      { label: 'Élévation', text: 'Votre niveau de conscience s’élève.' },
    ],
  },
  {
    points: [
      { label: 'Sagesse', text: 'Vous incarnez les valeurs du chemin initiatique.' },
      { label: 'Rayonnement', text: 'Votre évolution inspire les autres.' },
      { label: 'Accomplissement', text: 'Vous atteignez un état d’accomplissement personnel.' },
    ],
  },
];
 



export type TierceItem = {
  id: string;
  nom?: string;
  prenoms?: string;
  dateNaissance?: string;
  villeNaissance?: string;
};
