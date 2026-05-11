# Gestion des Grades — Mise à jour Backend

> **Date :** 18 février 2026  
> **Contexte :** Le frontend a été mis à jour pour supprimer les **exigences par rubrique** (`rubriqueRequirements`). Ce document décrit l'état actuel attendu par le frontend et les changements à effectuer côté backend NestJS.

---

## 1. Résumé du changement

**Avant :** Le système de grades reposait sur 3 couches :
1. `requirements` → seuils globaux (consultations, rituels, livres)
2. `rubriqueRequirements` → nombre minimum de consultations PAR RUBRIQUE
3. `consultationChoices` → choix de consultation accessibles par grade

**Maintenant :** Le système repose sur **2 couches uniquement** :
1. `requirements` → seuils globaux (consultations, rituels, livres) — **modifiables depuis l'admin**
2. `consultationChoices` → choix de consultation accessibles par grade

**Supprimé côté frontend :**
- Le composant `RubriqueRequirementsEditor` (UI d'édition des exigences par rubrique)
- Le champ `rubriqueRequirements` dans l'interface `GradeConfig`
- Le champ `rubriqueRequirements` dans le DTO `UpdateGradeConfigDto`
- L'interface `RubriqueForRequirement`
- Les appels API vers `PATCH /admin/grades/:id/rubrique-requirements`
- Les appels API vers `GET /admin/rubriques-for-requirements`
- Le compteur "Rubriques" dans le TopBar de la page admin grades

---

## 2. Endpoints attendus par le frontend

### 2.1 Endpoints admin (protégés `@Roles(Role.ADMIN)`)

| Méthode | Route | Description | Body attendu | Réponse |
|---------|-------|-------------|--------------|---------|
| `GET` | `/admin/grades` | Liste tous les grades, triés par `level` | — | `GradeConfig[]` |
| `GET` | `/admin/grades/enriched` | Grades avec infos enrichies | — | `EnrichedGradeConfig[]` |
| `GET` | `/admin/grades/:id` | Un grade par ID | — | `GradeConfig` |
| `POST` | `/admin/grades` | Créer un grade | `CreateGradeConfigDto` | `GradeConfig` |
| `PATCH` | `/admin/grades/:id` | Mettre à jour un grade | `UpdateGradeConfigDto` | `GradeConfig` |
| `DELETE` | `/admin/grades/:id` | Supprimer un grade | — | `void` |
| `PUT` | `/admin/grades/:id/reorder-choices` | Réordonner les choix | `{ choices: { choiceId, order }[] }` | `GradeConfig` |
| `PATCH` | `/admin/grades/:id/next-grade` | Configurer le grade suivant | `{ nextGradeId: string \| null }` | `GradeConfig` |
| `GET` | `/admin/consultation-choices` | Liste tous les choix de consultation | — | `ConsultationChoice[]` |

### 2.2 Endpoints supprimés (à retirer côté backend)

| Méthode | Route | Raison |
|---------|-------|--------|
| ~~`PATCH`~~ | ~~`/admin/grades/:id/rubrique-requirements`~~ | Plus d'exigences par rubrique |
| ~~`GET`~~ | ~~`/admin/rubriques-for-requirements`~~ | Plus utilisé |

### 2.3 Endpoints utilisateur (inchangés)

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/grades/info` | Infos sur tous les grades |
| `GET` | `/grades/progress` | Progression de l'utilisateur connecté |
| `GET` | `/grades/progress/:userId` | Progression d'un utilisateur (admin) |
| `POST` | `/grades/check/:userId` | Vérifier/mettre à jour le grade |
| `PATCH` | `/grades/increment-consultations` | Incrémenter consultations |
| `PATCH` | `/grades/increment-rituels` | Incrémenter rituels |
| `PATCH` | `/grades/increment-books` | Incrémenter livres |
| `GET` | `/grades/welcome-message` | Message de bienvenue |

---

## 3. Interfaces TypeScript (telles qu'attendues par le frontend)

### 3.1 `GradeConfig` — Le document MongoDB principal

```typescript
interface GradeConfig {
  _id: string;
  grade: Grade;            // Enum: ASPIRANT, CONTEMPLATEUR, ..., MAITRE_DE_SOI
  level: number;           // 1 à 9
  name: string;            // Nom personnalisable
  requirements: {
    consultations: number; // Seuil global consultations
    rituels: number;       // Seuil global rituels
    livres: number;        // Seuil global livres
  };
  consultationChoices: GradeConsultationChoice[];
  nextGradeId: string | null; // ID du grade suivant (null = dernier)
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

> **Important :** Le champ `rubriqueRequirements` n'est plus lu par le frontend. Il peut être conservé en base pour compatibilité mais ne doit plus être envoyé dans les réponses, ou simplement ignoré.

### 3.2 `GradeConsultationChoice`

```typescript
interface GradeConsultationChoice {
  _id?: string;
  choiceId: string;
  title: string;
  description: string;
  frequence: FrequenceConsultation; // 'unique' | 'hebdomadaire' | 'mensuel' | ...
  participants: TypeParticipants;   // 'individuel' | 'couple' | 'famille' | ...
  order?: number;
  isActive?: boolean;
}
```

### 3.3 `UpdateGradeConfigDto` — Body du `PATCH /admin/grades/:id`

```typescript
interface UpdateGradeConfigDto {
  name?: string;
  description?: string;
  consultationChoiceIds?: string[]; // IDs des choix à associer
  nextGradeId?: string | null;
  requirements?: {                  // ← MODIFIABLES depuis l'admin
    consultations?: number;
    rituels?: number;
    livres?: number;
  };
}
```

Ce DTO est le **seul point d'entrée** pour modifier un grade. Le frontend envoie :
- Le nom et la description
- Les IDs des choix de consultation sélectionnés
- Le grade suivant
- Les seuils globaux (`requirements`)

Tout dans un seul appel `PATCH`.

### 3.4 `CreateGradeConfigDto`

```typescript
interface CreateGradeConfigDto {
  grade: Grade;
  consultationChoiceIds: string[];
  nextGradeId?: string | null;
  description?: string;
}
```

### 3.5 Enum `Grade` (9 degrés)

```typescript
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
```

Niveaux : ASPIRANT = 1, CONTEMPLATEUR = 2, ..., MAITRE_DE_SOI = 9

---

## 4. Logique de Progression (côté backend)

### 4.1 Vérification de montée de grade

La montée de grade repose uniquement sur les **seuils globaux**.

Un utilisateur peut passer au grade suivant si **toutes** ces conditions sont remplies :
```
user.consultationsCompleted >= nextGrade.requirements.consultations
user.rituelsCompleted       >= nextGrade.requirements.rituels
user.booksRead              >= nextGrade.requirements.livres
```

> **Il n'y a plus de vérification par rubrique.** Le contrôle `rubriqueRequirements` et l'agrégation MongoDB associée peuvent être retirés de la logique de `checkUserGrade()`.

### 4.2 Seuils par défaut

Valeurs de référence (le frontend les affiche aussi localement) :

| Grade | Niveau | Consultations | Rituels | Livres |
|-------|--------|--------------|---------|--------|
| ASPIRANT | 1 | 3 | 1 | 1 |
| CONTEMPLATEUR | 2 | 6 | 2 | 1 |
| CONSCIENT | 3 | 9 | 3 | 2 |
| INTEGRATEUR | 4 | 13 | 4 | 2 |
| TRANSMUTANT | 5 | 18 | 6 | 3 |
| ALIGNE | 6 | 23 | 8 | 4 |
| EVEILLE | 7 | 28 | 10 | 5 |
| SAGE | 8 | 34 | 10 | 6 |
| MAITRE_DE_SOI | 9 | 40 | 10 | 8 |

Ces seuils sont maintenant **modifiables** depuis l'admin via le champ `requirements` dans `UpdateGradeConfigDto`.

---

## 5. Validations attendues côté backend

### 5.1 `PATCH /admin/grades/:id`

| Champ | Validation |
|-------|-----------|
| `name` | Non vide si fourni |
| `consultationChoiceIds` | Chaque ID doit correspondre à un choix existant |
| `nextGradeId` | Doit exister, avoir un `level` supérieur au grade courant, ne pas créer de cycle |
| `requirements.consultations` | Entier ≥ 0 |
| `requirements.rituels` | Entier ≥ 0 |
| `requirements.livres` | Entier ≥ 0 |

### 5.2 `PATCH /admin/grades/:id/next-grade`

| Champ | Validation |
|-------|-----------|
| `nextGradeId` | `null` (retirer) ou ID d'un grade avec `level` > grade courant, pas de cycle |

### 5.3 Codes d'erreur attendus

| Code | Situation |
|------|----------|
| `400` | Données invalides (IDs choix invalides, nextGradeId invalide, seuils négatifs) |
| `401` | Non authentifié |
| `403` | Non admin |
| `404` | Grade introuvable |

Format d'erreur attendu :
```json
{
  "statusCode": 400,
  "message": "Description lisible de l'erreur"
}
```

---

## 6. Schéma Mongoose à mettre à jour

### Modifications suggérées :

```typescript
// grade-config.schema.ts

@Schema({ timestamps: true })
export class GradeConfig {
  @Prop({ required: true, enum: Grade, unique: true })
  grade: Grade;

  @Prop({ required: true, min: 1, max: 9 })
  level: number;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({
    type: {
      consultations: { type: Number, default: 0, min: 0 },
      rituels: { type: Number, default: 0, min: 0 },
      livres: { type: Number, default: 0, min: 0 },
    },
    required: true,
  })
  requirements: {
    consultations: number;
    rituels: number;
    livres: number;
  };

  // ❌ SUPPRIMÉ : rubriqueRequirements
  // @Prop({ type: [RubriqueRequirementSchema], default: [] })
  // rubriqueRequirements: RubriqueRequirement[];

  @Prop({ type: [GradeConsultationChoiceSchema], default: [] })
  consultationChoices: GradeConsultationChoice[];

  @Prop({ type: Types.ObjectId, ref: 'GradeConfig', default: null })
  nextGradeId: Types.ObjectId | null;
}
```

---

## 7. Résumé des actions backend

### À supprimer :
- [ ] Endpoint `PATCH /admin/grades/:id/rubrique-requirements`
- [ ] Endpoint `GET /admin/rubriques-for-requirements`
- [ ] Schéma `RubriqueRequirementSchema` (ou le conserver sans l'utiliser)
- [ ] Logique de vérification par rubrique dans `checkUserGrade()`
- [ ] Agrégation MongoDB des consultations par rubrique (si elle n'est utilisée que pour les grades)

### À vérifier / adapter :
- [ ] S'assurer que `PATCH /admin/grades/:id` accepte le champ `requirements` (seuils globaux modifiables)
- [ ] S'assurer que la réponse de `GET /admin/grades` retourne bien le format `GradeConfig` décrit ci-dessus
- [ ] S'assurer que `checkUserGrade()` ne vérifie que les seuils globaux (plus de vérification par rubrique)
- [ ] Vérifier que `GET /grades/progress` retourne la progression sans `rubriqueProgress` (optionnel : garder pour info mais pas pour blocage)

### Inchangé :
- Tous les endpoints `/grades/*` (progression utilisateur)
- Endpoint `GET /admin/consultation-choices`
- Endpoint `PUT /admin/grades/:id/reorder-choices`
- Endpoint `PATCH /admin/grades/:id/next-grade`
- Les 9 grades (ASPIRANT → MAITRE_DE_SOI) et leurs niveaux 1-9
