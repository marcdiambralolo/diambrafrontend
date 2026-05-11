# Guide d'implémentation Backend - Système de Grades et Profils

## Vue d'ensemble

Ce document décrit l'implémentation backend nécessaire pour le système de grades initiatiques et de profils utilisateurs.

## 1. Modifications du modèle User

### Nouveaux champs à ajouter au schema User

```typescript
{
  // Système de grades initiatiques
  grade: {
    type: Number,
    default: 1, // Grade.ASPIRANT
    min: 1,
    max: 9
  },
  consultationsCount: {
    type: Number,
    default: 0
  },
  rituelsCount: {
    type: Number,
    default: 0
  },
  livresCount: {
    type: Number,
    default: 0
  },
  
  // Système de profils utilisateurs
  profileType: {
    type: String,
    enum: ['BASIQUE', 'PREMIUM', 'INTEGRAL'],
    default: 'BASIQUE'
  },
  subscriptionStartDate: {
    type: Date,
    default: null
  },
  subscriptionEndDate: {
    type: Date,
    default: null
  },
  authorizedRubriqueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rubrique',
    default: null
  }
}
```

## 2. Endpoints API à créer

### Grades - GET /users/me/progress

Retourne la progression de l'utilisateur connecté.

**Response:**
```json
{
  "consultationsCount": 5,
  "rituelsCount": 2,
  "livresCount": 1,
  "currentGrade": 2
}
```

### Grades - POST /users/:userId/increment-consultations

Incrémente le compteur de consultations et vérifie la montée de grade.

**Logic:**
1. Incrémenter `consultationsCount`
2. Vérifier si l'utilisateur remplit les conditions pour un grade supérieur
3. Si oui, mettre à jour le `grade` et envoyer une notification
4. Retourner le nouveau grade

**Response:**
```json
{
  "consultationsCount": 6,
  "gradeChanged": true,
  "newGrade": 2,
  "gradeName": "Contemplateur"
}
```

### Grades - POST /users/:userId/increment-rituels

Même logique que consultations, mais pour `rituelsCount`.

### Grades - POST /users/:userId/increment-livres

Même logique que consultations, mais pour `livresCount`.

### Grades - POST /users/:userId/grade-notification

Envoie une notification à l'utilisateur pour sa montée de grade.

**Request Body:**
```json
{
  "grade": 2
}
```

### Profils - GET /users/me/subscription

Retourne les informations d'abonnement de l'utilisateur connecté.

**Response:**
```json
{
  "profileType": "PREMIUM",
  "subscriptionStartDate": "2025-01-18T10:00:00Z",
  "subscriptionEndDate": "2026-01-18T10:00:00Z",
  "authorizedRubriqueId": "507f1f77bcf86cd799439011"
}
```

### Profils - POST /subscriptions/premium

Crée un abonnement Premium pour l'utilisateur.

**Request Body:**
```json
{
  "rubriqueId": "507f1f77bcf86cd799439011"
}
```

**Logic:**
1. Vérifier que l'utilisateur n'a pas déjà un abonnement actif
2. Mettre à jour `profileType` à 'PREMIUM'
3. Définir `subscriptionStartDate` à maintenant
4. Définir `subscriptionEndDate` à +12 mois
5. Définir `authorizedRubriqueId` à la rubrique choisie

### Profils - POST /subscriptions/integral

Crée un abonnement Intégral pour l'utilisateur.

**Logic:**
1. Vérifier que l'utilisateur n'a pas déjà un abonnement actif
2. Mettre à jour `profileType` à 'INTEGRAL'
3. Définir `subscriptionStartDate` à maintenant
4. Définir `subscriptionEndDate` à +12 mois
5. Mettre `authorizedRubriqueId` à null (accès à tout)

### Profils - GET /subscriptions/check-access/:rubriqueId

Vérifie si l'utilisateur a accès à une rubrique spécifique.

**Response:**
```json
{
  "hasAccess": true
}
```

