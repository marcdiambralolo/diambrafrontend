# Commandes et Snippets Utiles - Grades et Profils

## Commandes de développement

```bash
# Build du projet
npm run build

# Démarrage en mode développement
npm run dev

# Vérification TypeScript
npx tsc --noEmit

# Linting
npm run lint
```

## Snippets de code fréquents

### 1. Vérifier si l'utilisateur peut accéder à une rubrique

```typescript
import { useUserProfile } from '@/hooks/profil/useUserProfile';

function RubriqueProtected({ rubriqueId, children }) {
  const { access, loading } = useUserProfile();
  
  if (loading) return <Loader />;
  
  const hasAccess = 
    access?.hasAccessToAllRubriques || 
    access?.hasAccessToRubrique === rubriqueId;
  
  if (!hasAccess) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-white mb-4">
          Abonnement requis pour accéder à cette rubrique
        </p>
        <Link href="/star/subscriptions">
          <button className="btn-primary">
            Voir les abonnements
          </button>
        </Link>
      </div>
    );
  }
  
  return <>{children}</>;
}
```

### 2. Afficher un badge de grade dans un header

```typescript
import { calculateProgress } from '@/lib/types/grade.types';
import { Star } from 'lucide-react';

function UserHeader({ user }) {
  const progress = calculateProgress(
    user.consultationsCount || 0,
    user.rituelsCount || 0,
    user.livresCount || 0
  );
  
  return (
    <div className="flex items-center gap-3">
      <img src={user.avatar} className="w-10 h-10 rounded-full" />
      <div>
        <div className="font-semibold text-white">{user.prenom}</div>
        <div className="flex items-center gap-1 text-sm text-cosmic-purple">
          <Star className="w-3 h-3" />
          Grade {progress.currentGrade}
        </div>
      </div>
    </div>
  );
}
```

### 3. Calculer et afficher le prochain grade

```typescript
import { calculateProgress, getGradeName } from '@/lib/types/grade.types';

function NextGradeIndicator({ user }) {
  const progress = calculateProgress(
    user.consultationsCount,
    user.rituelsCount,
    user.livresCount
  );
  
  if (!progress.nextGrade) {
    return (
      <div className="text-amber-400">
        🎉 Vous avez atteint le grade maximum !
      </div>
    );
  }
  
  return (
    <div>
      <p className="text-slate-300">
        Prochain grade: <strong>{getGradeName(progress.nextGrade)}</strong>
      </p>
      <ul className="text-sm text-slate-400">
        <li>
          Consultations: {progress.progressToNextGrade.consultations.current} / {progress.progressToNextGrade.consultations.required}
        </li>
        <li>
          Rituels: {progress.progressToNextGrade.rituels.current} / {progress.progressToNextGrade.rituels.required}
        </li>
        <li>
          Livres: {progress.progressToNextGrade.livres.current} / {progress.progressToNextGrade.livres.required}
        </li>
      </ul>
    </div>
  );
}
```

### 4. Vérifier l'expiration d'un abonnement

```typescript
import { isSubscriptionActive } from '@/lib/types/user-profile.types';

function SubscriptionStatus({ user }) {
  const subscription = {
    type: user.profileType,
    dateFinAbonnement: user.subscriptionEndDate,
    isActive: true
  };
  
  const isActive = isSubscriptionActive(subscription);
  
  if (!isActive) {
    return (
      <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
        ⚠️ Votre abonnement a expiré. 
        <button className="ml-2 btn-primary">Renouveler</button>
      </div>
    );
  }
  
  const daysLeft = Math.ceil(
    (new Date(user.subscriptionEndDate).getTime() - Date.now()) 
    / (1000 * 60 * 60 * 24)
  );
  
  return (
    <div className="text-green-400">
      ✓ Abonnement actif ({daysLeft} jours restants)
    </div>
  );
}
```

### 5. Notification de montée de grade (composant)

```typescript
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { getGradeName } from '@/lib/types/grade.types';

function GradeUpNotification({ newGrade, onClose }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <motion.div
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="bg-gradient-to-br from-amber-600 to-yellow-500 rounded-full p-8 text-center"
      >
        <Star className="w-20 h-20 text-white mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-white mb-2">
          Félicitations !
        </h2>
        <p className="text-white text-xl">
          Vous avez atteint le grade
        </p>
        <p className="text-white text-2xl font-bold mt-2">
          {getGradeName(newGrade)}
        </p>
      </motion.div>
    </motion.div>
  );
}
```

