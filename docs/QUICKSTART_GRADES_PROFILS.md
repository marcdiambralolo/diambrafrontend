# Guide d'intégration rapide - Grades et Profils

## Démarrage rapide (Frontend)

### 1. Afficher le profil complet de l'utilisateur

```tsx
import UserProgressSection from '@/components/profil/UserProgressSection';

<UserProgressSection 
  userName={user?.prenom || 'Voyageur'}
  showWelcomeMessage={false}
/>
```

### 2. Afficher uniquement le badge de grade

```tsx
import GradeBadge from '@/components/profil/GradeBadge';
import { calculateProgress } from '@/lib/types/grade.types';

const progress = calculateProgress(
  user.consultationsCount || 0,
  user.rituelsCount || 0,
  user.livresCount || 0
);

<GradeBadge progress={progress} showDetails={true} />
```

### 3. Afficher uniquement le badge de profil

```tsx
import ProfileTypeBadge from '@/components/profil/ProfileTypeBadge';

<ProfileTypeBadge
  profileType={user.profileType}
  subscriptionEndDate={user.subscriptionEndDate}
  authorizedRubriqueName="Astrologie"
/>
```

### 4. Afficher les plans d'abonnement

```tsx
import SubscriptionPlans from '@/components/profil/SubscriptionPlans';

<SubscriptionPlans 
  currentType={user.profileType}
  onSubscribe={(type, rubriqueId) => {
    console.log('Subscription:', type, rubriqueId);
  }}
/>
```

### 5. Utiliser le hook pour accéder aux données

```tsx
import { useUserProfile } from '@/hooks/profil/useUserProfile';

const { gradeProgress, subscription, access, loading } = useUserProfile();

if (loading) return <Loader />;

// Vérifier l'accès à une rubrique
const canAccess = 
  access?.hasAccessToAllRubriques || 
  access?.hasAccessToRubrique === rubriqueId;
```

## Backend - Endpoints à implémenter

### Minimum viable (prioritaire)

1. **GET /users/me/progress** - Retourner les compteurs et le grade
2. **GET /users/me/subscription** - Retourner le type d'abonnement
3. **GET /subscriptions/check-access/:rubriqueId** - Vérifier l'accès

### Fonctionnalités complètes

4. **POST /users/:userId/increment-consultations** - Incrémenter et vérifier grade
5. **POST /subscriptions/premium** - Créer un abonnement Premium
6. **POST /subscriptions/integral** - Créer un abonnement Intégral

Voir `GRADES_PROFILS_BACKEND_GUIDE.md` pour les détails complets.

## Calcul de grade côté frontend

```typescript
import { calculateCurrentGrade, calculateProgress } from '@/lib/types/grade.types';

// Calculer le grade actuel
const grade = calculateCurrentGrade(
  consultationsCount,
  rituelsCount,
  livresCount
);

// Calculer la progression complète
const progress = calculateProgress(
  consultationsCount,
  rituelsCount,
  livresCount
);

console.log(progress);
// {
//   consultationsCount: 5,
//   rituelsCount: 2,
//   livresCount: 1,
//   currentGrade: 1, // Aspirant
//   nextGrade: 2, // Contemplateur
//   progressToNextGrade: {
//     consultations: { current: 5, required: 6 },
//     rituels: { current: 2, required: 2 },
//     livres: { current: 1, required: 1 }
//   }
// }
```

## Vérification d'accès côté frontend

```typescript
import { hasAccessToRubrique, isSubscriptionActive } from '@/lib/types/user-profile.types';

const subscription = {
  type: UserProfileType.PREMIUM,
  dateFinAbonnement: '2026-01-18',
  rubriqueAutorisee: 'astrologie',
  isActive: true
};

// Vérifier si l'abonnement est actif
const isActive = isSubscriptionActive(subscription);

// Vérifier l'accès à une rubrique
const hasAccess = hasAccessToRubrique(subscription, 'astrologie');
```

## Messages de grade

```typescript
import { GRADE_MESSAGES, Grade } from '@/lib/types/grade.types';
import GradeWelcomeMessage from '@/components/profil/GradeWelcomeMessage';

// Afficher le message de bienvenue
<GradeWelcomeMessage
  userName="Jean"
  grade={Grade.ASPIRANT}
  isNewGrade={false}
/>

// Afficher le message de félicitations
<GradeWelcomeMessage
  userName="Jean"
  grade={Grade.CONTEMPLATEUR}
  isNewGrade={true}
/>
```

## Structure des données

### User (ajouts)

```typescript
{
  // Grades
  grade: 1, // 1-9
  consultationsCount: 5,
  rituelsCount: 2,
  livresCount: 1,
  
  // Profils
  profileType: 'BASIQUE', // 'BASIQUE' | 'PREMIUM' | 'INTEGRAL'
  subscriptionStartDate: '2025-01-18T10:00:00Z',
  subscriptionEndDate: '2026-01-18T10:00:00Z',
  authorizedRubriqueId: '507f1f77bcf86cd799439011' // Pour Premium uniquement
}
```

## Couleurs des grades (Tailwind)

```typescript
// Aspirant - Gris
bg-gradient-to-br from-slate-600 to-slate-700

// Contemplateur - Bleu
bg-gradient-to-br from-blue-600 to-blue-700

// Conscient - Cyan
bg-gradient-to-br from-cyan-600 to-cyan-700

// Intégrateur - Vert
bg-gradient-to-br from-green-600 to-green-700

// Transmutant - Jaune
bg-gradient-to-br from-yellow-600 to-yellow-700

// Aligné - Orange
bg-gradient-to-br from-orange-600 to-orange-700

// Éveillé - Violet
bg-gradient-to-br from-purple-600 to-purple-700

// Sage - Rose
bg-gradient-to-br from-pink-600 to-pink-700

// Maître de Soi - Or
bg-gradient-to-br from-amber-600 via-yellow-500 to-amber-600
```

## Services API disponibles

```typescript
import { gradeService, profileService } from '@/lib/api/services/grade.service';

// Grades
await gradeService.getUserProgress();
await gradeService.incrementConsultations(userId);
await gradeService.incrementRituels(userId);
await gradeService.incrementLivres(userId);

// Profils
await profileService.getSubscription();
await profileService.createPremiumSubscription(rubriqueId);
await profileService.createIntegralSubscription();
await profileService.checkRubriqueAccess(rubriqueId);
```

## Exemple de page complète

```tsx
'use client';

import { useAuth } from '@/lib/auth/AuthContext';
import UserProgressSection from '@/components/profil/UserProgressSection';

export default function ProfilPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">
          Mon Profil
        </h1>
        
        <UserProgressSection
          userName={user?.prenom || 'Voyageur'}
          showWelcomeMessage={false}
        />
      </div>
    </div>
  );
}
```

## Gestion des erreurs

Tous les hooks et services gèrent automatiquement les erreurs :

```tsx
const { gradeProgress, error, loading, refetch } = useUserProfile();

if (error) {
  return (
    <div className="text-red-400">
      {error}
      <button onClick={refetch}>Réessayer</button>
    </div>
  );
}
```

## Prochaines étapes

1. ✅ Frontend complet et fonctionnel
2. 🔲 Implémenter les endpoints backend (voir guide)
3. 🔲 Tester l'intégration complète
4. 🔲 Ajouter page d'abonnement dans le menu
5. 🔲 Intégrer les paiements MoneyFusion
6. 🔲 Ajouter notifications de montée de grade
7. 🔲 Admin : statistiques des grades et abonnements
