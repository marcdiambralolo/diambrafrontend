# Système de Gestion des Statuts du Bouton de Consultation

## 📋 Vue d'ensemble

Le système gère automatiquement **3 états différents** pour le bouton de consultation :

### 1️⃣ **CONSULTER** 
- **Condition** : La consultation n'a pas encore été demandée OU pas finalisée avec offrande (non payée)
- **Apparence** : Bouton violet/fuchsia avec icône ✨ Sparkles
- **Action** : Déclenche le callback `onConsult()` pour commencer une nouvelle consultation

### 2️⃣ **RÉPONSE EN ATTENTE**
- **Condition** : La consultation a été payée MAIS l'analyse n'a pas encore été générée et notifiée
- **Apparence** : Bouton orange/ambre avec icône ⏰ Clock (animée)
- **Action** : Bouton désactivé (non cliquable), affichage de l'état d'attente

### 3️⃣ **VOIR L'ANALYSE**
- **Condition** : La consultation a été notifiée et l'analyse est disponible
- **Apparence** : Bouton vert émeraude avec icône 👁️ Eye
- **Action** : Redirige vers `/star/consultations/{consultationId}`

---

## 🏗️ Architecture

### Composants principaux

```
ConsultationCard (UI)
    ↓ utilise
useConsultationChoiceStatus (Hook)
    ↓ appelle
consultation-status.service (API)
    ↓ retourne
ConsultationChoiceStatus
    ↓ contient
ConsultationButtonStatus (Enum)
    ↓ passé à
ConsultationButton (Bouton intelligent)
```

### Fichiers clés

1. **`lib/types/consultation-status.types.ts`**
   - Définit l'enum `ConsultationButtonStatus` avec les 3 états
   - Définit l'interface `ConsultationChoiceStatus`

2. **`lib/api/services/consultation-status.service.ts`**
   - `getConsultationChoiceStatus(userId, choiceId)` - Statut d'un choix
   - `getAllConsultationChoicesStatus(userId, choiceIds?)` - Statuts multiples

3. **`hooks/consultations/useConsultationChoiceStatus.ts`**
   - Hook React qui charge et gère le statut
   - Gère loading, error, refetch

4. **`components/consultations/ConsultationButton.tsx`**
   - Bouton intelligent qui s'adapte selon le statut
   - Gère les 3 apparences et comportements

5. **`components/vie-personnelle/ConsultationCard.tsx`**
   - Carte d'affichage d'un choix de consultation
   - Intègre automatiquement le système de statut

---

## 🔄 Flow de données

### Côté Backend (API à implémenter)

L'endpoint doit analyser :

```typescript
GET /api/v1/consultation-choice-status/:userId/:choiceId

Logique backend :
1. Chercher consultation(s) pour ce userId + choiceId
2. Si aucune consultation OU dernière consultation status='pending_payment' 
   → Retourner CONSULTER
3. Si consultation status='paid' OU 'processing' OU 'PENDING'
   → Retourner REPONSE_EN_ATTENTE
4. Si consultation status='completed' OU 'REPONDU' ET notifiedAt existe
   → Retourner VOIR_ANALYSE + consultationId

Réponse :
{
  "choiceId": "673abc123...",
  "choiceTitle": "Votre destinée amoureuse",
  "buttonStatus": "REPONSE_EN_ATTENTE",
  "hasActiveConsultation": true,
  "consultationId": "673def456..."
}
```

### Côté Frontend

```typescript
// Dans ConsultationCard
const { status, loading } = useConsultationChoiceStatus(user?._id, choice._id);

// Status contient :
{
  buttonStatus: ConsultationButtonStatus.REPONSE_EN_ATTENTE,
  consultationId: "673def456...",
  hasActiveConsultation: true
}

// Passé à ConsultationButton qui affiche automatiquement le bon état
<ConsultationButton
  status={status.buttonStatus}
  consultationId={status.consultationId}
  onConsult={onSelect}
/>
```

---

## 🎨 Apparences visuelles

### État CONSULTER
```tsx
Couleur : Dégradé violet → fuchsia (purple-600 to fuchsia-600)
Icône : ✨ Sparkles
Hover : Scale 1.05 + ombre
Désactivé : Non
Animation : Oui
```