### 6. Backend - Incrémenter les consultations

```typescript
// Route: POST /users/:userId/increment-consultations
async function incrementConsultations(req, res) {
  const { userId } = req.params;
  
  try {
    // Incrémenter de manière atomique
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { consultationsCount: 1 } },
      { new: true }
    );
    
    // Recalculer le grade
    const newGrade = calculateGrade(
      user.consultationsCount,
      user.rituelsCount,
      user.livresCount
    );
    
    // Si nouveau grade
    let gradeChanged = false;
    if (newGrade > user.grade) {
      user.grade = newGrade;
      await user.save();
      gradeChanged = true;
      
      // Envoyer notification
      await sendGradeUpNotification(user, newGrade);
    }
    
    res.json({
      consultationsCount: user.consultationsCount,
      gradeChanged,
      newGrade: user.grade,
      gradeName: getGradeName(user.grade)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
```

### 7. Backend - Créer un abonnement Premium

```typescript
// Route: POST /subscriptions/premium
async function createPremiumSubscription(req, res) {
  const { rubriqueId } = req.body;
  const userId = req.user._id;
  
  try {
    // Vérifier que l'utilisateur n'a pas déjà un abonnement actif
    const user = await User.findById(userId);
    
    if (user.profileType !== 'BASIQUE' && 
        new Date(user.subscriptionEndDate) > new Date()) {
      return res.status(400).json({ 
        message: 'Vous avez déjà un abonnement actif' 
      });
    }
    
    // Créer l'abonnement
    const now = new Date();
    const endDate = new Date(now);
    endDate.setFullYear(endDate.getFullYear() + 1); // +1 an
    
    user.profileType = 'PREMIUM';
    user.subscriptionStartDate = now;
    user.subscriptionEndDate = endDate;
    user.authorizedRubriqueId = rubriqueId;
    
    await user.save();
    
    // Envoyer confirmation email
    await sendSubscriptionConfirmation(user);
    
    res.json({
      message: 'Abonnement Premium créé avec succès',
      subscription: {
        type: user.profileType,
        startDate: user.subscriptionStartDate,
        endDate: user.subscriptionEndDate,
        rubriqueId: user.authorizedRubriqueId
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
```

### 8. Backend - Middleware de vérification d'accès

```typescript
// Middleware: checkRubriqueAccess
async function checkRubriqueAccess(req, res, next) {
  const { rubriqueId } = req.params;
  const user = req.user;
  
  try {
    // BASIQUE: doit acheter
    if (user.profileType === 'BASIQUE') {
      return res.status(403).json({ 
        message: 'Abonnement requis pour accéder à cette rubrique',
        requiresSubscription: true
      });
    }
    
    // Vérifier expiration
    if (new Date() > new Date(user.subscriptionEndDate)) {
      // Réinitialiser à BASIQUE
      user.profileType = 'BASIQUE';
      user.subscriptionEndDate = null;
      user.authorizedRubriqueId = null;
      await user.save();
      
      return res.status(403).json({ 
        message: 'Votre abonnement a expiré',
        subscriptionExpired: true
      });
    }
    
    // INTEGRAL: accès total
    if (user.profileType === 'INTEGRAL') {
      return next();
    }
    
    // PREMIUM: vérifier rubrique autorisée
    if (user.profileType === 'PREMIUM') {
      if (user.authorizedRubriqueId.toString() === rubriqueId) {
        return next();
      } else {
        return res.status(403).json({ 
          message: 'Cette rubrique n\'est pas incluse dans votre abonnement Premium',
          authorizedRubrique: user.authorizedRubriqueId
        });
      }
    }
    
    return res.status(403).json({ message: 'Accès refusé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Utilisation
router.get('/rubriques/:rubriqueId/consultations', 
  authenticate, 
  checkRubriqueAccess, 
  getConsultations
);
```

### 9. Script de test de calcul de grade