**Logic:**
- BASIQUE: toujours false (doit acheter à l'unité)
- PREMIUM: true si `authorizedRubriqueId` === `rubriqueId` ET abonnement actif
- INTEGRAL: toujours true si abonnement actif

### Profils - POST /subscriptions/renew

Renouvelle l'abonnement actuel pour 12 mois supplémentaires.

### Profils - POST /subscriptions/cancel

Annule l'abonnement (retour à BASIQUE).

**Logic:**
1. Mettre `profileType` à 'BASIQUE'
2. Mettre `subscriptionEndDate` à null
3. Mettre `authorizedRubriqueId` à null

## 3. Logique de calcul de grade

```typescript
const GRADE_REQUIREMENTS = [
  { grade: 1, consultations: 3, rituels: 1, livres: 1 },
  { grade: 2, consultations: 6, rituels: 2, livres: 1 },
  { grade: 3, consultations: 9, rituels: 3, livres: 2 },
  { grade: 4, consultations: 13, rituels: 4, livres: 2 },
  { grade: 5, consultations: 18, rituels: 6, livres: 3 },
  { grade: 6, consultations: 23, rituels: 8, livres: 4 },
  { grade: 7, consultations: 28, rituels: 10, livres: 5 },
  { grade: 8, consultations: 34, rituels: 10, livres: 6 },
  { grade: 9, consultations: 40, rituels: 10, livres: 8 }
];

function calculateGrade(consultations, rituels, livres) {
  let currentGrade = 1;
  
  for (const requirement of GRADE_REQUIREMENTS) {
    if (
      consultations >= requirement.consultations &&
      rituels >= requirement.rituels &&
      livres >= requirement.livres
    ) {
      currentGrade = requirement.grade;
    } else {
      break;
    }
  }
  
  return currentGrade;
}
```

## 4. Middleware pour vérifier l'accès aux rubriques

Créer un middleware `checkRubriqueAccess` pour protéger les endpoints de consultation.

```typescript
async function checkRubriqueAccess(req, res, next) {
  const { rubriqueId } = req.params;
  const user = req.user;
  
  // BASIQUE: doit acheter
  if (user.profileType === 'BASIQUE') {
    return res.status(403).json({ 
      message: 'Abonnement requis pour accéder à cette rubrique' 
    });
  }
  
  // INTEGRAL: accès total
  if (user.profileType === 'INTEGRAL') {
    // Vérifier expiration
    if (new Date() > user.subscriptionEndDate) {
      return res.status(403).json({ 
        message: 'Abonnement expiré' 
      });
    }
    return next();
  }
  
  // PREMIUM: vérifier rubrique autorisée
  if (user.profileType === 'PREMIUM') {
    if (new Date() > user.subscriptionEndDate) {
      return res.status(403).json({ 
        message: 'Abonnement expiré' 
      });
    }
    
    if (user.authorizedRubriqueId.toString() !== rubriqueId) {
      return res.status(403).json({ 
        message: 'Cette rubrique n\'est pas incluse dans votre abonnement' 
      });
    }
    
    return next();
  }
  
  return res.status(403).json({ message: 'Accès refusé' });
}
```

## 5. Tâches CRON

### Vérification quotidienne des abonnements expirés

```typescript
// Cron job quotidien pour réinitialiser les profils expirés
async function checkExpiredSubscriptions() {
  const now = new Date();
  
  await User.updateMany(
    {
      profileType: { $in: ['PREMIUM', 'INTEGRAL'] },
      subscriptionEndDate: { $lt: now }
    },
    {
      $set: {
        profileType: 'BASIQUE',
        subscriptionEndDate: null,
        authorizedRubriqueId: null
      }
    }
  );
}
```

## 6. Notifications

### Montée de grade

Envoyer une notification lors d'une montée de grade avec le message approprié (voir `GRADE_MESSAGES` dans le frontend).

### Expiration d'abonnement

- J-7 jours: rappel de renouvellement
- J-1 jour: dernier rappel
- J-0: notification d'expiration et passage à BASIQUE

## 7. Points d'attention

1. **Atomicité**: Les incréments de compteurs doivent être atomiques pour éviter les race conditions
2. **Performance**: Indexer les champs `profileType`, `subscriptionEndDate`, `grade`
3. **Cohérence**: Vérifier l'abonnement à chaque requête critique
4. **Notifications**: Queue asynchrone pour ne pas bloquer les requêtes
5. **Historique**: Garder un log des changements de grade et d'abonnement

## 8. Tests recommandés

- Test de montée de grade avec les seuils exacts
- Test d'expiration d'abonnement
- Test d'accès avec les 3 types de profil
- Test de changement de rubrique (doit être impossible pour Premium)
- Test de concurrence sur les incréments

## 9. Migration des données existantes

```typescript
// Script de migration
async function migrateExistingUsers() {
  // Initialiser tous les utilisateurs existants
  await User.updateMany(
    { grade: { $exists: false } },
    {
      $set: {
        grade: 1,
        consultationsCount: 0,
        rituelsCount: 0,
        livresCount: 0,
        profileType: 'BASIQUE'
      }
    }
  );
  
  // Pour chaque utilisateur avec des consultations existantes
  const users = await User.find({});
  for (const user of users) {
    // Compter les consultations existantes
    const consultationsCount = await Consultation.countDocuments({ 
      userId: user._id,
      status: 'COMPLETED'
    });
    
    // Mettre à jour et recalculer le grade
    user.consultationsCount = consultationsCount;
    user.grade = calculateGrade(consultationsCount, 0, 0);
    await user.save();
  }
}
```
