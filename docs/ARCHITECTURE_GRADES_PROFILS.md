# Architecture du Système de Grades et Profils

## Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    COMPOSANTS UI                             │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │                                                              │  │
│  │  UserProgressSection                                         │  │
│  │    ├─ GradeBadge           (badge + progression)            │  │
│  │    ├─ ProfileTypeBadge     (type d'abonnement)             │  │
│  │    └─ GradeWelcomeMessage  (messages initiatiques)         │  │
│  │                                                              │  │
│  │  SubscriptionPlans         (choix abonnement)               │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                             ↕                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    HOOKS CUSTOM                              │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │                                                              │  │
│  │  useUserProfile()                                            │  │
│  │    ├─ gradeProgress:  UserProgress                          │  │
│  │    ├─ subscription:   UserSubscription                      │  │
│  │    ├─ access:         UserProfileAccess                     │  │
│  │    ├─ loading:        boolean                               │  │
│  │    ├─ error:          string | null                         │  │
│  │    └─ refetch:        () => Promise<void>                   │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                             ↕                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                  SERVICES API                                │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │                                                              │  │
│  │  gradeService                                                │  │
│  │    ├─ getUserProgress()                                      │  │
│  │    ├─ incrementConsultations()                              │  │
│  │    ├─ incrementRituels()                                    │  │
│  │    └─ incrementLivres()                                     │  │
│  │                                                              │  │
│  │  profileService                                              │  │
│  │    ├─ getSubscription()                                      │  │
│  │    ├─ createPremiumSubscription()                           │  │
│  │    ├─ createIntegralSubscription()                          │  │
│  │    └─ checkRubriqueAccess()                                 │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                             ↕                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                  TYPES & LOGIQUE                             │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │                                                              │  │
│  │  grade.types.ts                                              │  │
│  │    ├─ Grade (enum 1-9)                                       │  │
│  │    ├─ GRADE_REQUIREMENTS (seuils)                           │  │
│  │    ├─ GRADE_MESSAGES (textes)                               │  │
│  │    ├─ calculateCurrentGrade()                               │  │
│  │    └─ calculateProgress()                                   │  │
│  │                                                              │  │
│  │  user-profile.types.ts                                       │  │
│  │    ├─ UserProfileType (enum)                                │  │
│  │    ├─ isSubscriptionActive()                                │  │
│  │    ├─ hasAccessToRubrique()                                 │  │
│  │    └─ calculateUserAccess()                                 │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                 ↕
                          HTTP / REST API
                                 ↕
┌─────────────────────────────────────────────────────────────────────┐
│                        BACKEND (Node.js)                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    ENDPOINTS API                             │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │                                                              │  │
│  │  Grades                                                      │  │
│  │    GET    /users/me/progress                                │  │
│  │    POST   /users/:id/increment-consultations                │  │
│  │    POST   /users/:id/increment-rituels                      │  │
│  │    POST   /users/:id/increment-livres                       │  │
│  │    POST   /users/:id/grade-notification                     │  │
│  │                                                              │  │
│  │  Profils                                                     │  │
│  │    GET    /users/me/subscription                            │  │
│  │    POST   /subscriptions/premium                            │  │
│  │    POST   /subscriptions/integral                           │  │
│  │    GET    /subscriptions/check-access/:rubriqueId           │  │
│  │    POST   /subscriptions/renew                              │  │
│  │    POST   /subscriptions/cancel                             │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                             ↕                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    BUSINESS LOGIC                            │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │                                                              │  │
│  │  calculateGrade(consultations, rituels, livres)             │  │
│  │    → Compare avec GRADE_REQUIREMENTS                        │  │
│  │    → Retourne le grade le plus élevé atteint               │  │
│  │                                                              │  │
│  │  checkRubriqueAccess(user, rubriqueId)                      │  │
│  │    → BASIQUE: false (doit acheter)                          │  │
│  │    → PREMIUM: true si rubrique autorisée + actif           │  │
│  │    → INTEGRAL: true si actif                                │  │
│  │                                                              │  │
│  │  Middleware: verifySubscription                             │  │
│  │    → Vérifie la date d'expiration                          │  │
│  │    → Applique les droits d'accès                           │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                             ↕                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    MODÈLE USER                               │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │                                                              │  │
│  │  Grades                                                      │  │
│  │    grade: Number (1-9)                                       │  │
│  │    consultationsCount: Number                               │  │
│  │    rituelsCount: Number                                     │  │
│  │    livresCount: Number                                      │  │
│  │                                                              │  │
│  │  Profils                                                     │  │
│  │    profileType: String (BASIQUE/PREMIUM/INTEGRAL)           │  │
│  │    subscriptionStartDate: Date                              │  │
│  │    subscriptionEndDate: Date                                │  │
│  │    authorizedRubriqueId: ObjectId (ref: Rubrique)           │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                             ↕                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    TÂCHES CRON                               │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │                                                              │  │
│  │  Quotidien: checkExpiredSubscriptions()                     │  │
│  │    → Réinitialiser profileType à BASIQUE si expiré         │  │
│  │                                                              │  │
│  │  J-7: sendRenewalReminder()                                 │  │
│  │  J-1: sendFinalReminder()                                   │  │
│  │  J-0: sendExpirationNotice()                                │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                 ↕
                            BASE DE DONNÉES
                          (MongoDB / PostgreSQL)
```

## Flux de données - Exemple: Consultation complétée

```
1. Utilisateur complète une consultation
   ↓
2. Backend: POST /consultations/:id/complete
   ↓
3. Backend: incrementConsultations(userId)
   ↓
4. Backend: User.consultationsCount += 1
   ↓
5. Backend: calculateGrade(consultations, rituels, livres)
   ↓
6. Backend: Si nouveau grade → envoyer notification
   ↓
7. Frontend: useUserProfile() refetch
   ↓
8. Frontend: calculateProgress() → affichage mis à jour
```

## Flux d'abonnement - Exemple: Souscription Premium

```
1. Utilisateur clique "S'abonner Premium"
   ↓
2. Utilisateur sélectionne une rubrique
   ↓
3. Frontend: profileService.createPremiumSubscription(rubriqueId)
   ↓
4. Backend: POST /subscriptions/premium
   ↓
5. Backend: Update User
      profileType = 'PREMIUM'
      subscriptionStartDate = now
      subscriptionEndDate = now + 1 year
      authorizedRubriqueId = rubriqueId
   ↓
6. Backend: Retourne user mis à jour
   ↓
7. Frontend: Redirection vers /star/profil
   ↓
8. Frontend: useUserProfile() charge nouveau statut
   ↓
9. Frontend: Affichage badge Premium + rubrique autorisée
```

## Flux de vérification d'accès - Exemple: Accès à une rubrique

```
1. Utilisateur clique sur une rubrique
   ↓
2. Frontend: useUserProfile() → access
   ↓
3. Frontend: Vérifier
      if (access.hasAccessToAllRubriques) → OK
      else if (access.hasAccessToRubrique === rubriqueId) → OK
      else → Afficher page d'abonnement
   ↓
4. Si OK: Afficher contenu rubrique
   Si NON: Afficher SubscriptionPlans component
```

## Seuils de grades (rappel)

```
Grade 1 - Aspirant        →  3 consultations,  1 rituel,  1 livre
Grade 2 - Contemplateur   →  6 consultations,  2 rituels, 1 livre
Grade 3 - Conscient       →  9 consultations,  3 rituels, 2 livres
Grade 4 - Intégrateur     → 13 consultations,  4 rituels, 2 livres
Grade 5 - Transmutant     → 18 consultations,  6 rituels, 3 livres
Grade 6 - Aligné          → 23 consultations,  8 rituels, 4 livres
Grade 7 - Éveillé         → 28 consultations, 10 rituels, 5 livres
Grade 8 - Sage            → 34 consultations, 10 rituels, 6 livres
Grade 9 - Maître de Soi   → 40 consultations, 10 rituels, 8 livres
```

## Types de profils

```
BASIQUE (gratuit)
  ✅ Contenu gratuit
  ✅ Achats à l'unité
  ❌ Pas d'accès illimité

PREMIUM (19 900 FCFA / $35)
  ✅ Tout Basique
  ✅ Accès illimité à 1 rubrique
  ✅ Durée: 12 mois
  ❌ Autres rubriques payantes

INTEGRAL (49 900 FCFA / $90)
  ✅ Tout Premium
  ✅ Accès illimité à toutes les rubriques
  ✅ Accès prioritaire nouveautés
  ✅ Durée: 12 mois
```

## Fichiers créés (récapitulatif)

```
lib/
  types/
    grade.types.ts                  ← Types et logique grades
    user-profile.types.ts           ← Types et logique profils
  api/
    services/
      grade.service.ts              ← Services API grades + profils
    endpoints.ts                    ← Ajout endpoints (modifié)
  interfaces.ts                     ← Ajout champs User (modifié)

components/
  profil/
    GradeBadge.tsx                  ← Badge grade + progression
    ProfileTypeBadge.tsx            ← Badge profil + avantages
    GradeWelcomeMessage.tsx         ← Messages initiatiques
    UserProgressSection.tsx         ← Section complète profil
    SubscriptionPlans.tsx           ← Plans d'abonnement

hooks/
  profil/
    useUserProfile.ts               ← Hook unifié grades + profils

app/
  star/
    monprofil/
      ExempleProfilComplet.tsx      ← Page exemple

GUIDES/
  GRADES_PROFILS_BACKEND_GUIDE.md   ← Guide implémentation backend
  GRADES_PROFILS_IMPLEMENTATION.md  ← Documentation complète
  QUICKSTART_GRADES_PROFILS.md      ← Guide démarrage rapide
  ARCHITECTURE_GRADES_PROFILS.md    ← Ce fichier (architecture)
```

## Points d'attention

### Frontend
- ✅ Build validé sans erreurs
- ✅ Types TypeScript complets
- ✅ Composants réutilisables
- ✅ Hooks avec gestion d'erreurs
- ⚠️  Cache désactivé sur page admin/prompts/create

### Backend (à faire)
- 🔲 15 endpoints à créer
- 🔲 Logique de calcul de grade
- 🔲 Middleware vérification accès
- 🔲 CRON expiration abonnements
- 🔲 Notifications montée de grade
- 🔲 Migration données existantes

### Tests
- 🔲 Tests unitaires calcul de grade
- 🔲 Tests accès par profil
- 🔲 Tests expiration abonnement
- 🔲 Tests UI composants
- 🔲 Tests E2E flow complet
