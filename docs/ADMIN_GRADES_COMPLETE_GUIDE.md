# 📚 Guide Complet - Gestion des Grades Initiatiques (Admin)

**Document destiné à l'équipe frontend pour l'intégration complète du système de gestion des grades.**

---

## Table des Matières

1. [Vue d'Ensemble](#vue-densemble)
2. [Architecture Globale](#architecture-globale)
3. [Données et Modèles](#données-et-modèles)
4. [Implémentation Frontend](#implémentation-frontend)
5. [Implémentation Backend](#implémentation-backend)
6. [Flux d'Intégrationen Détail](#flux-dintégration-en-détail)
7. [Guide d'Intégration Pas à Pas](#guide-dintégration-pas-à-pas)
8. [Configuration et Endpoints API](#configuration-et-endpoints-api)
9. [Gestion des Choix de Consultations](#gestion-des-choix-de-consultations)
10. [Troubleshooting et Bonnes Pratiques](#troubleshooting-et-bonnes-pratiques)

---

## Vue d'Ensemble

### Qu'est-ce que c'est ?

Le système de gestion des grades permet aux **administrateurs** de :

1. **Consulter** les 9 grades initiatiques (Aspirant → Maître de Soi)
2. **Configurer** les choix de consultations disponibles pour chaque grade
3. **Définir** la hiérarchie (quel grade vient après quel autre)
4. **Gérer** les relations entre grades et consultations

### Pourquoi c'est important ?

- **Progression utilisateur** : Les utilisateurs accèdent à des consultations différentes selon leur grade
- **Cohérence système** : Aligne les 9 grades avec les services réels offerts
- **Gestion simplifiée** : Interface admin facile d'utilisation
- **Flexibilité** : L'admin peut adapter l'offre sans code

### Points Clés

✅ **9 grades fixes** : Définis au niveau application (immuables)  
✅ **Prérequis fixes** : Consultations/rituels/livres requis (définis dans le code)  
✅ **Choix dynamiques** : Chaque grade peut accéder à N'IMPORTE QUEL choix de consultation du projet  
✅ **Hiérarchie flexible** : L'admin redéfinit l'ordre via `nextGradeId`

---

## Architecture Globale

### 1. Composants et Hiérarchie

```
Admin Dashboard (/admin)
    ↓
    └── Grades Management (/admin/grades)
            ↓
            ├── Page Component (AdminGradesPage.tsx)
            │   └── Gère le routing et les composants enfants
            │
            ├── Hook (useAdminGradesPage.ts)
            │   └── Logique métier, fetch data, notifications
            │
            └── Sub-Components
                ├── TopBar.tsx          → Titre, statistiques
                ├── ReloadButtons.tsx   → Rechargement données
                ├── Banner.tsx          → Notifications
                ├── GradesList.tsx      → Liste avec loading
                └── GradeCard.tsx       → Carte individuelle (lecture + édition)
```

### 2. Flux de Données

```
Frontend (Next.js)
    ↓
API Client (lib/api/client.ts - Axios)
    ↓
Endpoints API:
    ├── GET /admin/grades                    → Tous les grades
    ├── GET /admin/consultation-choices      → Tous les choix (de toutes les rubriques)
    ├── PATCH /admin/grades/:id              → Mise à jour complète
    └── PATCH /admin/grades/:id/next-grade   → Mise à jour grade suivant
    ↓
Backend (NestJS)
    ↓
MongoDB
    ├── grades (collection avec config)
    └── rubriques (avec consultationChoices imbriquées)
```

### 3. État Applicatif

```
useAdminGradesPage Hook
├── gradeConfigs[]           → Tous les grades chargés
├── availableChoices[]       → Tous les choix de toutes les rubriques
├── gradesLoading: boolean   → État de chargement
├── choicesLoading: boolean  → État de chargement
├── editingId: string | null → ID du grade en édition
├── banner: BannerState      → Notification actuelle
└── Fonctions de gestion
    ├── fetchGrades()
    ├── fetchAvailableChoices()
    ├── updateGrade(id, data)
    ├── updateNextGrade(gradeId, nextGradeId)
    ├── startEdit(id)
    └── stopEdit()
```

---

## Données et Modèles

### 1. Modèle GradeConfig (API Response)

Le backend retourne cette structure pour chaque grade :

```typescript
interface GradeConfig {
  _id: string;                              // MongoDB ObjectId
  grade: Grade;                             // Enum: ASPIRANT, CONTEMPLATEUR, ...
  level: number;                            // 1-9 (niveau initiatique)
  name: string;                             // "Aspirant", "Contemplateur", etc.
  
  // Prérequis fixes (définis au backend, affichage seulement)
  requirements: {
    consultations: number;                  // Ex: 3
    rituels: number;                        // Ex: 1
    livres: number;                         // Ex: 1
  };
  
  // Choix de consultations associated à ce grade
  consultationChoices: GradeConsultationChoice[];
  
  // Configuration hiérarchie
  nextGradeId: string | null;              // ID du grade suivant (ou null si dernier)
  
  // Métadonnées
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Détail d'un choix de consultation pour ce grade
interface GradeConsultationChoice {
  _id?: string;
  choiceId: string;                        // ID unique du choix
  title: string;                           // Ex: "Tarot de Vie"
  description: string;                     // Ex: "Consultation pour découvrir..."
  frequence: FrequenceConsultation;        // UNE_FOIS_VIE, ANNUELLE, LIBRE, etc.
  participants: TypeParticipants;          // SOLO, AVEC_TIERS, POUR_TIERS, GROUPE
  order?: number;                          // Ordre d'affichage
  isActive?: boolean;                      // Peut être désactivé
}
```

### 2. Modèle ConsultationChoice (API Response - tous les choix disponibles)

Chaque choix provient d'une rubrique spécifique :

```typescript
interface ConsultationChoice {
  _id?: string;                            // ID unique
  choiceId: string;                        // ID de référence
  title: string;                           // Titre
  description: string;                     // Description
  frequence?: FrequenceConsultation;       // Fréquence
  participants?: TypeParticipants;         // Type participants
  offering: ConsultationOffering;          // Prix et offrandes
  order?: number;                          // Ordre
  prompt?: string;                         // Prompt IA associé
  
  // Enrichissement optionnel (peut être ajouté par le backend)
  rubriqueTitle?: string;                  // Titre de la rubrique source
  rubriqueId?: string;                     // ID de la rubrique source
}

interface ConsultationOffering {
  price?: number;                          // Prix en FCFA
  alternatives: OfferingAlternative[];     // Alternatives d'offrandes
}

interface OfferingAlternative {
  category: 'animal' | 'vegetal' | 'beverage';
  offeringId: string;
  quantity: number;
}
```

### 3. Types d'Énums

```typescript
// 9 grades initiatiques
enum Grade {
  ASPIRANT = 'ASPIRANT',
  CONTEMPLATEUR = 'CONTEMPLATEUR',
  CONSCIENT = 'CONSCIENT',
  INTEGRATEUR = 'INTEGRATEUR',
  TRANSMUTANT = 'TRANSMUTANT',
  ALIGNE = 'ALIGNE',
  EVEILLE = 'EVEILLE',
  SAGE = 'SAGE',
  MAITRE_DE_SOI = 'MAITRE_DE_SOI',
}

// Fréquence de consultation
type FrequenceConsultation =
  | 'UNE_FOIS_VIE'
  | 'ANNUELLE'
  | 'SEMESTRIELLE'
  | 'TRIMESTRIELLE'
  | 'MENSUELLE'
  | 'QUOTIDIENNE'
  | 'LIBRE';

// Type de participants
type TypeParticipants =
  | 'SOLO'
  | 'AVEC_TIERS'
  | 'POUR_TIERS'
  | 'GROUPE';
```

### 4. Hiérarchie des Grades

```
ASPIRANT (Niveau 1)
    ↓ nextGradeId
CONTEMPLATEUR (Niveau 2)
    ↓
CONSCIENT (Niveau 3)
    ↓
INTEGRATEUR (Niveau 4)
    ↓
TRANSMUTANT (Niveau 5)
    ↓
ALIGNE (Niveau 6)
    ↓
EVEILLE (Niveau 7)
    ↓
SAGE (Niveau 8)
    ↓
MAITRE_DE_SOI (Niveau 9) → nextGradeId = null (dernier)
```

**Important** : Cette hiérarchie peut être réorganisée par l'admin via `PATCH /admin/grades/:id/next-grade`

---

## Implémentation Frontend

### Fichiers Créés

#### 1. **Types** (`lib/types/grade-config.types.ts`)

```typescript
// Interfaces principales
export interface GradeConfig { ... }
export interface GradeConsultationChoice { ... }
export interface CreateGradeConfigDto { ... }
export interface UpdateGradeConfigDto { ... }
export interface EnrichedGradeConfig { ... }
```

#### 2. **Service API** (`lib/api/services/grade-config.service.ts`)

```typescript
export const gradeConfigService = {
  // Récupère tous les grades
  async getAllGradeConfigs(): Promise<GradeConfig[]>
  
  // Récupère un grade spécifique
  async getGradeConfigById(id: string): Promise<GradeConfig>
  
  // Crée un nouveau grade
  async createGradeConfig(data: CreateGradeConfigDto): Promise<GradeConfig>
  
  // Met à jour complètement un grade
  async updateGradeConfig(id: string, data: UpdateGradeConfigDto): Promise<GradeConfig>
  
  // Supprime un grade
  async deleteGradeConfig(id: string): Promise<void>
  
  // Récupère tous les choix de consultations de TOUTES les rubriques
  async getAvailableConsultationChoices(): Promise<ConsultationChoice[]>
  
  // Réordonne les choix d'un grade
  async reorderGradeChoices(gradeId: string, choices: Array<{choiceId, order}>): Promise<GradeConfig>
  
  // Met à jour le grade suivant
  async updateNextGrade(gradeId: string, nextGradeId: string | null): Promise<GradeConfig>
};
```

#### 3. **Hook** (`hooks/admin/useAdminGradesPage.ts`)

```typescript
export function useAdminGradesPage() {
  // État
  const [gradeConfigs, setGradeConfigs] = useState<GradeConfig[]>([]);
  const [availableChoices, setAvailableChoices] = useState<ConsultationChoice[]>([]);
  const [gradesLoading, setGradesLoading] = useState(true);
  const [choicesLoading, setChoicesLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Fetch & Update
  const fetchGrades = useCallback(async () => { ... }, []);
  const fetchAvailableChoices = useCallback(async () => { ... }, []);
  const updateGrade = useCallback(async (id, data) => { ... }, []);
  const updateNextGrade = useCallback(async (gradeId, nextGradeId) => { ... }, []);
  
  // Édition
  const startEdit = useCallback((id) => { setEditingId(id); }, []);
  const stopEdit = useCallback(() => { setEditingId(null); }, []);
  
  // Retour
  return {
    gradeConfigs, availableChoices, gradesLoading, choicesLoading,
    editingId, banner, fetchGrades, fetchAvailableChoices,
    updateGrade, updateNextGrade, startEdit, stopEdit,
    counts, getGradeName, getNextGradeOptions, ...
  };
}
```

#### 4. **Composants**

##### **AdminGradesPage.tsx** (Page Master)
Page principale qui orchestre tout. Utilise le hook et rend les sous-composants.

```tsx
export default function AdminGradesPage() {
  const { gradeConfigs, banner, editingId, ... } = useAdminGradesPage();
  
  return (
    <div className="max-w-6xl mx-auto">
      <TopBar counts={counts} />
      <ReloadButtons {...} />
      <Banner banner={banner} />
      <GradesList gradeConfigs={gradeConfigs} ... />
    </div>
  );
}
```

##### **GradeCard.tsx** (Carte Individuelle)
Affiche un grade en mode lecture ou édition.

**Mode Lecture** :
```
┌─ Grade Banner (Aspirant - Niveau 1) ──────────┐
├─ Grade suivant: Contemplateur                 │
├─ Prérequis: 3 consultations, 1 rituel, 1 livre│
├─ Choix de consultations (3):                  │
│  ✓ Tarot de Vie                               │
│  ✓ Astrologie Africaine                       │
│  ✓ Numerologie                                │
└─ [Boutton Edit]                               ┘
```

**Mode Édition** :
```
┌─ Grade Banner (même) ──────────────────┐
├─ Grade suivant: [Dropdown] ▼            │
├─ Choix de consultations:                │
│  ☑ Tarot de Vie                         │
│  ☐ Astrologie Africaine                 │
│  ☑ Numerologie                          │
│  ☐ Cartomancie                          │
│  ... (tous les choix de toutes les rubriques)
├─ [Enregistrer] [Annuler]                │
└────────────────────────────────────────┘
```

##### **TopBar.tsx**
Affiche titre et statistiques :
- X grades configurés
- Y choix disponibles
- 9 grades au total

##### **GradesList.tsx**
Boucle sur les grades et rend une GradeCard pour chaque.

##### **ReloadButtons.tsx**
Boutons pour recharger manuellement les données.

##### **Banner.tsx**
Notification temporaire (success/error/info).

#### 5. **Route** (`app/admin/grades/page.tsx`)

```typescript
export default function AdminGradesPageRoute() {
  return <AdminGradesPage />;
}
```

#### 6. **Navigation** (`components/admin/commons/AdminNavConfig.ts`)

```typescript
export const navItems = [
  { href: '/admin/grades', label: 'Grades', icon: Award, color: 'emerald' },
  // ...
];
```

---

## Implémentation Backend

### Endpoints à Implémenter

#### 1. **GET /admin/grades**

Retourne tous les grades avec leur configuration.

```http
GET /admin/grades
Authorization: Bearer {accessToken}
```

**Response (200)**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "grade": "ASPIRANT",
    "level": 1,
    "name": "Aspirant",
    "requirements": {
      "consultations": 3,
      "rituels": 1,
      "livres": 1
    },
    "consultationChoices": [
      {
        "choiceId": "choice_123",
        "title": "Tarot de Vie",
        "description": "Consultation pour découvrir votre destinée...",
        "frequence": "UNE_FOIS_VIE",
        "participants": "SOLO",
        "order": 1
      },
      {
        "choiceId": "choice_456",
        "title": "Astrologie Africaine",
        "description": "Découvrez la sagesse ancestrale...",
        "frequence": "ANNUELLE",
        "participants": "SOLO",
        "order": 2
      }
    ],
    "nextGradeId": "507f1f77bcf86cd799439012",
    "createdAt": "2025-01-18T10:00:00Z",
    "updatedAt": "2025-01-18T10:00:00Z"
  },
  // ... autres grades
]
```

#### 2. **GET /admin/consultation-choices**

Retourne TOUS les choix de consultations de TOUTES les rubriques du projet.

```http
GET /admin/consultation-choices
Authorization: Bearer {accessToken}
```

**Response (200)**
```json
[
  {
    "_id": "choice_123",
    "choiceId": "choice_123",
    "title": "Tarot de Vie",
    "description": "Consultation pour découvrir votre destinée...",
    "frequence": "UNE_FOIS_VIE",
    "participants": "SOLO",
    "offering": {
      "price": 5000,
      "alternatives": [
        {
          "category": "animal",
          "offeringId": "offering_1",
          "quantity": 1
        }
      ]
    },
    "rubriqueTitle": "Tarot",
    "rubriqueId": "507f1f77bcf86cd799439001"
  },
  // ... tous les autres choix de toutes les rubriques
]
```

#### 3. **PATCH /admin/grades/:id**

Met à jour un grade (choix de consultations, description).

```http
PATCH /admin/grades/507f1f77bcf86cd799439011
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "consultationChoiceIds": [
    "choice_123",
    "choice_456",
    "choice_789"
  ],
  "nextGradeId": "507f1f77bcf86cd799439012",
  "description": "Description optionnelle du grade"
}
```

**Response (200)**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "grade": "ASPIRANT",
  "level": 1,
  "name": "Aspirant",
  "requirements": { ... },
  "consultationChoices": [ ... ],
  "nextGradeId": "507f1f77bcf86cd799439012",
  "updatedAt": "2025-02-15T12:00:00Z"
}
```

**Validations Backend Requises** :
- ✅ Vérifier que l'utilisateur a le rôle ADMIN
- ✅ Vérifier que tous les `consultationChoiceIds` existent
- ✅ Si `nextGradeId` est défini :
  - Vérifier que le grade existe
  - Vérifier que `nextGrade.level > currentGrade.level`
  - Détecter les cycles (A→B→A est interdit)

#### 4. **PATCH /admin/grades/:id/next-grade**

Met à jour uniquement le grade suivant.

```http
PATCH /admin/grades/507f1f77bcf86cd799439011/next-grade
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "nextGradeId": "507f1f77bcf86cd799439012"
}
```

**Response (200)**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "nextGradeId": "507f1f77bcf86cd799439012",
  "updatedAt": "2025-02-15T12:00:00Z"
}
```

#### 5. **PUT /admin/grades/:id/reorder-choices** (Optional)

Réordonne les choix d'un grade.

```http
PUT /admin/grades/507f1f77bcf86cd799439011/reorder-choices
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "choices": [
    { "choiceId": "choice_789", "order": 1 },
    { "choiceId": "choice_456", "order": 2 },
    { "choiceId": "choice_123", "order": 3 }
  ]
}
```

---

## Flux d'Intégration en Détail

### 1. Chargement Initial

**Quand** : Page `/admin/grades` se charge  
**Qui** : `useAdminGradesPage` hook dans `useEffect`

```
Frontend → GET /admin/grades
            ↓
          Backend récupère tous les GradeConfigs
            ↓
          Frontend state `gradeConfigs` = réponse
            ↓
Frontend → GET /admin/consultation-choices
            ↓
          Backend récupère tous les choix de TOUTES les rubriques
            ↓
          Frontend state `availableChoices` = réponse
            ↓
Rendu de GradeCard pour chaque grade
```

### 2. Édition d'un Grade

**Quand** : Admin clique sur Edit d'une GradeCard (ou any grade)  
**Qui** : GradeCard component

```
┌─ Frontend ─────────────────────────────────────────┐
│                                                     │
│ 1. Afficher mode édition (editingId = grade._id)   │
│    - Checkboxes pour choix                         │
│    - Dropdown pour grade suivant                   │
│                                                     │
│ 2. Admin sélectionne/désélectionne choix           │
│    selectedChoiceIds = [...]                       │
│                                                     │
│ 3. Admin change le grade suivant                   │
│    selectedNextGradeId = "507f..."                 │
│                                                     │
│ 4. Admin clique "Enregistrer" (Save button)        │
│    - Validation côté frontend:                     │
│      * nextGradeId.level > currentGrade.level     │
│                                                     │
│ 5. PATCH /admin/grades/:id                         │
│    {                                               │
│      consultationChoiceIds: [...],                 │
│      nextGradeId: "507f..."                       │
│    }                                               │
│                                                     │
└─────────────────────────────────────────────────────┘
                    ↓
┌─ Backend ──────────────────────────────────────────┐
│                                                     │
│ 6. Vérifier rôle ADMIN                             │
│ 7. Vérifier existence de tous les choiceIds        │
│ 8. Vérifier nextGradeId (niveau supérieur)        │
│ 9. Détecter cycle (A→B→C→A = KO)                  │
│ 10. Mise à jour MongoDB                            │
│ 11. Retourner le grade mis à jour                  │
│                                                     │
└─────────────────────────────────────────────────────┘
                    ↓
┌─ Frontend ─────────────────────────────────────────┐
│                                                     │
│ 12. Banner success "Grade mis à jour."             │
│ 13. RE-FETCH GET /admin/grades (rafraîchir)       │
│ 14. Retour mode lecture                            │
│ 15. editingId = null                               │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 3. Erreur lors de la Mise à Jour

```
Frontend → PATCH /admin/grades/:id
             ↓
Backend → Erreur (ex: nextGradeId invalide)
             ↓
Frontend ← Error response (400/422)
             ↓
Afficher Banner error
Garder le mode édition (ne pas retour en lecture)
Permettre à l'admin de corriger et réessayer
```

### 4. Rechargement Manuel

```
Admin clique "Recharger les grades"
             ↓
GET /admin/grades
             ↓
Mise à jour state gradeConfigs
             ↓
Retour à la liste
```

---

## Guide d'Intégration Pas à Pas

### Étape 1 : Configuration du Backend

**Créer la collection MongoDB `grades`** :

```javascript
db.grades.insertMany([
  {
    grade: "ASPIRANT",
    level: 1,
    name: "Aspirant",
    requirements: { consultations: 3, rituels: 1, livres: 1 },
    consultationChoices: [],  // Vide initialement
    nextGradeId: null,        // Sera défini plus tard
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // ... 8 autres grades
]);
```

**Implémenter les endpoints** :

```typescript
// grade.controller.ts
@Get('grades')
@UseGuards(AuthGuard)
async getAllGrades() {
  return this.gradeService.findAll();
}

@Get('consultation-choices')
@UseGuards(AuthGuard)
async getChoices() {
  // Récupérer TOUS les choix de TOUTES les rubriques
  const rubriques = await this.rubriqueService.findAll();
  const allChoices = rubriques.flatMap(r => r.consultationChoices);
  return allChoices;
}

@Patch('grades/:id')
@UseGuards(RoleGuard('ADMIN'))
async updateGrade(@Param('id') id: string, @Body() dto: UpdateGradeConfigDto) {
  // Validations...
  return this.gradeService.update(id, dto);
}

// ...
```

### Étape 2 : Configuration Route Next.js

✅ Déjà fait : `/app/admin/grades/page.tsx`

### Étape 3 : Import des Types

Dans vos composants :

```typescript
import { GradeConfig, GradeConsultationChoice } from '@/lib/types/grade-config.types';
import { ConsultationChoice } from '@/lib/interfaces';
```

### Étape 4 : Utilisation du Hook

Dans vos composants :

```typescript
'use client';

import { useAdminGradesPage } from '@/hooks/admin/useAdminGradesPage';

export default function MyComponent() {
  const {
    gradeConfigs,
    availableChoices,
    gradesLoading,
    banner,
    updateGrade,
    ...
  } = useAdminGradesPage();
  
  // Utiliser les données et fonctions
}
```

### Étape 5 : Tests

```bash
# Build
npm run build

# Dev
npm run dev

# Accédez à http://localhost:3000/admin/grades
```

---

## Configuration et Endpoints API

### Base URL

```
Development : http://localhost:3001
Production  : https://api.mon-etoile.org
```

### Authentification

Tous les endpoints requièrent un JWT dans l'en-tête :

```
Authorization: Bearer {accessToken}
```

### Codes de Réponse

```
200 OK            → Succès
201 Created       → Ressource créée
400 Bad Request   → Données invalides
401 Unauthorized  → Token manquant/invalide
403 Forbidden     → Rôle insuffisant (pas ADMIN)
404 Not Found     → Ressource inexistante
422 Unprocessable Entity → Validation échouée
500 Server Error  → Erreur serveur
```

### Rate Limiting

Aucun limiter appliqué pour l'interface admin (comportement normal).

---

## Gestion des Choix de Consultations

### Point Important : Tous les Choix de Toutes les Rubriques

**L'endpoint `GET /admin/consultation-choices` retourne TOUS les choix de consultations du projet**, peu importe la rubrique d'origin.

### Structure Rubriques → Choix

```
Rubriques (Collection MongoDB)
├── Tarot
│   └── consultationChoices[]
│       ├── Tarot de Vie
│       ├── Tarot Amour
│       └── Tarot Santé
├── Astrologie
│   └── consultationChoices[]
│       ├── Carte du Ciel
│       ├── Horoscope
│       └── Astrologie Africaine
├── Numerologie
│   └── consultationChoices[]
│       ├── Nombre de Destin
│       ├── Path de Vie
│       └── Nombre d'Expression
└── ... autres rubriques
```

### Transformation en Liste Plate

L'endpoint `/admin/consultation-choices` **récupère tous les choix et les retourne en liste plate** :

```json
[
  { choiceId: "tarot_1", title: "Tarot de Vie", rubriqueTitle: "Tarot", ... },
  { choiceId: "tarot_2", title: "Tarot Amour", rubriqueTitle: "Tarot", ... },
  { choiceId: "astrologie_1", title: "Carte du Ciel", rubriqueTitle: "Astrologie", ... },
  // ... tous les autres
]
```

### Sélection dans GradeCard

L'admin peut sélectionner n'importe quel choix pour n'importe quel grade :

```
Grade ASPIRANT peut avoir :
  ✓ Tarot de Vie (rubrique Tarot)
  ✓ Carte du Ciel (rubrique Astrologie)
  ✓ Nombre de Destin (rubrique Numerologie)
  (Mélange libre de consultations)
```

### Enrichissement

Optionnellement, le backend peut enrichir chaque choix avec :

```typescript
interface ConsultationChoiceEnriched extends ConsultationChoice {
  rubriqueTitle?: string;      // Titre de la rubrique source
  rubriqueId?: string;         // ID de la rubrique
  rubriqueCategorie?: string;  // Catégorie 
}
```

Cela permet de **grouper ou filtrer par rubrique** dans l'UI si souhaité.

---

## Troubleshooting et Bonnes Pratiques

### Problèmes Courants

#### 1. "Les choix ne se chargent pas"

**Cause** : Endpoint `/admin/consultation-choices` ne retourne rien

**Vérifications** :
- ✅ Backend implémente l'endpoint
- ✅ Les rubriques ont des `consultationChoices`
- ✅ L'utilisateur est authentifié (token valide)
- ✅ L'utilisateur a le rôle ADMIN

**Debug** :
```typescript
// Dans le hook
const fetchAvailableChoices = useCallback(async () => {
  try {
    const data = await gradeConfigService.getAvailableConsultationChoices();
    console.log('Choix chargés:', data);
    setAvailableChoices(data);
  } catch (err) {
    console.error('Erreur choix:', err);
  }
}, []);
```

#### 2. "Impossible de changer le grade suivant"

**Cause** : Backend rejette le `nextGradeId`

**Vérifications** :
- ✅ Le grade de destination existe
- ✅ `nextGrade.level > currentGrade.level`
- ✅ Pas de cycle (A→B→C→A)

**Debug** :
```typescript
const updateNextGrade = useCallback(async (gradeId, nextGradeId) => {
  try {
    await gradeConfigService.updateNextGrade(gradeId, nextGradeId);
    console.log('✓ Grade suivant mis à jour');
  } catch (err: any) {
    console.error('✗ Erreur:', err.response?.data?.message);
  }
}, []);
```

#### 3. "Banner n'apparaît pas"

**Cause** : Timeout auto (2.2s)

**Vérifications** :
- ✅ Banner reçoit `banner` prop correctement
- ✅ Banner.useState effacé automatiquement
- ✅ showBanner() appelé correctement

**Solution** : Augmenter le timeout dans le hook si nécessaire.

### Bonnes Pratiques

#### 1. **Validation côté Frontend**

Avant d'appeler l'API, valider :

```typescript
const validateUpdate = (nextGradeId: string | null, currentLevel: number) => {
  if (!nextGradeId) return true; // OK (dernier grade)
  
  const nextGrade = gradesById.get(nextGradeId);
  if (!nextGrade) {
    showBanner({ type: 'error', message: 'Grade suivant introuvable' });
    return false;
  }
  
  if (nextGrade.level <= currentLevel) {
    showBanner({ type: 'error', message: 'Le niveau doit être supérieur' });
    return false;
  }
  
  return true;
};
```

#### 2. **Affichage des Prérequis**

Les prérequis sont **lus seulement**, ne jamais permettre la modification :

```typescript
// ✅ BON
<p className="text-sm text-slate-500">
  {grade.requirements.consultations} consultations · 
  {grade.requirements.rituels} rituels · 
  {grade.requirements.livres} livres
</p>

// ❌ MAUVAIS (ne pas faire)
<input type="number" value={grade.requirements.consultations} onChange={...} />
```

#### 3. **Gestion d'Erreur Robuste**

```typescript
try {
  await updateGrade(id, data);
  showBanner({ type: 'success', message: 'Mise à jour réussie' });
  setEditingId(null);
  await fetchGrades();
} catch (err: any) {
  const message = err.response?.data?.message || 
                  err.message || 
                  'Erreur inconnue';
  showBanner({ type: 'error', message });
  // Laisser le mode édition actif pour correction
}
```

#### 4. **Optimisation Performance**

```typescript
// ✅ Utiliser useMemo pour dérivés
const gradesById = useMemo(() => {
  const map = new Map<string, GradeConfig>();
  gradeConfigs.forEach(g => map.set(g._id, g));
  return map;
}, [gradeConfigs]);

// ❌ NE PAS recalculer à chaque rendu
const findGradeById = (id: string) => {
  return gradeConfigs.find(g => g._id === id);
};
```

#### 5. **Tri et Filtrage**

```typescript
// Toujours trier les grades par niveau
const sortedGrades = useMemo(() => {
  return [...gradeConfigs].sort((a, b) => a.level - b.level);
}, [gradeConfigs]);
```

### Checklist de Déploiement

- [ ] Backend endpoints implémentés et testés
- [ ] MongoDB collection `grades` initialisée
- [ ] Frontend build sans erreurs TypeScript
- [ ] Tests en local (`http://localhost:3000/admin/grades`)
- [ ] Vérifier les 9 grades s'affichent
- [ ] Tester édition d'un grade
- [ ] Tester ajout/suppression choix
- [ ] Tester changement grade suivant
- [ ] Vérifier notifications (success/error)
- [ ] Tester rechargement manuel
- [ ] Dark mode fonctionne bien
- [ ] Responsive mobile OK
- [ ] Logs backend clean (pas d'erreur)
- [ ] Redirection admin-only fonctionne

---

## Résumé Visuel

### Arborescence Fichiers

```
Plan-Cosmique/
├── lib/
│   ├── types/
│   │   └── grade-config.types.ts      ← Types/Interfaces
│   └── api/
│       └── services/
│           └── grade-config.service.ts ← Appels API
├── hooks/
│   └── admin/
│       └── useAdminGradesPage.ts       ← Logique métier
├── components/
│   └── admin/
│       └── grades/
│           ├── AdminGradesPage.tsx     ← Page master
│           ├── GradesList.tsx          ← Boucle liste
│           ├── GradeCard.tsx           ← Carte individuelle
│           ├── TopBar.tsx              ← Statistiques
│           ├── ReloadButtons.tsx       ← Rechargement
│           ├── Banner.tsx              ← Notifications
│           └── README.md               ← Doc locale
├── app/
│   └── admin/
│       └── grades/
│           └── page.tsx                ← Route
└── docs/
    ├── ADMIN_GRADES_COMPLETE_GUIDE.md  ← This file
    └── ...
```

### Flux Résumé

```
Used accède /admin/grades
    ↓
useAdminGradesPage() hook s'initialise
    ├→ GET /admin/grades              (charges gradeConfigs)
    └→ GET /admin/consultation-choices (charge availableChoices)
    ↓
Affichage 9 GradeCards
    ↓
Admin clique Edit sur un Grade
    ├→ Affichage checkboxes (todos les choix)
    ├→ Dropdown pour grade suivant
    └→ Boutons Enregistrer/Annuler
    ↓
Admin sélectionne choix + grade suivant
    ↓
Admin clique Enregistrer
    ├→ Validation frontend
    └→ PATCH /admin/grades/:id
    ↓
Backend valide et sauve
    ↓
Frontend re-fetch GET /admin/grades
    ↓
Affichage success + retour lecture
```

---

## Contact & Support

Pour toute question ou clarification :
- 📧 Contactez votre lead technique
- 📋 Consultez les docs backend
- 🧪 Vérifiez les tests d'API (Postman/Insomnia)

---

**Dernière mise à jour** : 15 février 2026  
**Version Frontend** : 1.0  
**Statut** : ✅ Prêt pour l'intégration backend
