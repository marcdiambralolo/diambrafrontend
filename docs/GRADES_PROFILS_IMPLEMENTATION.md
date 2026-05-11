# Système de Grades Initiatiques et Profils Utilisateurs - Implémentation Frontend

## Vue d'ensemble

Cette implémentation ajoute deux systèmes majeurs à la plateforme Mon Étoile :

1. **Système de Grades Initiatiques** : 9 degrés d'évolution spirituelle
2. **Système de Profils Utilisateurs** : 3 types d'abonnement (Basique, Premium, Intégral)

## Fichiers créés

### Types et Logique Métier

1. **`lib/types/grade.types.ts`**
   - Enum `Grade` (9 grades de 1 à 9)
   - Interface `GradeRequirements` : conditions pour chaque grade
   - Interface `UserProgress` : progression de l'utilisateur
   - Constante `GRADE_REQUIREMENTS` : tableau des seuils
   - Constante `GRADE_MESSAGES` : messages d'accueil et de félicitations
   - Fonctions utilitaires :
     - `calculateCurrentGrade()` : calcule le grade actuel
     - `calculateProgress()` : calcule la progression vers le grade suivant
     - `getGradeName()` : retourne le nom du grade

2. **`lib/types/user-profile.types.ts`**
   - Enum `UserProfileType` : BASIQUE, PREMIUM, INTEGRAL
   - Interface `UserSubscription` : données d'abonnement
   - Interface `UserProfileAccess` : droits d'accès calculés
   - Fonctions utilitaires :
     - `isSubscriptionActive()` : vérifie si l'abonnement est valide
     - `hasAccessToRubrique()` : vérifie l'accès à une rubrique
     - `calculateUserAccess()` : calcule les droits complets
     - `createPremiumSubscription()` : crée un abonnement Premium
     - `createIntegralSubscription()` : crée un abonnement Intégral

### Composants UI

3. **`components/profil/GradeBadge.tsx`**
   - Badge principal affichant le grade actuel avec icône étoile animée
   - Barres de progression vers le grade suivant
   - Statistiques (consultations, rituels, livres)
   - Couleurs dégradées par grade (9 palettes différentes)

4. **`components/profil/ProfileTypeBadge.tsx`**
   - Badge de type de profil (Basique/Premium/Intégral)
   - Affichage de la rubrique autorisée (Premium)
   - Date d'expiration de l'abonnement
   - Composant `ProfileFeatures` : liste des avantages par profil

5. **`components/profil/GradeWelcomeMessage.tsx`**
   - Message d'accueil personnalisé par grade
   - Message de félicitations lors de montée de grade
   - Liste des 9 grades pour le grade Aspirant

6. **`components/profil/UserProgressSection.tsx`**
   - Section complète regroupant tous les éléments
   - Gestion du loading/error
   - Affichage coordonné du profil et du grade

### Services et Hooks

7. **`lib/api/services/grade.service.ts`**
   - `gradeService.getUserProgress()` : récupère la progression
   - `gradeService.incrementConsultations()` : incrémente les consultations
   - `gradeService.incrementRituels()` : incrémente les rituels
   - `gradeService.incrementLivres()` : incrémente les livres
   - `profileService.getSubscription()` : récupère l'abonnement
   - `profileService.checkRubriqueAccess()` : vérifie l'accès à une rubrique
   - `profileService.createPremiumSubscription()` : crée un Premium
   - `profileService.createIntegralSubscription()` : crée un Intégral

8. **`hooks/profil/useUserProfile.ts`**
   - Hook unifié pour gérer grade + profil
   - Retourne : `gradeProgress`, `subscription`, `access`, `loading`, `error`, `refetch`
   - Calcul automatique des droits d'accès

### Modifications des fichiers existants

9. **`lib/interfaces.ts`**
   - Ajout imports : `Grade`, `UserProfileType`
   - Ajout champs dans `User` :
     - `grade?: Grade`
     - `rituelsCount?: number`
     - `livresCount?: number`
     - `profileType?: UserProfileType`
     - `subscriptionStartDate?: string`
     - `subscriptionEndDate?: string`
     - `authorizedRubriqueId?: string`

10. **`lib/api/endpoints.ts`**
    - Section `grades` avec 5 endpoints
    - Section `subscriptions` avec 6 endpoints

### Documentation

11. **`GRADES_PROFILS_BACKEND_GUIDE.md`**
    - Guide complet pour l'implémentation backend
    - Modifications du modèle User
    - Détails des 15 endpoints API
    - Logique de calcul de grade
    - Middleware d'accès aux rubriques
    - Tâches CRON pour expiration
    - Script de migration des données existantes

