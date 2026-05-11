# Backend Implementation Guide - Admin Grades Management

## Vue d'Ensemble

Ce guide décrit l'implémentation backend requise pour supporter la gestion des grades initiatiques via l'interface admin `/admin/grades`.

## Modèle de Données

### Schema MongoDB - GradeConfig

```typescript
import { Schema, model } from 'mongoose';

const GradeConsultationChoiceSchema = new Schema({
  choiceId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  frequence: { 
    type: String, 
    enum: ['UNE_FOIS_VIE', 'ANNUELLE', 'MENSUELLE', 'QUOTIDIENNE', 'LIBRE'],
    required: true 
  },
  participants: { 
    type: String, 
    enum: ['SOLO', 'AVEC_TIERS', 'POUR_TIERS', 'GROUPE'],
    required: true 
  },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
});

const GradeConfigSchema = new Schema({
  grade: { 
    type: String, 
    enum: [
      'ASPIRANT', 'CONTEMPLATEUR', 'CONSCIENT', 'INTEGRATEUR', 
      'TRANSMUTANT', 'ALIGNE', 'EVEILLE', 'SAGE', 'MAITRE_DE_SOI'
    ],
    required: true,
    unique: true
  },
  level: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 9,
    unique: true
  },
  name: { type: String, required: true },
  requirements: {
    consultations: { type: Number, required: true },
    rituels: { type: Number, required: true },
    livres: { type: Number, required: true }
  },
  consultationChoices: [GradeConsultationChoiceSchema],
  nextGradeId: { 
    type: Schema.Types.ObjectId, 
    ref: 'GradeConfig',
    default: null
  },
  description: { type: String },
}, { timestamps: true });

export const GradeConfig = model('GradeConfig', GradeConfigSchema);
```

## Endpoints API

### 1. GET `/admin/grades`

**Description:** Récupère tous les grades configurés, triés par niveau.

**Authentification:** Requise (Admin uniquement)

**Response:**
```json
[
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
        "title": "Consultation initiatique",
        "description": "Première consultation pour débutants",
        "frequence": "UNE_FOIS_VIE",
        "participants": "SOLO",
        "order": 1,
        "isActive": true
      }
    ],
    "nextGradeId": "64abc456...",
    "description": "Premier grade du chemin initiatique",
    "createdAt": "2025-01-18T10:00:00Z",
    "updatedAt": "2025-01-18T10:00:00Z"
  }
]
```

**Implémentation:**
```typescript
async getAllGradeConfigs(user: User) {
  // Vérifier que l'utilisateur est admin
  if (!user.roles.includes('ADMIN')) {
    throw new UnauthorizedException('Accès réservé aux administrateurs');
  }

  // Récupérer tous les grades triés par niveau
  const grades = await GradeConfig.find().sort({ level: 1 }).exec();
  
  return grades;
}
```

---

### 2. GET `/admin/grades/:id`

**Description:** Récupère un grade spécifique par son ID.

**Authentification:** Requise (Admin uniquement)

**Response:**
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
  "consultationChoices": [...],
  "nextGradeId": "64abc456...",
  "createdAt": "2025-01-18T10:00:00Z",
  "updatedAt": "2025-01-18T10:00:00Z"
}
```

**Implémentation:**
```typescript
async getGradeConfigById(id: string, user: User) {
  if (!user.roles.includes('ADMIN')) {
    throw new UnauthorizedException();
  }

  const grade = await GradeConfig.findById(id).exec();
  
  if (!grade) {
    throw new NotFoundException(`Grade ${id} introuvable`);
  }
  
  return grade;
}
```

---

### 3. GET `/admin/consultation-choices`

**Description:** Récupère tous les choix de consultations disponibles pour associer aux grades.

**Authentification:** Requise (Admin uniquement)

**Response:**
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
  }
]
```

**Implémentation:**
```typescript
async getAvailableConsultationChoices(user: User) {
  if (!user.roles.includes('ADMIN')) {
    throw new UnauthorizedException();
  }

  // Récupérer toutes les rubriques avec leurs choix
  const rubriques = await Rubrique.find({ isActive: true })
    .populate('consultationChoices')
    .exec();

  // Extraire tous les choix de consultations de toutes les rubriques
  const allChoices = [];
  
  for (const rubrique of rubriques) {
    for (const choice of rubrique.consultationChoices || []) {
      allChoices.push({
        _id: choice._id,
        choiceId: choice.choiceId,
        title: choice.title,
        description: choice.description,
        frequence: choice.frequence,
        participants: choice.participants,
        rubriqueId: rubrique._id,
        rubriqueTitle: rubrique.titre
      });
    }
  }

  return allChoices;
}
```

---

### 4. PATCH `/admin/grades/:id`

**Description:** Met à jour la configuration d'un grade (choix de consultations et/ou grade suivant).

**Authentification:** Requise (Admin uniquement)

**Request Body:**
```json
{
  "consultationChoiceIds": ["choice123", "choice456"],
  "nextGradeId": "64abc789...",
  "description": "Description mise à jour"
}
```

