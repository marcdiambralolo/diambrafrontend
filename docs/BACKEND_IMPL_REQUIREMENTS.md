# 🔧 Backend Implementation Requirements - Admin Grades System

**Guide complet d'implémentation backend pour le système de gestion des grades.**

---

## 📋 Sommaire

1. [Vue d'ensemble](#vue-densemble)
2. [Modèle de données](#modèle-de-données)
3. [Endpoints API](#endpoints-api)
4. [Règles métier](#règles-métier)
5. [Initialisation](#initialisation)
6. [Exemples d'implémentation](#exemples-dimplémentation)
7. [Checklist intégration](#checklist-intégration)

---

## Vue d'ensemble

### Contexte fonctionnel

Le système de gestion des grades (`/admin/grades`) permet aux administrateurs de :

1. **Visualiser** les 9 grades fixes du chemin initiatique
2. **Assigner** des choix de consultations à chaque grade
3. **Ordonner** la hiérarchie des grades (via `nextGradeId`)
4. **Enrichir** les descriptions et métadonnées

### Point clé: Multi-rubrique

**Les choix de consultations proviennent de TOUTES les rubriques du projet.**

Un administrateur peut assigner à un grade:
- Des consultations d'astrologie
- Des consultations de tarot  
- Des consultations de voyance
- Des consultations de numérologie
- Des consultations de spiritualité
- Etc... (toutes les rubriques)

Cela crée une relation **many-to-many** flexible entre grades et choix.

---

## Modèle de données

### Interface GradeConfig (TypeScript)

```typescript
interface GradeConfig {
  _id: string;                           // MongoDB ObjectId
  grade: Grade;                          // Enum: ASPIRANT | ... | MAITRE_DE_SOI
  level: number;                         // 1-9 (immuable)
  name: string;                          // "Aspirant", etc (immuable)
  requirements: {
    consultations: number;               // Nombre min de consultations (immuable)
    rituels: number;                     // Nombre min de rituels (immuable)
    livres: number;                      // Nombre min de livres (immuable)
  };
  consultationChoices: Array<{
    choiceId: string;                    // ID du choix (issu d'une rubrique)
    title: string;                       // Ex: "Carte du Ciel Natale"
    description: string;                 // Description du choix
    frequence: FrequenceConsultation;    // UNE_FOIS_VIE | ANNUELLE | ...
    participants: TypeParticipants;      // SOLO | AVEC_TIERS | ...
    order: number;                       // Position d'affichage
    isActive: boolean;                   // Chaînable ou non
  }>;
  nextGradeId: string | null;            // ID du grade suivant (null = dernier)
  description?: string;                  // Description du grade (modifiable)
  createdAt: string;                     // ISO 8601
  updatedAt: string;                     // ISO 8601
}
```

### Schéma MongoDB

```javascript
db.gradeConfigs.insertOne({
  _id: ObjectId("..."),
  grade: "ASPIRANT",                     // Immuable
  level: 1,                              // Immuable (1-9)
  name: "Aspirant",                      // Immuable
  requirements: {
    consultations: 3,                    // Immuable
    rituels: 1,                          // Immuable
    livres: 1                            // Immuable
  },
  consultationChoices: [
    {
      choiceId: "choice123",             // Vient de Rubrique.consultationChoices._id
      title: "Carte du Ciel Natale",
      description: "Analyse ...",
      frequence: "UNE_FOIS_VIE",
      participants: "SOLO",
      order: 1,
      isActive: true
    }
  ],
  nextGradeId: ObjectId("..."),          // Pointer vers grade de level 2+
  description: "Premier grade...",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### Les 9 grades (fixés)

```typescript
enum Grade {
  ASPIRANT = "ASPIRANT",                 // Level 1
  CONTEMPLATEUR = "CONTEMPLATEUR",       // Level 2
  CONSCIENT = "CONSCIENT",               // Level 3
  INTEGRATEUR = "INTEGRATEUR",           // Level 4
  TRANSMUTANT = "TRANSMUTANT",           // Level 5
  ALIGNE = "ALIGNE",                     // Level 6
  EVEILLE = "EVEILLE",                   // Level 7
  SAGE = "SAGE",                         // Level 8
  MAITRE_DE_SOI = "MAITRE_DE_SOI"        // Level 9
}

const GRADE_LEVELS = {
  ASPIRANT: 1,
  CONTEMPLATEUR: 2,
  CONSCIENT: 3,
  INTEGRATEUR: 4,
  TRANSMUTANT: 5,
  ALIGNE: 6,
  EVEILLE: 7,
  SAGE: 8,
  MAITRE_DE_SOI: 9
};
```

---

## Endpoints API

### 1) Lister tous les grades

**GET** `/admin/grades`

**Authentification:** JWT Bearer + `role: ADMIN | SUPER_ADMIN`

**Response 200:**
```json
[
  {
    "_id": "64abc123def456...",
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
        "choiceId": "choice123",
        "title": "Carte du Ciel Natale",
        "description": "Analyse complète",
        "frequence": "UNE_FOIS_VIE",
        "participants": "SOLO",
        "order": 1,
        "isActive": true
      }
    ],
    "nextGradeId": "64abc456ghi789...",
    "description": "Premier grade du chemin initiatique",
    "createdAt": "2025-01-18T10:00:00Z",
    "updatedAt": "2025-01-18T10:00:00Z"
  },
  // ... 8 autres grades
]
```

**Error 401:** Token absent ou expiré
```json
{ "message": "Unauthorized" }
```

**Error 403:** User n'est pas ADMIN
```json
{ "message": "Forbidden - Admin access required" }
```

---

### 2) Récupérer un grade par ID

**GET** `/admin/grades/:id`

**Paramètres:**
- `id` (path) - MongoDB ObjectId du grade

**Response 200:** Même format qu'endpoint 1

**Error 404:** Grade non trouvé
```json
{ "message": "Grade not found" }
```

---

### 3) Lister tous les choix de consultations disponibles

**GET** `/admin/consultation-choices`

**Authentification:** JWT Bearer + `role: ADMIN | SUPER_ADMIN`

**Logique:**
1. Chercher TOUTES les rubriques (`db.rubriques.find()`)
2. Pour chaque rubrique, extraire `consultationChoices[]`
3. Aplatir en une seule liste
4. Enrichir chaque choix avec `rubriqueId` et `rubriqueTitle`
5. Retourner le tableau complet

**Response 200:**
```json
[
  {
    "_id": "choice123",
    "choiceId": "choice123",
    "title": "Carte du Ciel Natale",
    "description": "Analyse complète de votre thème astral",
    "frequence": "UNE_FOIS_VIE",
    "participants": "SOLO",
    "rubriqueId": "rubrique123",
    "rubriqueTitle": "Astrologie"
  },
  {
    "_id": "choice456",
    "choiceId": "choice456",
    "title": "Lecture de Tarot Spécialisée",
    "description": "Tirage profond",
    "frequence": "MENSUELLE",
    "participants": "AVEC_TIERS",
    "rubriqueId": "rubrique456",
    "rubriqueTitle": "Tarot"
  },
  // ... 30-50+ choix en total
]
```

**Note:** La liste peut contenir 30-100+ choix selon le nombre de rubriques et leurs choix.

---

### 4) Mettre à jour un grade

**PATCH** `/admin/grades/:id`

**Authentification:** JWT Bearer + `role: ADMIN | SUPER_ADMIN`

**Payload:**
```json
{
  "consultationChoiceIds": [
    "choice123",
    "choice456",
    "choice789"
  ],
  "nextGradeId": "64abc789...",
  "description": "Description mise à jour du grade"
}
```

**Validation côté backend:**

1. **`consultationChoiceIds` (array de string)**
   - ✅ Chaque ID doit exister dans le pool de choix disponibles
   - ✅ Peut être vide `[]`
   - ❌ Ignorer les IDs invalides (ou retourner erreur 400 selon règle)

2. **`nextGradeId` (string | null)**
   - ✅ Peut être `null` (pour retirer le suivant)
   - ✅ Doit exister si fourni
   - ❌ ERREUR si `level(nextGrade) <= level(currentGrade)`
   - ❌ ERREUR si `nextGradeId === currentGradeId` (pointeur vers soi)
   - ❌ ERREUR si crée une boucle (ex: A→B→C→A)

3. **`description` (string)**
   - ✅ Peut être une chaîne quelconque
   - ✅ Ignoré si absent

**Response 200:**
```json
{
  "_id": "64abc123...",
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
      "choiceId": "choice123",
      "title": "Carte du Ciel Natale",
      "description": "...",
      "frequence": "UNE_FOIS_VIE",
      "participants": "SOLO",
      "order": 1,
      "isActive": true
    },
    // ...
  ],
  "nextGradeId": "64abc789...",
  "description": "Description mise à jour",
  "updatedAt": "2025-01-18T12:30:00Z"
}
```

**Error 400: Invalid choice IDs**
```json
{
  "statusCode": 400,
  "message": "Invalid consultation choice IDs: choice999, choice888"
}
```

**Error 400: Invalid nextGradeId (lower level)**
```json
{
  "statusCode": 400,
  "message": "nextGradeId must have a level > 1"
}
```

**Error 400: Cycle detected**
```json
{
  "statusCode": 400,
  "message": "Cycle detected in grade hierarchy"
}
```

**Error 400: Self-reference**
```json
{
  "statusCode": 400,
  "message": "A grade cannot point to itself"
}
```

**Error 404:**
```json
{
  "statusCode": 404,
  "message": "Grade not found"
}
```

---

### 5) Mettre à jour uniquement le grade suivant

**PATCH** `/admin/grades/:id/next-grade`

**Cas d'usage:** Actions rapides sur le menu déroulant

**Payload:**
```json
{
  "nextGradeId": "64abc789..."
}
```

**Pour retirer le suivant:**
```json
{
  "nextGradeId": null
}
```

**Validation:** Identique à endpoint 4 (pour `nextGradeId`)

**Response 200:**
```json
{
  "_id": "64abc123...",
  "nextGradeId": "64abc789...",
  "updatedAt": "2025-01-18T12:30:00Z"
}
```

---

### 6) Réordonner les choix d'un grade

**PUT** `/admin/grades/:id/reorder-choices`

**Payload:**
```json
{
  "choices": [
    { "choiceId": "choice123", "order": 1 },
    { "choiceId": "choice456", "order": 2 },
    { "choiceId": "choice789", "order": 3 }
  ]
}
```

**Validation:**
- ✅ Tous les choix doivent exister dans le grade
- ✅ Les `order` doivent être consécutifs (1, 2, 3...)

**Response 200:**
```json
{
  "_id": "64abc123...",
  "consultationChoices": [
    { "choiceId": "choice123", "order": 1, ... },
    { "choiceId": "choice456", "order": 2, ... },
    { "choiceId": "choice789", "order": 3, ... }
  ],
  "updatedAt": "2025-01-18T12:30:00Z"
}
```

---

## Règles métier

### Immuabilité

**Ces champs JAMAIS modifiables via l'API:**
- `grade` (ASPIRANT, CONTEMPLATEUR, etc)
- `level` (1-9)
- `name`
- `requirements.consultations`
- `requirements.rituels`
- `requirements.livres`
- `createdAt`

**Ces champs sont modifiables:**
- `consultationChoices[]` (contenu complet)
- `nextGradeId`
- `description`
- `consultationChoices[].order`

### Hiérarchie acyclique

**Règles strictes:**

1. **Pas de self-reference:**
   ```
   ❌ ASPIRANT.nextGradeId = ASPIRANT._id
   ```

2. **Niveaux croissants:**
   ```
   ✅ ASPIRANT(1) → CONTEMPLATEUR(2) → CONSCIENT(3)
   ❌ ASPIRANT(1) → ASPIRANT(1)
   ❌ SAGE(8) → CONTEMPLATEUR(2)
   ```

3. **Pas de cycles:**
   ```
   ✅ A → B → C → null
   ❌ A → B → C → A   (cycle)
   ❌ A → B → C → B   (cycle)
   ```

**Algorithme de détection:**

```typescript
function detectCycle(gradeId: string, nextGradeId: string | null): boolean {
  if (!nextGradeId) return false;
  
  const visited = new Set<string>();
  let current = nextGradeId;
  
  while (current) {
    if (current === gradeId) return true;  // Cycle détecté
    if (visited.has(current)) return true; // Cycle dans la chaîne
    
    visited.add(current);
    const nextGrade = gradeConfigs.find(g => g._id === current);
    current = nextGrade?.nextGradeId ?? null;
  }
  
  return false;
}
```

### Validation des choix

**À chaque mise à jour:**

1. Récupérer TOUTES les rubriques
2. Construire le pool de `choiceIds` valides:
   ```typescript
   const validChoiceIds = new Set<string>();
   for (const rubrique of rubriques) {
     for (const choice of rubrique.consultationChoices) {
       validChoiceIds.add(choice._id);
     }
   }
   ```
3. Vérifier que tous les IDs envoyés sont dans le pool
4. Enrichir la réponse avec les détails de chaque choix

---

## Initialisation

### Seeding automatique

À chaque démarrage de l'application backend:

```typescript
async function seedGradeConfigs() {
  const count = await db.collection('gradeConfigs').countDocuments();
  if (count === 9) return; // Déjà initialisé
  
  const grades = [
    {
      grade: 'ASPIRANT',
      level: 1,
      name: 'Aspirant',
      requirements: { consultations: 3, rituels: 1, livres: 1 },
      consultationChoices: [],
      nextGradeId: null,
      description: 'Premier grade du chemin initiatique'
    },
    // ... 8 autres grades
  ];
  
  await db.collection('gradeConfigs').insertMany(grades);
}
```

### Script de seed manuel

```bash
npm run seed:grades
```

Cela:
- Supprime les gradeConfigs existants (optionnel)
- Crée les 9 grades vierges
- Assigne les prérequis par défaut

### Structure des 9 grades avec prérequis

```typescript
const DEFAULT_GRADES = [
  {
    grade: 'ASPIRANT',
    level: 1,
    name: 'Aspirant',
    requirements: { consultations: 3, rituels: 1, livres: 1 },
  },
  {
    grade: 'CONTEMPLATEUR',
    level: 2,
    name: 'Contemplateur',
    requirements: { consultations: 5, rituels: 2, livres: 2 },
  },
  // ... etc (9 au total)
];
```

---

## Exemples d'implémentation

### Express/NestJS - GET /admin/grades

```typescript
@Get('/grades')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
async getAllGradeConfigs(): Promise<GradeConfig[]> {
  const grades = await this.gradeConfigService.findAll();
  return grades.sort((a, b) => a.level - b.level);
}
```

### GET /admin/consultation-choices (Multi-rubrique)

```typescript
@Get('/consultation-choices')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
async getAvailableConsultationChoices(): Promise<ConsultationChoice[]> {
  // Récupérer toutes les rubriques
  const rubriques = await this.rubriqueService.findAll();
  
  // Aplatir tous les choix
  const allChoices: ConsultationChoice[] = [];
  for (const rubrique of rubriques) {
    if (rubrique.consultationChoices?.length) {
      for (const choice of rubrique.consultationChoices) {
        allChoices.push({
          _id: choice._id,
          choiceId: choice._id,
          title: choice.title,
          description: choice.description,
          frequence: choice.frequence,
          participants: choice.participants,
          rubriqueId: rubrique._id,
          rubriqueTitle: rubrique.title
        });
      }
    }
  }
  
  return allChoices;
}
```

### PATCH /admin/grades/:id (Validation + Update)

```typescript
@Patch('/grades/:id')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
async updateGradeConfig(
  @Param('id') id: string,
  @Body() updateDto: UpdateGradeConfigDto
): Promise<GradeConfig> {
  // 1. Vérifier que le grade existe
  const currentGrade = await this.gradeConfigService.findById(id);
  if (!currentGrade) {
    throw new NotFoundException('Grade not found');
  }

  // 2. Valider les choix si fournis
  if (updateDto.consultationChoiceIds?.length > 0) {
    const validChoiceIds = await this.getValidChoiceIds();
    const invalidIds = updateDto.consultationChoiceIds.filter(
      (id) => !validChoiceIds.has(id)
    );
    if (invalidIds.length > 0) {
      throw new BadRequestException(
        `Invalid consultation choice IDs: ${invalidIds.join(', ')}`
      );
    }
  }

  // 3. Valider le nextGradeId si fourni
  if (updateDto.nextGradeId !== undefined && updateDto.nextGradeId !== null) {
    const nextGrade = await this.gradeConfigService.findById(
      updateDto.nextGradeId
    );
    if (!nextGrade) {
      throw new BadRequestException('nextGradeId does not exist');
    }
    if (nextGrade.level <= currentGrade.level) {
      throw new BadRequestException(
        `nextGradeId must have a level > ${currentGrade.level}`
      );
    }
    if (updateDto.nextGradeId === id) {
      throw new BadRequestException('A grade cannot point to itself');
    }

    // Cycle detection
    if (this.detectCycle(id, updateDto.nextGradeId)) {
      throw new BadRequestException('Cycle detected in grade hierarchy');
    }
  }

  // 4. Enrichir les choix avec les détails
  let enrichedChoices = [];
  if (updateDto.consultationChoiceIds?.length > 0) {
    const allChoices = await this.getAvailableConsultationChoices();
    const choicesMap = new Map(allChoices.map((c) => [c.choiceId, c]));
    enrichedChoices = updateDto.consultationChoiceIds
      .map((id, index) => ({
        ...choicesMap.get(id),
        order: index + 1
      }))
      .filter(Boolean);
  }

  // 5. Mettre à jour
  const updated = await this.gradeConfigService.update(id, {
    ...updateDto,
    consultationChoices: enrichedChoices
  });

  return updated;
}

private detectCycle(gradeId: string, nextGradeId: string): boolean {
  const visited = new Set<string>();
  let current = nextGradeId;

  while (current && current !== null) {
    if (current === gradeId) return true;
    if (visited.has(current)) return true;

    visited.add(current);
    const grade = this.gradeConfigs.find((g) => g._id === current);
    current = grade?.nextGradeId ?? null;
  }

  return false;
}
```

---

## Checklist intégration

### Phase 1: Modèle & Database ✅

- [ ] Créer collection `gradeConfigs` avec index sur `grade` et `level`
- [ ] Créer GradeConfig schema/interface TypeScript
- [ ] Ajouter validations MongoDB (uniques si nécessaire)
- [ ] Tester seed automatique: `npm run seed:grades`
- [ ] Vérifier 9 grades présents dans DB

### Phase 2: Service & Validation ✅

- [ ] Créer `GradeConfigService` avec méthodes CRUD
- [ ] Implémenter `detectCycle()` avec tests
- [ ] Implémenter validation des `consultationChoiceIds`
- [ ] Implémenter validation du `nextGradeId`
- [ ] Créer helper pour récupérer validChoiceIds (multi-rubrique)

### Phase 3: Endpoints API ✅

- [ ] GET `/admin/grades` (list all)
- [ ] GET `/admin/grades/:id` (get one)
- [ ] GET `/admin/consultation-choices` (flatten all from all rubriques)
- [ ] PATCH `/admin/grades/:id` (update full)
- [ ] PATCH `/admin/grades/:id/next-grade` (update hierarchy only)
- [ ] PUT `/admin/grades/:id/reorder-choices` (reorder)

### Phase 4: Guards & Auth ✅

- [ ] Ajouter `@UseGuards(JwtAuthGuard, RoleGuard)` partout
- [ ] Enforcer `@Roles(Role.ADMIN, Role.SUPER_ADMIN)`
- [ ] Tester auth fail (401/403)

### Phase 5: Integration Frontend ✅

- [ ] Tester GET `/admin/grades` (frontend load le hook)
- [ ] Tester PATCH `/admin/grades/:id` (frontend save)
- [ ] Tester GET `/admin/consultation-choices` (load choices)
- [ ] Tester PATCH `/admin/grades/:id/next-grade` (change hierarchy)
- [ ] Vérifier erreurs 400, 404, 403 traitées

### Phase 6: Tests ✅

- [ ] Unit tests: validations (cycle, level, IDs)
- [ ] Integration tests: endpoints (happy path + errors)
- [ ] E2E tests: workflow complet

### Phase 7: Documentation ✅

- [ ] Mettre à jour API docs (Swagger/OpenAPI)
- [ ] Documenter validation rules
- [ ] Ajouter examples de payloads

---

## Notes importantes

### Points clés à retenir

1. **9 grades immuables** - Les prérequis et niveaux ne changent jamais
2. **Multi-rubrique** - `consultationChoices` peut venir de n'importe quelle rubrique
3. **Acyclique** - Impossible de créer de boucles dans la hiérarchie
4. **Enrichissement** - Les IDs envoyés doivent être enrichis avec détails complets
5. **Frontend-ready** - Le service `gradeConfigService` attend les bons formats

### Dépendances critiques

- `RubriqueService` - Pour getter toutes les rubriques et leurs choix
- `JwtAuthGuard` - Pour authentifier les admins
- `RoleGuard` - Pour restricter aux ADMIN/SUPER_ADMIN

### Optimisations futures

- Cacher la liste des `consultationChoiceIds` valides (TTL 1h)
- Indexer sur `grade` et `level` pour recherches rapides
- Ajouter pagination si plus de 100 grades
- Archiver les grades obsolètes (soft delete)

---

**Dernière mise à jour:** 15 février 2026  
**Auteur:** Architecture Team  
**Status:** ✅ Prêt pour implémentation