### État RÉPONSE EN ATTENTE
```tsx
Couleur : Dégradé ambre → orange (amber-500 to orange-500)
Icône : ⏰ Clock (avec animation pulse)
Hover : Aucun
Désactivé : Oui (opacity-70, cursor-not-allowed)
Animation : Non (sauf l'icône)
```

### État VOIR L'ANALYSE
```tsx
Couleur : Dégradé émeraude → sarcelle (emerald-600 to teal-600)
Icône : 👁️ Eye
Hover : Scale 1.05 + ombre
Désactivé : Non
Animation : Oui
```

---

## 🧪 Test du système

### Scénario 1 : Nouvelle consultation
1. Utilisateur voit un choix jamais consulté
2. Statut API : `CONSULTER`
3. Bouton violet "Consulter" cliquable
4. Clic → Lance le flow de création de consultation

### Scénario 2 : Consultation en cours
1. Utilisateur a créé une consultation et payé
2. Backend génère l'analyse (status = 'processing')
3. Statut API : `REPONSE_EN_ATTENTE`
4. Bouton orange "Réponse en attente" désactivé avec animation

### Scénario 3 : Analyse disponible
1. Backend a terminé l'analyse (status = 'REPONDU')
2. Notification envoyée (notifiedAt renseigné)
3. Statut API : `VOIR_ANALYSE` + consultationId
4. Bouton vert "Voir l'analyse" cliquable
5. Clic → Redirige vers `/star/consultations/{id}`

---

## 🔧 Intégration dans les pages

### Page de catégorie (RubriqueViewMultiPage)

```tsx
// Le composant charge automatiquement les statuts
<Slide4SectionSelection
  onSelect={handleSelectConsultation}
  choices={choices}
  alreadyDoneChoices={alreadyDoneChoices}
  choicesWithCount={choicesWithCount}
/>

// Chaque ConsultationCard appelle useConsultationChoiceStatus
// Le bouton s'adapte automatiquement
```

### Consultations répétables

Pour les consultations avec `frequence !== 'UNE_FOIS_VIE'` :
- Le bouton de statut est toujours affiché
- Un bouton "Historique" supplémentaire apparaît
- Permet de consulter les analyses précédentes

---

## ⚠️ Points importants

### Backend requis
Le backend **doit** implémenter l'endpoint :
```
GET /api/v1/consultation-choice-status/:userId/:choiceId
```

### Gestion du cache
Le hook recharge le statut à chaque montage du composant.
Pour forcer un rafraîchissement :
```tsx
const { status, loading, refetch } = useConsultationChoiceStatus(userId, choiceId);
// Appeler refetch() après une action
```

### Consultations multiples
Pour optimiser les performances, utilisez :
```tsx
import { useMultipleConsultationChoicesStatus } from '@/hooks/consultations/useConsultationChoiceStatus';

const { statuses, loading } = useMultipleConsultationChoicesStatus(userId, choiceIds);
```

---

## 🎯 Checklist de vérification

- [ ] Backend implémente `/consultation-choice-status/:userId/:choiceId`
- [ ] Logique backend retourne le bon statut selon l'état de la consultation
- [ ] ConsultationCard utilise useConsultationChoiceStatus
- [ ] ConsultationButton reçoit le statut correct
- [ ] Les 3 états s'affichent avec les bonnes couleurs
- [ ] État CONSULTER lance le flow de création
- [ ] État VOIR_ANALYSE redirige vers la bonne consultation
- [ ] État REPONSE_EN_ATTENTE est désactivé

---

## 🐛 Debugging

### Le bouton reste sur CONSULTER
→ Vérifier que le backend retourne bien le statut de la consultation existante

### Le bouton ne passe pas à VOIR_ANALYSE
→ Vérifier que `notifiedAt` est bien renseigné dans la consultation

### Erreur de chargement
→ Vérifier les logs dans la console : `useConsultationChoiceStatus`

### Bouton non cliquable sur VOIR_ANALYSE
→ Vérifier que `consultationId` est bien passé au composant

---

## 📚 Références

- [consultation-status.types.ts](lib/types/consultation-status.types.ts)
- [ConsultationButton.tsx](components/consultations/ConsultationButton.tsx)
- [useConsultationChoiceStatus.ts](hooks/consultations/useConsultationChoiceStatus.ts)
- [ConsultationCard.tsx](components/vie-personnelle/ConsultationCard.tsx)
