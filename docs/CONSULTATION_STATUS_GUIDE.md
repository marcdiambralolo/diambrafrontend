# Guide d'Utilisation - Système de Statuts de Consultation

## Vue d'ensemble

Le système de statuts de consultation gère 3 états possibles pour les boutons de consultation :

1. **CONSULTER** - Consultation non demandée ou non payée
2. **RÉPONSE EN ATTENTE** - Consultation payée, analyse en cours
3. **VOIR L'ANALYSE** - Analyse notifiée et disponible

## Architecture

### Types
- `lib/types/consultation-status.types.ts` - Types TypeScript pour les statuts
- `ConsultationButtonStatus` - Enum des 3 états possibles
- `ConsultationChoiceStatus` - Interface pour le statut d'un choix

### Service API
- `lib/api/services/consultation-status.service.ts` - Appels API vers le backend
- `getConsultationChoiceStatus()` - Récupère le statut d'un choix
- `getAllConsultationChoicesStatus()` - Récupère les statuts de plusieurs choix

### Hooks
- `hooks/consultations/useConsultationChoiceStatus.ts` - Hooks React personnalisés
- `useConsultationChoiceStatus()` - Pour un choix unique
- `useMultipleConsultationChoicesStatus()` - Pour plusieurs choix (optimisé)

### Composants
- `components/consultations/ConsultationButton.tsx` - Bouton avec 3 états
- `components/consultations/ConsultationChoicesGrid.tsx` - Grille optimisée

## Utilisation

### 1. Bouton Simple (Un Choix)

```tsx
import { useConsultationChoiceStatus } from '@/hooks/consultations/useConsultationChoiceStatus';
import ConsultationButton from '@/components/consultations/ConsultationButton';

function MyComponent() {
  const { user } = useAuth();
  const { status, loading } = useConsultationChoiceStatus(user?._id, choiceId);

  if (loading) return <div>Chargement...</div>;

  return (
    <ConsultationButton
      status={status.buttonStatus}
      choiceId={choiceId}
      consultationId={status.consultationId}
      onConsult={() => handleConsult()}
    />
  );
}
```

### 2. Grille de Choix (Optimisé)

```tsx
import ConsultationChoicesGrid from '@/components/consultations/ConsultationChoicesGrid';

function MyPage() {
  const choices: ConsultationChoice[] = [...]; // Vos choix

  return (
    <ConsultationChoicesGrid
      choices={choices}
      onSelectChoice={(choice) => handleSelect(choice)}
      title="Choisissez votre consultation"
    />
  );
}
```

### 3. Statuts Multiples Personnalisés

```tsx
import { useMultipleConsultationChoicesStatus } from '@/hooks/consultations/useConsultationChoiceStatus';

function MyCustomComponent() {
  const { user } = useAuth();
  const choiceIds = ['id1', 'id2', 'id3'];
  
  const { 
    statuses, 
    loading, 
    getStatusByChoiceId,
    getButtonStatus 
  } = useMultipleConsultationChoicesStatus(user?._id, choiceIds);

  // Récupérer un statut spécifique
  const status = getStatusByChoiceId('id1');
  
  // Ou juste le statut du bouton
  const buttonStatus = getButtonStatus('id1');

  return (
    <div>
      {statuses.map(status => (
        <div key={status.choiceId}>
          {status.choiceTitle}: {status.buttonStatus}
        </div>
      ))}
    </div>
  );
}
```

### 4. Intégration dans un Composant Existant

```tsx
// Avant
<button onClick={onSelect}>Consulter</button>

// Après
import { useConsultationChoiceStatus } from '@/hooks/consultations/useConsultationChoiceStatus';
import ConsultationButton from '@/components/consultations/ConsultationButton';

const { user } = useAuth();
const { status, loading } = useConsultationChoiceStatus(user?._id, choice._id);

{loading ? (
  <div>Chargement...</div>
) : status ? (
  <ConsultationButton
    status={status.buttonStatus}
    choiceId={choice._id}
    consultationId={status.consultationId}
    onConsult={onSelect}
  />
) : (
  <button onClick={onSelect}>Consulter</button>
)}
```

## Endpoints Backend (Requis)

Le backend doit implémenter ces endpoints :

### 1. Statut d'un Choix
```
GET /consultation-choice-status/:userId/:choiceId
```

Réponse :
```json
{
  "choiceId": "507f1f77bcf86cd799439011",
  "choiceTitle": "Thème astral complet",
  "buttonStatus": "CONSULTER",
  "hasActiveConsultation": false,
  "consultationId": null
}
```

### 2. Statuts Multiples
```
GET /consultation-choice-status/:userId
GET /consultation-choice-status/:userId?choiceIds=id1,id2,id3
```