## Seuils des Grades

| Grade | Nom | Consultations | Rituels | Livres |
|-------|-----|---------------|---------|--------|
| 1 | Aspirant | 3 | 1 | 1 |
| 2 | Contemplateur | 6 | 2 | 1 |
| 3 | Conscient | 9 | 3 | 2 |
| 4 | Intégrateur | 13 | 4 | 2 |
| 5 | Transmutant | 18 | 6 | 3 |
| 6 | Aligné | 23 | 8 | 4 |
| 7 | Éveillé | 28 | 10 | 5 |
| 8 | Sage | 34 | 10 | 6 |
| 9 | Maître de Soi | 40 | 10 | 8 |

## Droits d'accès par Profil

| Profil | Contenu gratuit | Achat unitaire | Accès rubrique | Accès total |
|--------|-----------------|----------------|----------------|-------------|
| Basique | ✅ | ✅ | ❌ | ❌ |
| Premium | ✅ | ✅ | ✅ (1 rubrique) | ❌ |
| Intégral | ✅ | ❌ (inutile) | ✅ | ✅ |

## Utilisation dans le code

### Afficher le profil complet

```tsx
import UserProgressSection from '@/components/profil/UserProgressSection';

export default function ProfilPage() {
  return (
    <UserProgressSection 
      userName="Jean Dupont"
      showWelcomeMessage={true}
    />
  );
}
```

### Vérifier l'accès à une rubrique

```tsx
import { useUserProfile } from '@/hooks/profil/useUserProfile';

function RubriqueAccess({ rubriqueId }) {
  const { access } = useUserProfile();
  
  const hasAccess = 
    access?.hasAccessToAllRubriques || 
    access?.hasAccessToRubrique === rubriqueId;
    
  if (!hasAccess) {
    return <div>Abonnement requis</div>;
  }
  
  return <div>Contenu de la rubrique</div>;
}
```

### Afficher uniquement le badge de grade

```tsx
import GradeBadge from '@/components/profil/GradeBadge';
import { calculateProgress } from '@/lib/types/grade.types';

function MyGrade() {
  const progress = calculateProgress(5, 2, 1); // consultations, rituels, livres
  
  return <GradeBadge progress={progress} showDetails={true} />;
}
```

## Points d'attention

### Frontend

1. **Cache désactivé** : Le fichier `app/admin/prompts/create/page.tsx` a le cache désactivé temporairement. À réactiver en production.

2. **Messages de grade** : Les messages complets sont stockés dans `GRADE_MESSAGES`. Ils sont longs et poétiques.

3. **Calcul côté client** : La progression est calculée côté client pour réactivité. Le backend reste source de vérité.

4. **Animations** : Les composants utilisent Framer Motion. Prévoir un fallback pour les navigateurs sans JS.

### Backend (à implémenter)

1. **Atomicité** : Les incréments de compteurs doivent être atomiques (`$inc`)

2. **Notifications** : Envoyer email/push lors de montée de grade

3. **Expiration** : CRON quotidien pour réinitialiser les profils expirés

4. **Middleware** : Protéger les routes de consultation selon le type de profil

5. **Migration** : Script pour initialiser les utilisateurs existants

## Tests recommandés

### Frontend
- ✅ Build successful (vérifié)
- ✅ TypeScript sans erreurs
- 🔲 Affichage des 9 grades
- 🔲 Barres de progression
- 🔲 Animations des badges
- 🔲 Responsive mobile

### Backend (à faire)
- 🔲 Calcul de grade avec seuils exacts
- 🔲 Expiration d'abonnement
- 🔲 Accès refusé selon profil
- 🔲 Concurrence sur incréments
- 🔲 Notifications de montée de grade

## État actuel

✅ **Frontend complet** : Tous les composants, types et services sont créés et fonctionnels
✅ **Documentation backend** : Guide détaillé dans `GRADES_PROFILS_BACKEND_GUIDE.md`
✅ **Build validé** : Compilation réussie sans erreurs TypeScript
🔲 **Backend à implémenter** : 15 endpoints et logique métier à créer côté serveur

## Prochaines étapes

1. Implémenter les endpoints backend (voir `GRADES_PROFILS_BACKEND_GUIDE.md`)
2. Tester l'intégration frontend/backend
3. Ajouter la page d'abonnement (choix Premium/Intégral)
4. Intégrer les messages de grade dans les notifications
5. Créer la page d'administration des abonnements
6. Ajouter les statistiques globales des grades dans l'admin