```typescript
import { calculateProgress, getGradeName } from '@/lib/types/grade.types';

// Test tous les grades
const testCases = [
  { consultations: 3, rituels: 1, livres: 1, expected: 1 },
  { consultations: 6, rituels: 2, livres: 1, expected: 2 },
  { consultations: 9, rituels: 3, livres: 2, expected: 3 },
  { consultations: 13, rituels: 4, livres: 2, expected: 4 },
  { consultations: 18, rituels: 6, livres: 3, expected: 5 },
  { consultations: 23, rituels: 8, livres: 4, expected: 6 },
  { consultations: 28, rituels: 10, livres: 5, expected: 7 },
  { consultations: 34, rituels: 10, livres: 6, expected: 8 },
  { consultations: 40, rituels: 10, livres: 8, expected: 9 },
];

testCases.forEach(test => {
  const progress = calculateProgress(
    test.consultations,
    test.rituels,
    test.livres
  );
  
  console.log(
    `${test.consultations}C/${test.rituels}R/${test.livres}L → ` +
    `Grade ${progress.currentGrade} (${getGradeName(progress.currentGrade)}) ` +
    `${progress.currentGrade === test.expected ? '✅' : '❌ Expected ' + test.expected}`
  );
});
```

### 10. CRON - Vérification quotidienne des expirations

```typescript
import cron from 'node-cron';

// Tous les jours à minuit
cron.schedule('0 0 * * *', async () => {
  console.log('Running daily subscription check...');
  
  const now = new Date();
  
  // Réinitialiser les abonnements expirés
  const result = await User.updateMany(
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
  
  console.log(`${result.modifiedCount} subscriptions expired and reset to BASIQUE`);
  
  // Envoyer rappels J-7
  const inSevenDays = new Date(now);
  inSevenDays.setDate(inSevenDays.getDate() + 7);
  
  const usersToRemind = await User.find({
    profileType: { $in: ['PREMIUM', 'INTEGRAL'] },
    subscriptionEndDate: {
      $gte: inSevenDays,
      $lt: new Date(inSevenDays.getTime() + 86400000) // +1 day
    }
  });
  
  for (const user of usersToRemind) {
    await sendRenewalReminder(user, 7);
  }
  
  console.log(`${usersToRemind.length} renewal reminders sent`);
});
```

## Variables d'environnement requises

```bash
# Aucune variable spécifique pour les grades/profils
# Utilise les variables existantes :
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Commandes Git

```bash
# Commit des changements
git add .
git commit -m "feat: implement grades and user profiles system"

# Push
git push origin main
```

## Debugging

### Vérifier les données utilisateur

```typescript
// Dans le composant
const { gradeProgress, subscription, access } = useUserProfile();

console.log('Grade:', gradeProgress);
console.log('Subscription:', subscription);
console.log('Access:', access);
```

### Tester le calcul de grade manuellement

```typescript
import { calculateProgress } from '@/lib/types/grade.types';

const progress = calculateProgress(5, 2, 1);
console.log(progress);
```

### Vérifier l'accès à une rubrique

```typescript
import { hasAccessToRubrique } from '@/lib/types/user-profile.types';

const subscription = {
  type: 'PREMIUM',
  dateFinAbonnement: '2026-01-18',
  rubriqueAutorisee: 'astrologie',
  isActive: true
};

console.log(hasAccessToRubrique(subscription, 'astrologie')); // true
console.log(hasAccessToRubrique(subscription, 'numerologie')); // false
```

## Checklist d'intégration

Frontend:
- [x] Types créés (grade.types.ts, user-profile.types.ts)
- [x] Composants UI créés (GradeBadge, ProfileTypeBadge, etc.)
- [x] Hook useUserProfile créé
- [x] Services API créés
- [x] Build validé

Backend (à faire):
- [ ] Ajouter champs au modèle User
- [ ] Créer endpoints grades
- [ ] Créer endpoints profils
- [ ] Implémenter logique de calcul
- [ ] Créer middleware d'accès
- [ ] Configurer CRON expirations
- [ ] Tester endpoints
- [ ] Migrer données existantes

Documentation:
- [x] Guide backend complet
- [x] Guide architecture
- [x] Guide démarrage rapide
- [x] Commandes et snippets
