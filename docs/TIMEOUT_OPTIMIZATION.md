# Optimisation des Timeouts - Correction Erreur ECONNABORTED

## Problème identifié
L'erreur **"timeout of 10000ms exceeded"** apparaissait lors du chargement des consultations en page admin. Cela était dû à un timeout insuffisant pour les requêtes volumineuses.

## Solutions apportées

### 1. **Augmentation du timeout Axios global** ⏱️
- **Fichier**: `lib/api/client.ts`
- **Ancienne valeur**: 300000ms (5 minutes, ignorée)
- **Nouvelle valeur**: 45000ms (45 secondes)
- **Raison**: Équilibre entre performance et fiabilité pour requêtes volumineuses

### 2. **Augmentation du timeout par requête** 📡
- **Fichier**: `hooks/consultations/useAdminConsultationsPage.ts`
- **Ancienne valeur**: 10000ms (10 secondes)
- **Nouvelle valeur**: 30000ms (30 secondes)
- **Raison**: Permet à la requête d'attendre plus longtemps le serveur

### 3. **Amélioration de la gestion des erreurs** ⚠️
- **Fichier**: `hooks/consultations/useAdminConsultationsPage.ts`
- **Détection spécifique**:
  - `err.code === 'ECONNABORTED'` → Message "Délai dépassé"
  - `err.message === 'Network Error'` → Message "Erreur réseau"
  - Autres erreurs → Messages appropriés

### 4. **UI d'erreur améliorée** 🎨
- **Fichier**: `components/admin/consultations/ConsultationsError.tsx`
- **Améliorations**:
  - Icône spécifique selon type d'erreur (Clock, Wifi, AlertCircle)
  - Animation de rotation de l'icône
  - Bloc de conseils contextuel et actionnable
  - Design cohérent avec le reste de l'app

## Messages d'erreur affichés

### Timeout
```
❌ Délai dépassé : la requête a pris trop de temps. Veuillez réessayer.
💡 Conseils:
   • Vérifiez votre connexion internet
   • Patientez quelques secondes et réessayez
   • Vérifiez que le serveur backend fonctionne
```

### Erreur réseau
```
❌ Erreur réseau : vérifiez votre connexion internet
💡 Conseils:
   • Vérifiez votre connexion internet
   • Vérifiez l'URL du serveur backend
   • Assurez-vous que le serveur est démarré
```

## Configuration recommandée

### Pour le backend
Assurez-vous que votre serveur Node.js/Express a une limite de timeout haute:
```bash
npm run dev # Devrait afficher le port (ex: :3001)
```

### Pour le frontend
Les timeouts sont maintenant configurés ainsi:
- **Global Axios**: 45 secondes
- **Admin Consultations**: 30 secondes
- **Autres requêtes**: 45 secondes (default)

## Références de délais
- 🟢 < 5s : Très rapide
- 🟡 5-15s : Normal
- 🟠 15-30s : Lent (données volumineuses)
- 🔴 > 30s : Timeout probable

## Tests
Pour tester:
1. Arrêtez le backend
2. Navigez vers `/admin/consultations`
3. Devrait afficher l'erreur réseau avec conseils
4. Redémarrez le backend et cliquez "Réessayer"

## Future optimization
Si les timeouts persistent:
1. Implémenter la **pagination optimisée** côté backend
2. Ajouter de l'**indexation** sur les collections Consultations
3. Implémenter du **cache** avec Redis
4. Diviser les requêtes avec **cursors** au lieu du décalage
