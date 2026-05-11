# API Backend - Statut des Consultations

## 🎯 Objectif

Implémenter l'endpoint backend qui retourne le statut du bouton de consultation selon 3 états :
1. **CONSULTER** - Nouvelle consultation
2. **RÉPONSE EN ATTENTE** - Payée mais analyse non notifiée
3. **VOIR L'ANALYSE** - Analyse notifiée et disponible

---

## 📋 Endpoint à Implémenter

### 1. Statut d'un choix spécifique

```http
GET /consultation-choice-status/:userId/:choiceId
```

**Logique Backend :**

```typescript
async getConsultationChoiceStatus(userId: string, choiceId: string) {
  // 1. Récupérer le choix de consultation pour avoir le titre
  const choice = await this.choiceModel.findById(choiceId);
  if (!choice) {
    throw new NotFoundException('Choix de consultation non trouvé');
  }

  // 2. Chercher une consultation pour cet utilisateur et ce choix
  const consultation = await this.consultationModel.findOne({
    clientId: userId,
    'choice._id': choiceId
  }).sort({ createdAt: -1 }); // Prendre la plus récente

  // 3. Déterminer le statut du bouton
  let buttonStatus: string;
  let hasActiveConsultation = false;
  let consultationId: string | null = null;

  if (!consultation || !consultation.isPaid) {
    // Cas 1: Pas de consultation OU consultation non payée
    buttonStatus = 'CONSULTER';
  } else if (consultation.isPaid && !consultation.analysisNotified) {
    // Cas 2: Payée mais analyse pas encore notifiée
    buttonStatus = 'RÉPONSE EN ATTENTE';
    hasActiveConsultation = true;
    consultationId = consultation._id.toString();
  } else {
    // Cas 3: Analyse notifiée
    buttonStatus = "VOIR L'ANALYSE";
    hasActiveConsultation = true;
    consultationId = consultation._id.toString();
  }

  return {
    choiceId: choice._id.toString(),
    choiceTitle: choice.title,
    buttonStatus,
    hasActiveConsultation,
    consultationId
  };
}
```

**Réponse Attendue :**

```json
{
  "choiceId": "507f1f77bcf86cd799439011",
  "choiceTitle": "Thème astral complet",
  "buttonStatus": "CONSULTER",
  "hasActiveConsultation": false,
  "consultationId": null
}
```

---

### 2. Statuts de tous les choix d'un utilisateur

```http
GET /consultation-choice-status/:userId
GET /consultation-choice-status/:userId?choiceIds=id1,id2,id3
```

**Logique Backend :**

```typescript
async getAllConsultationChoicesStatus(
  userId: string, 
  choiceIds?: string[]
) {
  // 1. Récupérer les choix à traiter
  const query = choiceIds && choiceIds.length > 0 
    ? { _id: { $in: choiceIds } }
    : {};
  
  const choices = await this.choiceModel.find(query);

  // 2. Pour chaque choix, obtenir son statut
  const choicesStatus = await Promise.all(
    choices.map(async (choice) => {
      return await this.getConsultationChoiceStatus(
        userId, 
        choice._id.toString()
      );
    })
  );

  return {
    userId,
    choices: choicesStatus
  };
}
```

**Réponse Attendue :**

```json
{
  "userId": "507f1f77bcf86cd799439012",
  "choices": [
    {
      "choiceId": "507f1f77bcf86cd799439011",
      "choiceTitle": "Thème astral complet",
      "buttonStatus": "CONSULTER",
      "hasActiveConsultation": false,
      "consultationId": null
    },
    {
      "choiceId": "507f1f77bcf86cd799439013",
      "choiceTitle": "Numérologie personnelle",
      "buttonStatus": "RÉPONSE EN ATTENTE",
      "hasActiveConsultation": true,
      "consultationId": "507f1f77bcf86cd799439014"
    },
    {
      "choiceId": "507f1f77bcf86cd799439015",
      "choiceTitle": "Compatibilité amoureuse",
      "buttonStatus": "VOIR L'ANALYSE",
      "hasActiveConsultation": true,
      "consultationId": "507f1f77bcf86cd799439016"
    }
  ]
}
```

---

### 3. Statuts par catégorie

```http
GET /consultation-choice-status/:userId/category/:category
```

**Logique Backend :**

```typescript
async getConsultationChoicesStatusByCategory(
  userId: string,
  category: string
) {
  // 1. Récupérer tous les choix de la catégorie
  const choices = await this.choiceModel.find({ category });

  // 2. Obtenir le statut de chaque choix
  const choicesStatus = await Promise.all(
    choices.map(async (choice) => {
      return await this.getConsultationChoiceStatus(
        userId, 
        choice._id.toString()
      );
    })
  );

  return {
    userId,
    choices: choicesStatus
  };
}
```

