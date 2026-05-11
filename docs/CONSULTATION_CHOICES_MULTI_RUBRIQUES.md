# 🎯 Les Choix de Consultations Multi-Rubriques - Guide Détaillé

**Document technique : Comprendre comment les choix de consultations proviennent de TOUTES les rubriques et s'assignent aux grades.**

---

## Table des Matières

1. [Modèle de Données](#modèle-de-données)
2. [Sources des Choix](#sources-des-choix)
3. [Collection et Agrégation](#collection-et-agrégation)
4. [Assignation aux Grades](#assignation-aux-grades)
5. [Requêtes Backend](#requêtes-backend)
6. [Exemples Pratiques](#exemples-pratiques)
7. [Cas d'Usage](#cas-dusage)

---

## Modèle de Données

### Hiérarchie MongoDB

```
┌─ Collection: rubriques ─────────────────────────────┐
│                                                      │
│ ├─ Document 1: Tarot                                │
│ │  ├─ _id: "507f1f77bcf86cd799439001"              │
│ │  ├─ titre: "Tarot"                                │
│ │  ├─ description: "..."                            │
│ │  └─ consultationChoices: [                         │
│ │      ├─ { choiceId: "choice_tarot_1", ... }      │
│ │      ├─ { choiceId: "choice_tarot_2", ... }      │
│ │      └─ { choiceId: "choice_tarot_3", ... }      │
│ │                                                    │
│ ├─ Document 2: Astrologie                            │
│ │  ├─ _id: "507f1f77bcf86cd799439002"              │
│ │  ├─ titre: "Astrologie"                           │
│ │  └─ consultationChoices: [                         │
│ │      ├─ { choiceId: "choice_astro_1", ... }      │
│ │      ├─ { choiceId: "choice_astro_2", ... }      │
│ │      └─ { choiceId: "choice_astro_3", ... }      │
│ │                                                    │
│ ├─ Document 3: Numerologie                          │
│ │  └─ consultationChoices: [...]                    │
│ │                                                    │
│ └─ ... (autres rubriques)                           │
│                                                      │
└──────────────────────────────────────────────────────┘

┌─ Collection: grades ────────────────────────────────┐
│                                                      │
│ ├─ Document 1: ASPIRANT (Niveau 1)                  │
│ │  ├─ _id: "507f1f77bcf86cd799439011"              │
│ │  ├─ grade: "ASPIRANT"                             │
│ │  ├─ level: 1                                      │
│ │  └─ consultationChoices: [                         │
│ │      ├─ { choiceId: "choice_tarot_1", ... }    ✓ │
│ │      ├─ { choiceId: "choice_astro_1", ... }    ✓ │
│ │      └─ { choiceId: "choice_num_1", ... }      ✓ │
│ │      (Mélange libre de choix de toutes            │
│ │       les rubriques)                              │
│ │                                                    │
│ ├─ Document 2: CONTEMPLATEUR (Niveau 2)             │
│ │  └─ consultationChoices: [                         │
│ │      ├─ { choiceId: "choice_tarot_2", ... }    ✓ │
│ │      ├─ { choiceId: "choice_astro_2", ... }    ✓ │
│ │      └─ { choiceId: "choice_tarot_1", ... }    ✓ │
│ │                                                    │
│ └─ ... (autres grades)                              │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Modèle Conceptuel

```
┌ Rubriques (données fixes du projet) ┐
│                                      │
│  Tarot                               │
│  ├─ Choix A                          │
│  ├─ Choix B                          │
│  └─ Choix C                          │
│                                      │
│  Astrologie                          │
│  ├─ Choix D                          │
│  ├─ Choix E                          │
│  └─ Choix F                          │
│                                      │
│  Numerologie                         │
│  ├─ Choix G                          │
│  └─ Choix H                          │
│                                      │
│  ... (10+ rubriques au total)        │
│                                      │
└──────────────────────────────────────┘
         ↓ (Tous les choix)
┌ Pool Global de Choix ┐
│  A, B, C, D, E, F, G, H, ...        │
│  (30-50+ choix différents)           │
└──────────────────────────────────────┘
         ↓ (Sélection par grade)
┌ Grades (configuration admin) ┐
│                              │
│  ASPIRANT     → [A, D, G]    │
│  CONTEMPL.    → [B, E, H]    │
│  CONSCIENT    → [C, F, A, D] │
│  ...                          │
│                              │
└──────────────────────────────┘
```

---

## Sources des Choix

### 1. Toutes les Rubriques du Projet

Les choix de consultations existent dans **CHAQUE rubrique** de la base de données :

```typescript
// Types
interface Rubrique {
  _id: string;
  titre: string;
  description: string;
  categorie: string;
  typeconsultation: string;
  consultationChoices: ConsultationChoice[];  // ← Ici !
}

// Dans MongoDB
db.rubriques.find().select({ titre: 1, consultationChoices: 1 });

// Résultat
[
  { titre: "Tarot", consultationChoices: [...] },
  { titre: "Astrologie", consultationChoices: [...] },
  { titre: "Numerologie", consultationChoices: [...] },
  { titre: "Horoscope", consultationChoices: [...] },
  { titre: "Cartomancie", consultationChoices: [...] },
  { titre: "Runes", consultationChoices: [...] },
  { titre: "Oracle", consultationChoices: [...] },
  { titre: "Pendule", consultationChoices: [...] },
  { titre: "Cristaux", consultationChoices: [...] },
  { titre: "Astrologie Africaine", consultationChoices: [...] },
  // ... +10 ou plus selon votre projet
]
```

### 2. Caractéristiques de Chaque Choix

```typescript
interface ConsultationChoice {
  _id?: string;
  choiceId: string;                    // ID unique
  title: string;                       // Ex: "Tarot de Vie"
  description: string;                 // Ex: "Consultation pour découvrir..."
  frequence: FrequenceConsultation;    // UNE_FOIS_VIE, ANNUELLE, etc.
  participants: TypeParticipants;      // SOLO, AVEC_TIERS, etc.
  offering: {
    price?: number;                    // 5000 FCFA
    alternatives: [                    // Offrandes alternatives
      {
        category: 'animal' | 'vegetal' | 'beverage',
        offeringId: string,
        quantity: number
      }
    ];
  };
  order?: number;                      // Ordre dans la rubrique
  prompt?: string;                     // Prompt IA
  rubriqueTitle?: string;              // (Optionnel) Titre de la rubrique
  rubriqueId?: string;                 // (Optionnel) ID de la rubrique
}
```

### 3. Nombre Typique

Pour un projet complet :

```
Tarot           → 5 choix
Astrologie      → 4 choix
Numerologie     → 3 choix
Horoscope       → 4 choix
Cartomancie     → 3 choix
Runes           → 2 choix
Oracle          → 3 choix
Pendule         → 2 choix
Cristaux        → 2 choix
Astrologie Afr. → 3 choix
Autres rub.     → 4 choix
────────────────────────
TOTAL          → 35-50 choix
```

**L'endpoint `/admin/consultation-choices` retourne ces 35-50 choix all ensemble pour que l'admin puisse les assigner librement aux 9 grades.**

---

## Collection et Agrégation

### Endpoint Backend: `/admin/consultation-choices`

**Responsabilité** : Retourner TOUS les choix de TOUTES les rubriques.

#### Option 1 : Requête MongoDB Directe

```typescript
// gradeController.ts

@Get('consultation-choices')
@UseGuards(AuthGuard)
async getAllConsultationChoices() {
  // Récupérer toutes les rubriques avec leurs choix
  const rubriques = await this.rubriquesService.find({}, {
    titre: 1,
    _id: 1,
    consultationChoices: 1
  });
  
  // Aplatir la structure pour retourner une liste simple
  const allChoices: ConsultationChoice[] = [];
  
  for (const rubrique of rubriques) {
    for (const choice of rubrique.consultationChoices || []) {
      allChoices.push({
        ...choice,
        // Enrichissement optionnel
        rubriqueTitle: rubrique.titre,
        rubriqueId: rubrique._id
      });
    }
  }
  
  return allChoices;
}
```

#### Option 2 : Requête MongoDB Agrégation

```typescript
// Plus performant pour de grandes collections

async getAllConsultationChoices() {
  const pipeline = [
    // Stage 1 : Garder seulement les champs nécessaires
    {
      $project: {
        titre: 1,
        _id: 1,
        consultationChoices: 1
      }
    },
    // Stage 2 : Décomposer le tableau consultationChoices
    {
      $unwind: '$consultationChoices'
    },
    // Stage 3 : Enrichir les choix
    {
      $project: {
        _id: '$consultationChoices._id',
        choiceId: '$consultationChoices.choiceId',
        title: '$consultationChoices.title',
        description: '$consultationChoices.description',
        frequence: '$consultationChoices.frequence',
        participants: '$consultationChoices.participants',
        offering: '$consultationChoices.offering',
        order: '$consultationChoices.order',
        rubriqueTitle: '$titre',
        rubriqueId: '$_id'
      }
    },
    // Stage 4 : Trier (optionnel)
    {
      $sort: { rubriqueTitle: 1, order: 1 }
    }
  ];
  
  return await this.rubriqueModel.aggregate(pipeline).exec();
}
```

### Résultat Retourné au Frontend

```json
[
  {
    "_id": "choice_000",
    "choiceId": "choice_tarot_1",
    "title": "Tarot de Vie",
    "description": "Découvrez votre livre de vie...",
    "frequence": "UNE_FOIS_VIE",
    "participants": "SOLO",
    "offering": {
      "price": 5000,
      "alternatives": [...]
    },
    "order": 1,
    "rubriqueTitle": "Tarot",
    "rubriqueId": "507f1f77bcf86cd799439001"
  },
  {
    "_id": "choice_001",
    "choiceId": "choice_tarot_2",
    "title": "Tarot Amour",
    "description": "Dévoilez les mystères du cœur...",
    "frequence": "ANNUELLE",
    "participants": "AVEC_TIERS",
    "offering": { ... },
    "order": 2,
    "rubriqueTitle": "Tarot",
    "rubriqueId": "507f1f77bcf86cd799439001"
  },
  {
    "_id": "choice_002",
    "choiceId": "choice_astro_1",
    "title": "Carte du Ciel Natale",
    "description": "Analyse astrologique complète...",
    "frequence": "UNE_FOIS_VIE",
    "participants": "SOLO",
    "offering": { ... },
    "order": 1,
    "rubriqueTitle": "Astrologie",
    "rubriqueId": "507f1f77bcf86cd799439002"
  },
  // ... 32-47 autres choix
]
```

---

## Assignation aux Grades

### Processus d'Assignation

```
┌─ Admin dans /admin/grades ─────────────────┐
│                                             │
│ 1. Affichage GradeCard pour "ASPIRANT"    │
│    - Affiche 9 prérequis (lecture seule)   │
│    - Affiche grade suivant (dropdown)      │
│    - Affiche choix actuels (checkboxes)    │
│                                             │
│ 2. Clic Edit                                │
│    → Mode édition activé                   │
│                                             │
│ 3. Shell Checkboxes (list de tous les      │
│    35-50 choix disponibles)                │
│    ☐ Tarot de Vie          (Tarot)        │
│    ☐ Tarot Amour           (Tarot)        │
│    ☑ Tarot Santé           (Tarot)        │
│    ☐ Carte du Ciel         (Astrologie)   │
│    ☑ Horoscope             (Astrologie)   │
│    ☐ Nombre de Destin      (Numerologie)  │
│    ☐ Runes de Sagesse      (Runes)        │
│    ...                                     │
│                                             │
│ 4. Admin sélectionne/désélectionne         │
│    selectedChoiceIds = ["astro_2", "runes_1", ...]
│                                             │
│ 5. Admin change grade suivant               │
│    selectedNextGradeId = "507f..."         │
│                                             │
│ 6. Clic "Enregistrer"                      │
│                                             │
└─────────────────────────────────────────────┘
           ↓
┌─ Requête API ──────────────────────────────┐
│                                             │
│ PATCH /admin/grades/507f1f77bcf86cd...1   │
│                                             │
│ {                                           │
│   "consultationChoiceIds": [                │
│     "choice_tarot_3",                       │
│     "choice_astro_2",                       │
│     "choice_runes_1"                        │
│   ],                                        │
│   "nextGradeId": "507f1f77bcf86cd...2"    │
│ }                                           │
│                                             │
└─────────────────────────────────────────────┘
           ↓
┌─ Backend MongoDB ──────────────────────────┐
│                                             │
│ db.grades.updateOne(                        │
│   { _id: "507f1f77bcf86cd799439011" },     │
│   {                                         │
│     $set: {                                 │
│       consultationChoices: [                │
│         {                                   │
│           choiceId: "choice_tarot_3",      │
│           title: "Tarot Santé",            │
│           description: "Analyse santé",    │
│           frequence: "ANNUELLE",           │
│           participants: "SOLO",            │
│           order: 1                          │
│         },                                  │
│         {                                   │
│           choiceId: "choice_astro_2",      │
│           title: "Horoscope",              │
│           description: "Horoscope..." ,     │
│           frequence: "ANNUELLE",           │
│           participants: "SOLO",            │
│           order: 2                          │
│         },                                  │
│         {                                   │
│           choiceId: "choice_runes_1",      │
│           title: "Runes de Sagesse",       │
│           description: "Oracle runique",   │
│           frequence: "LIBRE",              │
│           participants: "AVEC_TIERS",      │
│           order: 3                          │
│         }                                   │
│       ],                                    │
│       nextGradeId: "507f1f77bcf86cd799439012",
│       updatedAt: new Date()                │
│     }                                       │
│   }                                         │
│ );                                          │
│                                             │
└─────────────────────────────────────────────┘
           ↓
┌─ Résultat ─────────────────────────────────┐
│                                             │
│ ✓ Grade ASPIRANT mis à jour avec 3 choix  │
│ ✓ Choix peuvent provenir de rubriques      │
│   différentes (mélange libre)              │
│ ✓ Grade suivant défini                     │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Requêtes Backend

### Endpoint 1 : GET /admin/consultation-choices

```typescript
// route: GET /admin/consultation-choices

@Controller('admin')
export class AdminController {
  
  @Get('consultation-choices')
  @UseGuards(AuthGuard('jwt'))
  @UseGuards(RoleGuard('ADMIN'))
  async getAvailableConsultationChoices() {
    try {
      // Récupérer toutes les rubriques
      const rubriques = await this.rubriquesService.find({}, {
        _id: 1,
        titre: 1,
        consultationChoices: 1
      });

      // Aplatir la structure
      const allChoices = [];
      for (const rubrique of rubriques) {
        if (rubrique.consultationChoices && Array.isArray(rubrique.consultationChoices)) {
          for (const choice of rubrique.consultationChoices) {
            allChoices.push({
              ...choice,
              rubriqueTitle: rubrique.titre,
              rubriqueId: rubrique._id
            });
          }
        }
      }

      // Optionnel : Trier par rubrique puis par order
      allChoices.sort((a, b) => {
        if (a.rubriqueTitle !== b.rubriqueTitle) {
          return a.rubriqueTitle.localeCompare(b.rubriqueTitle);
        }
        return (a.order || 0) - (b.order || 0);
      });

      return allChoices;
    } catch (error) {
      throw new HttpException(
        'Erreur lors du chargement des choix',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
```

### Endpoint 2 : PATCH /admin/grades/:id

```typescript
// route: PATCH /admin/grades/:id

@Patch('grades/:id')
@UseGuards(AuthGuard('jwt'))
@UseGuards(RoleGuard('ADMIN'))
async updateGrade(
  @Param('id') id: string,
  @Body() dto: UpdateGradeConfigDto
) {
  try {
    // 1. Vérifier que le grade existe
    const grade = await this.gradeService.findById(id);
    if (!grade) {
      throw new NotFoundException('Grade introuvable');
    }

    // 2. Valider les consultationChoiceIds
    if (dto.consultationChoiceIds) {
      // Récupérer tous les choix disponibles
      const availableChoices = await this.getAllAvailableChoices();
      const availableIds = availableChoices.map(c => c.choiceId);

      // Vérifier que tous les IDs fournis existent
      for (const choiceId of dto.consultationChoiceIds) {
        if (!availableIds.includes(choiceId)) {
          throw new BadRequestException(`Choix introuvable: ${choiceId}`);
        }
      }

      // Enrichir les choix (récupérer les détails complets)
      const enrichedChoices = await this.enrichChoices(dto.consultationChoiceIds);
      grade.consultationChoices = enrichedChoices;
    }

    // 3. Valider nextGradeId (s'il est défini)
    if (dto.nextGradeId) {
      const nextGrade = await this.gradeService.findById(dto.nextGradeId);
      if (!nextGrade) {
        throw new NotFoundException('Grade suivant introuvable');
      }

      // Vérifier que le niveau est supérieur
      if (nextGrade.level <= grade.level) {
        throw new BadRequestException(
          `Le niveau du grade suivant (${nextGrade.level}) doit être supérieur au niveau actuel (${grade.level})`
        );
      }

      // Détecter les cycles
      if (await this.detectCycle(grade._id, nextGrade._id)) {
        throw new BadRequestException('Cycle détecté dans la hiérarchie des grades');
      }

      grade.nextGradeId = dto.nextGradeId;
    } else if (dto.nextGradeId === null) {
      // Permet de définir le grade suivant à null (dernier grade)
      grade.nextGradeId = null;
    }

    // 4. Mettre à jour la description si fournie
    if (dto.description) {
      grade.description = dto.description;
    }

    // 5. Sauvegarder
    grade.updatedAt = new Date();
    const updated = await this.gradeService.save(grade);

    return updated;
  } catch (error) {
    if (error instanceof HttpException) throw error;
    throw new HttpException(
      'Erreur lors de la mise à jour',
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}

// Fonction helper pour enrichir les choix
private async enrichChoices(choiceIds: string[]) {
  const allChoices = await this.getAllAvailableChoices();
  return choiceIds.map(id => {
    const choice = allChoices.find(c => c.choiceId === id);
    if (!choice) throw new NotFoundException(`Choix ${id} introuvable`);
    return {
      choiceId: choice.choiceId,
      title: choice.title,
      description: choice.description,
      frequence: choice.frequence,
      participants: choice.participants,
      offering: choice.offering,
      order: choiceIds.indexOf(id) + 1 // Ordre basé sur position dans le tableau
    };
  });
}

// Fonction helper pour récupérer tous les choix
private async getAllAvailableChoices() {
  // Utiliser le même code que GET /admin/consultation-choices
  // (ou extraire dans une méthode commune)
  const rubriques = await this.rubriquesService.find({}, {
    _id: 1,
    titre: 1,
    consultationChoices: 1
  });

  const allChoices = [];
  for (const rubrique of rubriques) {
    for (const choice of rubrique.consultationChoices || []) {
      allChoices.push({
        ...choice,
        rubriqueTitle: rubrique.titre,
        rubriqueId: rubrique._id
      });
    }
  }
  return allChoices;
}

// Fonction helper pour détecter les cycles
private async detectCycle(gradeId: string, nextGradeId: string, visited = new Set()) {
  if (visited.has(nextGradeId)) {
    return true; // Cycle détecté
  }
  visited.add(nextGradeId);

  const nextGrade = await this.gradeService.findById(nextGradeId);
  if (!nextGrade || !nextGrade.nextGradeId) {
    return false; // Pas de cycle
  }

  return this.detectCycle(gradeId, nextGrade.nextGradeId, visited);
}
```

---

## Exemples Pratiques

### Exemple 1 : Configuration Basique

**Scénario** : Admin configure ASPIRANT avec 3 choix

```json
// Requête
PATCH /admin/grades/aspirant_id
{
  "consultationChoiceIds": [
    "choice_tarot_1",
    "choice_astro_1",
    "choice_num_1"
  ],
  "nextGradeId": "contemplateur_id"
}

// Résultat en BD
{
  "_id": "aspirant_id",
  "grade": "ASPIRANT",
  "level": 1,
  "consultationChoices": [
    {
      "choiceId": "choice_tarot_1",
      "title": "Tarot de Vie",
      "frequence": "UNE_FOIS_VIE",
      "order": 1
    },
    {
      "choiceId": "choice_astro_1",
      "title": "Carte du Ciel",
      "frequence": "ANNUELLE",
      "order": 2
    },
    {
      "choiceId": "choice_num_1",
      "title": "Nombre de Destin",
      "frequence": "UNE_FOIS_VIE",
      "order": 3
    }
  ],
  "nextGradeId": "contemplateur_id"
}
```

### Exemple 2 : Configuration Avancée

**Scénario** : Admin configure SAGE avec choix variés

```json
// Requête
PATCH /admin/grades/sage_id
{
  "consultationChoiceIds": [
    "choice_tarot_3",
    "choice_tarot_4",
    "choice_astro_4",
    "choice_runes_2",
    "choice_oracle_3",
    "choice_cristaux_2"
  ],
  "nextGradeId": "maitre_de_soi_id",
  "description": "Étape 8 - L'accès aux consultations les plus avancées"
}

// Résultat
{
  "_id": "sage_id",
  "consultationChoices": [
    { choiceId: "choice_tarot_3", order: 1 },
    { choiceId: "choice_tarot_4", order: 2 },
    { choiceId: "choice_astro_4", order: 3 },
    { choiceId: "choice_runes_2", order: 4 },
    { choiceId: "choice_oracle_3", order: 5 },
    { choiceId: "choice_cristaux_2", order: 6 }
  ],
  "nextGradeId": "maitre_de_soi_id"
}
```

### Exemple 3 : Dernier Grade (pas de suivant)

**Scénario** : Admin définit MAITRE_DE_SOI comme dernier grade

```json
// Requête
PATCH /admin/grades/maitre_de_soi_id
{
  "consultationChoiceIds": [...],
  "nextGradeId": null
}

// Résultat
{
  "_id": "maitre_de_soi_id",
  "nextGradeId": null  // Pas de grade suivant
}
```

---

## Cas d'Usage

### Cas 1 : Redistribution des Consultations

**Problème** : On veut que les nouveaux utilisateurs (ASPIRANT) aient accès à des consultations "d'essai" simples.

**Solution** :

```json
PATCH /admin/grades/aspirant_id
{
  "consultationChoiceIds": [
    "choice_tarot_1",      // Consultation simple
    "choice_horoscope_1"   // Horoscope basique
  ]
}
```

### Cas 2 : Progression Variée

**Problème** : On veut que chaque grade offre une progression différente (tarot → astrologie → numerologie → etc).

**Solution** : Configurer chaque grade avec un mélange différent :

```
ASPIRANT      → [Tarot basique, Horoscope]
CONTEMPLATEUR → [Tarot avancé, Astrologie africaine]
CONSCIENT     → [Numerologie, Cristaux]
INTEGRATEUR   → [Runes, Oracle]
etc.
```

### Cas 3 : Tous les Choix pour les Maîtres

**Problème** : Le grade final (MAITRE_DE_SOI) devrait avoir accès à TOUTES les consultations.

**Solution** :

```bash
# Récupérer tous les choiceIds
choiceIds = [toutes les 50 consultations]

# Assigner au dernier grade
PATCH /admin/grades/maitre_de_soi_id
{
  "consultationChoiceIds": choiceIds,
  "nextGradeId": null
}
```

### Cas 4 : Réorganisation Hiérarchique

**Problème** : On veut changer l'ordre des grades (Astrologie d'abord, puis Tarot).

**Solution** : Réassigner les nextGradeIds :

```json
// Avant
ASPIRANT → CONTEMPLATEUR → CONSCIENT

// Après
ASPIRANT → CONSCIENT → CONTEMPLATEUR

// Requêtes
PATCH /admin/grades/aspirant_id
{ "nextGradeId": "conscient_id" }

PATCH /admin/grades/conscient_id
{ "nextGradeId": "contemplateur_id" }

PATCH /admin/grades/contemplateur_id
{ "nextGradeId": "integrateur_id" }
```

---

## Résumé Visuel

### Pipeline de Données

```
┌─────────────────────────────────────────────────────┐
│ MongoDB Rubriques                                    │
│   (Tarot, Astrologie, Numerologie, etc.)            │
│   └─ consultationChoices[] (30-50 éléments)        │
└──────────────────────┬──────────────────────────────┘
                       │
                       ↓
┌──────────────────────────────────────────────────────┐
│ Endpoint GET /admin/consultation-choices             │
│   Input: nothing                                     │
│   Process: Récupérer toutes les rubriques et         │
│            aplatir leurs consultationChoices        │
│   Output: Liste simple [{ choiceId, title, ...}]   │
└──────────────────────┬───────────────────────────────┘
                       │
                       ↓
┌──────────────────────────────────────────────────────┐
│ Frontend GradeCard (Mode Édition)                    │
│   Affiche 35-50 checkboxes (1 par choix)            │
│   Admin en sélectionne N pour le grade actuel       │
└──────────────────────┬───────────────────────────────┘
                       │
                       ↓
┌──────────────────────────────────────────────────────┐
│ Endpoint PATCH /admin/grades/:id                     │
│   Input: { consultationChoiceIds: [...], ... }      │
│   Process: Valider les IDs, enrichir, sauvegarder  │
│   Output: Grade mis à jour                         │
└──────────────────────┬───────────────────────────────┘
                       │
                       ↓
┌──────────────────────────────────────────────────────┐
│ MongoDB Grades                                       │
│   grade ASPIRANT                                     │
│   └─ consultationChoices: [3 choix sélectionnés]    │
└──────────────────────────────────────────────────────┘
```

### Flux d'Attribution

```
Admin sélectionne choix
    ↓
selectedChoiceIds = ["choice_X", "choice_Y", "choice_Z"]
    ↓
PATCH /admin/grades/:id avec selectedChoiceIds
    ↓
Backend valide que les choiceIds existent
    ↓
Backend enrichit les choix (récupère titre, description, etc.)
    ↓
Backend crée array GradeConsultationChoice[]
    ↓
Backend sauvegarde dans MongoDB
    ↓
Frontend rafraîchit la liste
    ↓
GradeCard affiche les 3 nouveaux choix
```

---

## Points Clés à Retenir

1. **Pas de Limite** : Un grade peut avoir n'importe quel nombre de choix (0 à 50+)
2. **Mélange Libre** : Un grade peut avoir des choix de plusieurs rubriques différentes
3. **Réutilisation** : Le même choix peut être assigné à plusieurs grades
4. **Dynamique** : Ajouter une nouvelle rubrique = automatiquement disponible pour tous les grades
5. **Ordre** : L'ordre des choix dans un grade détermine l'ordre d'affichage pour l'utilisateur

---

**Dernière mise à jour** : 15 février 2026  
**Auteur** : Système de développement Mon Étoile