Réponse :
```json
{
  "userId": "507f1f77bcf86cd799439012",
  "choices": [
    {
      "choiceId": "507f1f77bcf86cd799439011",
      "choiceTitle": "Thème astral complet",
      "buttonStatus": "CONSULTER",
      "hasActiveConsultation": false
    },
    {
      "choiceId": "507f1f77bcf86cd799439013",
      "choiceTitle": "Numérologie personnelle",
      "buttonStatus": "RÉPONSE EN ATTENTE",
      "hasActiveConsultation": true,
      "consultationId": "507f1f77bcf86cd799439014"
    }
  ]
}
```

## Logique Backend

Le backend détermine le statut selon cette logique :

```typescript
function getButtonStatus(consultation) {
  if (!consultation || !consultation.isPaid) {
    return 'CONSULTER';
  }
  
  if (consultation.isPaid && !consultation.analysisNotified) {
    return 'RÉPONSE EN ATTENTE';
  }
  
  if (consultation.isPaid && consultation.analysisNotified) {
    return "VOIR L'ANALYSE";
  }
}
```

## Mise à Jour du Champ `analysisNotified`

Après avoir généré et notifié l'analyse :

```typescript
// Backend
await consultationModel.findByIdAndUpdate(
  consultationId,
  { analysisNotified: true },
  { new: true }
);
```

## Personnalisation

### Modifier les Couleurs du Bouton

```tsx
<ConsultationButton
  status={status.buttonStatus}
  choiceId={choiceId}
  consultationId={consultationId}
  onConsult={handleConsult}
  className="custom-gradient-class"
/>
```

### Modifier la Taille du Bouton

```tsx
<ConsultationButton
  status={status.buttonStatus}
  choiceId={choiceId}
  size="sm" // 'sm' | 'md' | 'lg'
/>
```

## Gestion des Erreurs

```tsx
const { status, loading, error, refetch } = useConsultationChoiceStatus(userId, choiceId);

if (error) {
  return (
    <div className="error">
      <p>{error}</p>
      <button onClick={refetch}>Réessayer</button>
    </div>
  );
}
```

## Performance

### Optimisation 1 : Grille de Choix
Utilisez `ConsultationChoicesGrid` qui fait **1 seul appel API** pour tous les choix au lieu de N appels.

### Optimisation 2 : Cache Côté Client
Les hooks mémorisent les résultats avec `useCallback` pour éviter les re-renders inutiles.

### Optimisation 3 : Chargement Conditionnel
```tsx
// Ne charger que si l'utilisateur est connecté
const { status } = useConsultationChoiceStatus(
  user?._id,  // undefined si pas connecté
  choiceId
);
```

## Migration des Données Existantes

Si vous avez des consultations sans le champ `analysisNotified` :

```typescript
// Script de migration (backend)
await db.consultations.updateMany(
  { analysisNotified: { $exists: false } },
  { $set: { analysisNotified: false } }
);

// Mettre à jour les consultations avec résultat existant
await db.consultations.updateMany(
  { 
    result: { $exists: true, $ne: null },
    analysisNotified: { $exists: false }
  },
  { $set: { analysisNotified: true } }
);
```

## Tests

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import ConsultationButton from '@/components/consultations/ConsultationButton';
import { ConsultationButtonStatus } from '@/lib/types/consultation-status.types';

test('affiche le bon label selon le statut', () => {
  render(
    <ConsultationButton
      status={ConsultationButtonStatus.CONSULTER}
      choiceId="123"
    />
  );
  
  expect(screen.getByText('Consulter')).toBeInTheDocument();
});

test('désactive le bouton pour REPONSE_EN_ATTENTE', () => {
  render(
    <ConsultationButton
      status={ConsultationButtonStatus.REPONSE_EN_ATTENTE}
      choiceId="123"
    />
  );
  
  const button = screen.getByRole('button');
  expect(button).toBeDisabled();
});
```

## Débogage

### Vérifier l'État du Bouton
```tsx
const { status } = useConsultationChoiceStatus(userId, choiceId);
console.log('Button status:', status?.buttonStatus);
console.log('Has consultation:', status?.hasActiveConsultation);
console.log('Consultation ID:', status?.consultationId);
```

### Vérifier les Appels API
Ouvrez les DevTools → Network → Filter "consultation-choice-status"

## Questions Fréquentes

**Q: Le bouton n'affiche pas le bon statut ?**
R: Vérifiez que le backend retourne bien `analysisNotified: true` après notification.

**Q: Comment forcer un rafraîchissement ?**
R: Utilisez la fonction `refetch` retournée par le hook.

**Q: Puis-je utiliser ce système sans le backend ?**
R: Non, le backend doit implémenter les endpoints pour déterminer les statuts.

**Q: Le statut ne se met pas à jour automatiquement ?**
R: C'est normal. Appelez `refetch()` après une action (paiement, notification) ou implémentez des WebSockets.