---

## 🔄 Mise à Jour de `analysisNotified`

### Quand marquer une analyse comme notifiée ?

Le champ `analysisNotified` doit être mis à `true` lorsque :

1. ✅ L'analyse a été générée (`result` existe)
2. ✅ L'utilisateur a été notifié (email/push/autre)
3. ✅ L'analyse est disponible pour consultation

**Exemple :**

```typescript
// Dans le service qui génère l'analyse
async notifyAnalysisComplete(consultationId: string) {
  // 1. Générer l'analyse
  const analysis = await this.generateAnalysis(consultationId);
  
  // 2. Enregistrer l'analyse
  await this.consultationModel.findByIdAndUpdate(
    consultationId,
    { 
      result: analysis,
      status: 'REPONDU'
    }
  );

  // 3. Envoyer la notification à l'utilisateur
  await this.notificationService.sendAnalysisNotification(consultationId);

  // 4. Marquer comme notifié
  await this.consultationModel.findByIdAndUpdate(
    consultationId,
    { analysisNotified: true },
    { new: true }
  );

  console.log(`✅ Analyse ${consultationId} notifiée à l'utilisateur`);
}
```

---

## 📊 Structure de la Collection `consultations`

Champs nécessaires :

```typescript
{
  _id: ObjectId,
  clientId: ObjectId,        // Référence utilisateur
  choice: {
    _id: string,             // ID du choix
    title: string,
    description: string,
    // ... autres champs
  },
  isPaid: boolean,           // ✅ true si offrande finalisée
  analysisNotified: boolean, // ✅ true si analyse notifiée
  result: string,            // Contenu de l'analyse
  status: string,            // 'PENDING' | 'paid' | 'REPONDU'
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔄 Migration des Données Existantes

Si des consultations existent déjà sans `analysisNotified` :

```typescript
// Migration script
async migrateExistingConsultations() {
  // 1. Initialiser à false pour toutes les consultations
  await this.consultationModel.updateMany(
    { analysisNotified: { $exists: false } },
    { $set: { analysisNotified: false } }
  );

  // 2. Mettre à true pour celles qui ont déjà un résultat
  await this.consultationModel.updateMany(
    { 
      result: { $exists: true, $ne: null, $ne: '' },
      analysisNotified: { $ne: true }
    },
    { $set: { analysisNotified: true } }
  );

  console.log('✅ Migration completed');
}
```

---

## 🧪 Tests Backend

### Test 1 : Nouvelle consultation

```bash
curl http://localhost:3001/consultation-choice-status/USER_ID/CHOICE_ID
```

**Résultat attendu :** `buttonStatus: "CONSULTER"`

---

### Test 2 : Consultation payée en attente

1. Créer une consultation avec `isPaid: true`, `analysisNotified: false`
2. Appeler l'endpoint
   
**Résultat attendu :** `buttonStatus: "RÉPONSE EN ATTENTE"`

---

### Test 3 : Analyse disponible

1. Créer une consultation avec `isPaid: true`, `analysisNotified: true`
2. Appeler l'endpoint
   
**Résultat attendu :** `buttonStatus: "VOIR L'ANALYSE"`

---

## 🎨 Frontend - Déjà Implémenté ✅

Le frontend est 100% prêt et attend simplement que le backend retourne les bonnes données :

### Composants Frontend :
- ✅ `ConsultationButton.tsx` - Bouton avec 3 états visuels
- ✅ `ConsultationCard.tsx` - Carte qui intègre le bouton
- ✅ `useConsultationChoiceStatus` - Hook React pour fetch
- ✅ `consultation-status.service.ts` - Service API

### Comportements Frontend :
- **CONSULTER** → Lance le flux de consultation (formulaire → paiement)
- **RÉPONSE EN ATTENTE** → Bouton désactivé avec animation pulse 🕐
- **VOIR L'ANALYSE** → Redirige vers `/star/consultations/{id}` 👁️

---

## 🚀 Priorité d'Implémentation

1. **Ajouter le champ `analysisNotified`** au schéma Consultation
2. **Implémenter l'endpoint** `GET /consultation-choice-status/:userId/:choiceId`
3. **Mettre à jour le service de notification** pour marquer `analysisNotified = true`
4. **Migrer les données existantes** si nécessaire
5. **Tester** avec le frontend

**Une fois fait, le système fonctionnera automatiquement ! 🎉**