**Response:**
```json
{
  "_id": "64abc123...",
  "grade": "ASPIRANT",
  "consultationChoices": [...],
  "nextGradeId": "64abc789...",
  "updatedAt": "2025-01-18T12:00:00Z"
}
```

**Implémentation:**
```typescript
async updateGradeConfig(
  id: string, 
  updateDto: UpdateGradeConfigDto, 
  user: User
) {
  if (!user.roles.includes('ADMIN')) {
    throw new UnauthorizedException();
  }

  const grade = await GradeConfig.findById(id).exec();
  if (!grade) {
    throw new NotFoundException(`Grade ${id} introuvable`);
  }

  // Validation du nextGradeId
  if (updateDto.nextGradeId) {
    const nextGrade = await GradeConfig.findById(updateDto.nextGradeId).exec();
    if (!nextGrade) {
      throw new BadRequestException('Grade suivant introuvable');
    }
    if (nextGrade.level <= grade.level) {
      throw new BadRequestException(
        'Le grade suivant doit être de niveau supérieur'
      );
    }
  }

  // Mise à jour des choix de consultations
  if (updateDto.consultationChoiceIds) {
    // Récupérer les informations complètes des choix
    const choices = [];
    for (const choiceId of updateDto.consultationChoiceIds) {
      // Rechercher le choix dans les rubriques
      const rubrique = await Rubrique.findOne({
        'consultationChoices.choiceId': choiceId
      }).exec();
      
      if (rubrique) {
        const choice = rubrique.consultationChoices.find(
          c => c.choiceId === choiceId
        );
        if (choice) {
          choices.push({
            choiceId: choice.choiceId,
            title: choice.title,
            description: choice.description,
            frequence: choice.frequence,
            participants: choice.participants,
            order: choices.length + 1
          });
        }
      }
    }
    grade.consultationChoices = choices;
  }

  // Mise à jour du grade suivant
  if (updateDto.nextGradeId !== undefined) {
    grade.nextGradeId = updateDto.nextGradeId;
  }

  // Mise à jour de la description
  if (updateDto.description !== undefined) {
    grade.description = updateDto.description;
  }

  await grade.save();
  
  return grade;
}
```

---

### 5. PATCH `/admin/grades/:id/next-grade`

**Description:** Met à jour uniquement le grade suivant.

**Authentification:** Requise (Admin uniquement)

**Request Body:**
```json
{
  "nextGradeId": "64abc789..."
}
```

**Response:**
```json
{
  "_id": "64abc123...",
  "grade": "ASPIRANT",
  "nextGradeId": "64abc789...",
  "updatedAt": "2025-01-18T12:00:00Z"
}
```

**Implémentation:**
```typescript
async updateNextGrade(
  gradeId: string, 
  nextGradeId: string | null, 
  user: User
) {
  if (!user.roles.includes('ADMIN')) {
    throw new UnauthorizedException();
  }

  const grade = await GradeConfig.findById(gradeId).exec();
  if (!grade) {
    throw new NotFoundException(`Grade ${gradeId} introuvable`);
  }

  // Validation
  if (nextGradeId) {
    const nextGrade = await GradeConfig.findById(nextGradeId).exec();
    if (!nextGrade) {
      throw new BadRequestException('Grade suivant introuvable');
    }
    if (nextGrade.level <= grade.level) {
      throw new BadRequestException(
        'Le grade suivant doit être de niveau supérieur'
      );
    }
    // Vérifier qu'on ne crée pas de cycle
    await this.checkForCycles(grade._id, nextGradeId);
  }

  grade.nextGradeId = nextGradeId;
  await grade.save();
  
  return grade;
}

private async checkForCycles(startId: string, nextId: string) {
  const visited = new Set<string>();
  let currentId = nextId;

  while (currentId) {
    if (visited.has(currentId)) {
      throw new BadRequestException('Cycle détecté dans la hiérarchie des grades');
    }
    if (currentId === startId) {
      throw new BadRequestException('Le grade ne peut pas pointer vers lui-même');
    }
    
    visited.add(currentId);
    
    const grade = await GradeConfig.findById(currentId).exec();
    if (!grade) break;
    
    currentId = grade.nextGradeId?.toString() || null;
  }
}
```

---

### 6. PUT `/admin/grades/:id/reorder-choices`

**Description:** Réordonne les choix de consultations pour un grade.

**Authentification:** Requise (Admin uniquement)

**Request Body:**
```json
{
  "choices": [
    { "choiceId": "choice123", "order": 1 },
    { "choiceId": "choice456", "order": 2 }
  ]
}
```

**Response:**
```json
{
  "_id": "64abc123...",
  "consultationChoices": [...]
}
```

**Implémentation:**
```typescript
async reorderGradeChoices(
  gradeId: string,
  choices: Array<{ choiceId: string; order: number }>,
  user: User
) {
  if (!user.roles.includes('ADMIN')) {
    throw new UnauthorizedException();
  }

  const grade = await GradeConfig.findById(gradeId).exec();
  if (!grade) {
    throw new NotFoundException();
  }

  // Mettre à jour l'ordre de chaque choix
  for (const { choiceId, order } of choices) {
    const choice = grade.consultationChoices.find(c => c.choiceId === choiceId);
    if (choice) {
      choice.order = order;
    }
  }

  // Trier par ordre
  grade.consultationChoices.sort((a, b) => (a.order || 0) - (b.order || 0));
  
  await grade.save();
  return grade;
}
```

---

## Initialisation des Grades

Lors de la première installation ou migration, créer les 9 grades avec leurs prérequis :

```typescript
const GRADE_REQUIREMENTS = [
  { grade: 'ASPIRANT', level: 1, consultations: 3, rituels: 1, livres: 1 },
  { grade: 'CONTEMPLATEUR', level: 2, consultations: 6, rituels: 2, livres: 1 },
  { grade: 'CONSCIENT', level: 3, consultations: 9, rituels: 3, livres: 2 },
  { grade: 'INTEGRATEUR', level: 4, consultations: 13, rituels: 4, livres: 2 },
  { grade: 'TRANSMUTANT', level: 5, consultations: 18, rituels: 6, livres: 3 },
  { grade: 'ALIGNE', level: 6, consultations: 23, rituels: 8, livres: 4 },
  { grade: 'EVEILLE', level: 7, consultations: 28, rituels: 10, livres: 5 },
  { grade: 'SAGE', level: 8, consultations: 34, rituels: 10, livres: 6 },
  { grade: 'MAITRE_DE_SOI', level: 9, consultations: 40, rituels: 10, livres: 8 },
];

const GRADE_NAMES = {
  ASPIRANT: 'Aspirant',
  CONTEMPLATEUR: 'Contemplateur',
  CONSCIENT: 'Conscient',
  INTEGRATEUR: 'Intégrateur',
  TRANSMUTANT: 'Transmutant',
  ALIGNE: 'Aligné',
  EVEILLE: 'Éveillé',
  SAGE: 'Sage',
  MAITRE_DE_SOI: 'Maître de Soi',
};

async function initializeGrades() {
  for (const req of GRADE_REQUIREMENTS) {
    const existing = await GradeConfig.findOne({ grade: req.grade }).exec();
    if (!existing) {
      await GradeConfig.create({
        grade: req.grade,
        level: req.level,
        name: GRADE_NAMES[req.grade],
        requirements: {
          consultations: req.consultations,
          rituels: req.rituels,
          livres: req.livres
        },
        consultationChoices: [],
        nextGradeId: null
      });
    }
  }

  // Configurer la chaîne nextGradeId automatiquement
  const grades = await GradeConfig.find().sort({ level: 1 }).exec();
  for (let i = 0; i < grades.length - 1; i++) {
    grades[i].nextGradeId = grades[i + 1]._id;
    await grades[i].save();
  }
}
```

## Sécurité

1. **Authentification:** Tous les endpoints requièrent un token JWT valide
2. **Autorisation:** Seuls les utilisateurs avec le rôle `ADMIN` peuvent accéder
3. **Validation:** Les DTOs doivent être validés avec class-validator
4. **Protection contre les cycles:** Vérifier qu'on ne crée pas de boucles infinies dans nextGradeId

## Testing

### Tests Unitaires

```typescript
describe('GradeConfigService', () => {
  it('should update grade choices', async () => {
    const result = await service.updateGradeConfig(gradeId, {
      consultationChoiceIds: ['choice1', 'choice2']
    }, adminUser);
    expect(result.consultationChoices).toHaveLength(2);
  });

  it('should reject invalid nextGradeId', async () => {
    await expect(
      service.updateNextGrade(grade1Id, grade1Id, adminUser)
    ).rejects.toThrow('Le grade ne peut pas pointer vers lui-même');
  });

  it('should detect cycles', async () => {
    await expect(
      service.updateNextGrade(grade3Id, grade1Id, adminUser)
    ).rejects.toThrow('Cycle détecté');
  });
});
```

## Migration depuis l'ancien système

Si vous aviez un système de grades différent :

```typescript
async function migrateGrades() {
  // 1. Créer les nouveaux GradeConfig
  await initializeGrades();

  // 2. Migrer les associations existantes
  const users = await User.find({ grade: { $exists: true } }).exec();
  for (const user of users) {
    // Associer l'utilisateur au bon GradeConfig
    const gradeConfig = await GradeConfig.findOne({ grade: user.grade }).exec();
    if (gradeConfig) {
      user.gradeConfigId = gradeConfig._id;
      await user.save();
    }
  }
}
```

## Notes Importantes

- Les prérequis (consultations, rituels, livres) sont **immuables** et définis dans le code
- Seuls les **choix de consultations** et le **grade suivant** sont modifiables par l'admin
- La hiérarchie doit toujours être **acyclique** (pas de boucles)
- Un grade ne peut pointer que vers un grade de **niveau strictement supérieur**
- Le dernier grade (MAITRE_DE_SOI) a toujours `nextGradeId = null`

## Support

Pour toute question technique, contacter l'équipe backend Mon Étoile.
