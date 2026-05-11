# ⚡ Quick Reference - Système des Grades (Admin)

**Résumé de poche pour les développeurs frontend/backend.**

---

## 🎯 Qu'est-ce que c'est en 30 secondes

Admin interface pour configurer les 9 grades initiatiques de Mon Étoile.  
Chaque grade peut accéder à N'IMPORTE QUELS choix de consultations du projet.

```
Grade ASPIRANT  → Peut avoir [Tarot, Astrologie, Numerologie, ...]
Grade SAGE      → Peut avoir [Oracle, Runes, Cristaux, Astrologie, ...]
```

---

## 📁 Fichiers Créés (Frontend)

| Fichier | Rôle |
|---------|------|
| `lib/types/grade-config.types.ts` | Interfaces TypeScript |
| `lib/api/services/grade-config.service.ts` | Appels API |
| `hooks/admin/useAdminGradesPage.ts` | Logique métier + état |
| `components/admin/grades/AdminGradesPage.tsx` | Page master |
| `components/admin/grades/GradeCard.tsx` | Carte grade (édition) |
| `components/admin/grades/GradesList.tsx` | Liste grades |
| `components/admin/grades/TopBar.tsx` | Statistiques |
| `components/admin/grades/ReloadButtons.tsx` | Boutons rechargement |
| `components/admin/grades/Banner.tsx` | Notifications |
| `app/admin/grades/page.tsx` | Route Next.js |

---

## 🔌 API Endpoints Requis (Backend)

### GET /admin/grades
Retourne tous les grades avec configuration.

```typescript
Response: GradeConfig[]  // 9 grades
```

### GET /admin/consultation-choices
Retourne TOUS les choix de TOUTES les rubriques.

```typescript
Response: ConsultationChoice[]  // 30-50+ choix
```

### PATCH /admin/grades/:id
Met à jour un grade.

```typescript
Body: {
  consultationChoiceIds?: string[];  // IDs des choix à assigner
  nextGradeId?: string | null;       // ID du grade suivant
  description?: string;              // Optionnel
}
Response: GradeConfig
```

### PATCH /admin/grades/:id/next-grade
Met à jour uniquement le grade suivant.

```typescript
Body: { nextGradeId: string | null }
Response: GradeConfig
```

---

## 📊 Modèles de Données

### GradeConfig (Réponse API)

```typescript
{
  _id: string;  // MongoDB ObjectId
  grade: Grade; // ASPIRANT | CONTEMPLATEUR | ...
  level: number; // 1-9
  name: string;
  requirements: {
    consultations: number;
    rituels: number;
    livres: number;
  };
  consultationChoices: [
    {
      choiceId: string;
      title: string;
      description: string;
      frequence: FrequenceConsultation;
      participants: TypeParticipants;
      order?: number;
    }
  ];
  nextGradeId: string | null;
}
```

### ConsultationChoice (Réponse API)

```typescript
{
  choiceId: string;
  title: string;
  description: string;
  frequence: FrequenceConsultation;
  participants: TypeParticipants;
  offering: { price?: number; alternatives: [...] };
  rubriqueTitle?: string;  // Titre rubrique source
  rubriqueId?: string;     // ID rubrique source
}
```

---

## 🎨 Composants - Utilisation

### AdminGradesPage (Page Master)

```typescript
'use client';
import { useAdminGradesPage } from '@/hooks/admin/useAdminGradesPage';

export default function AdminGradesPage() {
  const { gradeConfigs, banner, editingId, ... } = useAdminGradesPage();
  return (
    <>
      <TopBar counts={counts} />
      <GradesList gradeConfigs={gradeConfigs} ... />
      <Banner banner={banner} />
    </>
  );
}
```

### GradeCard

```typescript
// Mode Lecture
<GradeCard grade={grade} isEditing={false} onEdit={startEdit} ... />

// Mode Édition
<GradeCard 
  grade={grade} 
  isEditing={true} 
  availableChoices={availableChoices}
  onSave={updateGrade}
  onCancel={stopEdit}
  ... 
/>
```

---

## 🔄 Flux Complet

```
1. Page charge → useAdminGradesPage() initialise
2. Fetch GET /admin/grades → gradeConfigs
3. Fetch GET /admin/consultation-choices → availableChoices
4. Render GradeCard × 9
5. Admin clique Edit
6. Toggle choix via checkbox
7. Sélectionne grade suivant via dropdown
8. Clique Enregistrer
9. PATCH /admin/grades/:id
10. Backend valide et sauvegarde
11. Re-fetch GET /admin/grades
12. Banner success
13. Retour lecture
```

---

## ✅ Validations

### Frontend

- ✅ `nextGradeId.level > currentGrade.level`
- ✅ Ne pas permettre modifier `requirements`
- ✅ Afficher erreur si choix invalide
- ✅ Disabled button si chargement

### Backend (à implémenter)

- ✅ Rôle ADMIN requis
- ✅ Tous les `choiceIds` existent
- ✅ `nextGradeId.level > current.level` (si défini)
- ✅ Pas de cycle (A→B→C→A)
- ✅ Enrichir les choix avec titre, description

---

## 🚀 Intégration Checklist

- [ ] Backend endpoints implémentés
- [ ] MongoDB collection `grades` initialisée (9 grades)
- [ ] GET /admin/grades fonctionne
- [ ] GET /admin/consultation-choices retourne 30-50+ choix
- [ ] PATCH /admin/grades/:id valide et sauvegarde
- [ ] Frontend build sans erreur
- [ ] Route `/admin/grades` accessible
- [ ] Admin peut voir 9 grades
- [ ] Admin peut éditer un grade
- [ ] Choix se chargent et s'affichent
- [ ] Sauvegarde fonctionne
- [ ] Banner notifications OK
- [ ] Dark mode fonctionne
- [ ] Responsive mobile OK

---

## 🐛 Debug Rapide

### Les grades ne chargent pas

```typescript
// Dans useAdminGradesPage
const fetchGrades = useCallback(async () => {
  try {
    const data = await gradeConfigService.getAllGradeConfigs();
    console.log('✓ Grades:', data);
  } catch (err) {
    console.error('✗ Erreur:', err.response?.data);
  }
}, []);
```

### Les choix ne s'affichent pas

```typescript
// Vérifier endpoint
GET http://localhost:3001/admin/consultation-choices

// Doit retourner array avec 30-50+ éléments
// Si vide → vérifier que rubriques ont consultationChoices
```

### Sauvegarde échoue

```typescript
// Vérifier format
{
  consultationChoiceIds: ["choice_abc", "choice_def"],  // Array!
  nextGradeId: "507f1f77bcf86cd799439012"               // Ou null
}

// Backend doit vérifier:
// 1. Tous les choiceIds existent dans MongoDB
// 2. nextGradeId est un ObjectId valide
// 3. nextGrade.level > currentGrade.level
```

---

## 📝 Notes Importantes

1. **9 grades fixes** - Ne jamais créer/supprimer grades
2. **Prérequis immuables** - Ne jamais modifier consultations/rituels/livres (sauf backend)
3. **Choix dynamiques** - Peuvent changer sans code
4. **Mélange libre** - Un grade peut avoir n'importe quel choix
5. **Pas de duplication** - Même choix peut être dans plusieurs grades

---

## 🎯 Cas d'Usage Typiques

**Configuration basique**
- ASPIRANT : 2-3 choix
- CONTEMPLATEUR : 3-4 choix
- SAGE : 6-8 choix
- MAITRE_DE_SOI : Tous les choix (10-15)

**Mélange multi-rubrique**
- ASPIRANT : [Tarot, Astrologie africaine]
- CONSCIENT : [Numerologie, Runes, Cristaux]
- SAGE : [Oracle, Pendule, Horoscope, Tarot avancé]

---

## 📚 Documents Complets

- **`ADMIN_GRADES_COMPLETE_GUIDE.md`** - Guide complet (50+ pages)
- **`CONSULTATION_CHOICES_MULTI_RUBRIQUES.md`** - Guide choix multi-rubrique
- **`components/admin/grades/README.md`** - Doc locale

---

## 👥 Qui Fait Quoi

| Role | Responsabilité |
|------|-----------------|
| **Backend Dev** | Endpoints API, validation, MongoDB |
| **Frontend Dev** | Composants, hooks, intégration UI |
| **Admin User** | Configuration des grades via UI |
| **DevOps** | Déploiement, monitoring |

---

## 💨 Quick Start (Backend)

```typescript
// 1. Initialiser grades
const grades = [
  { grade: "ASPIRANT", level: 1, requirements: {...}, consultationChoices: [], nextGradeId: null },
  // ... 8 autres grades
];
db.grades.insertMany(grades);

// 2. Implémenter GET /admin/grades
@Get('grades')
async getAllGrades() {
  return this.gradeService.findAll();
}

// 3. Implémenter GET /admin/consultation-choices
@Get('consultation-choices')
async getChoices() {
  const rubriques = await this.rubriqueService.findAll();
  return rubriques.flatMap(r => r.consultationChoices);
}

// 4. Implémenter PATCH /admin/grades/:id
@Patch('grades/:id')
async updateGrade(@Param('id') id: string, @Body() dto: UpdateGradeConfigDto) {
  // Validation + sauvegarde
  return this.gradeService.update(id, dto);
}
```

---

## 💨 Quick Start (Frontend)

```typescript
// 1. Utiliser le hook
const { gradeConfigs, updateGrade, ... } = useAdminGradesPage();

// 2. Render liste
{gradeConfigs.map(g => <GradeCard grade={g} ... />)}

// 3. Édition
<GradeCard 
  grade={grade} 
  availableChoices={availableChoices}
  onSave={(id, data) => updateGrade(id, data)}
/>

// 4. C'est tout!
```

---

## 🔗 Dépendances

```json
{
  "dependencies": {
    "axios": "^1.x",           // API calls
    "framer-motion": "^10.x",  // Animations
    "lucide-react": "^0.300",  // Icons
    "react": "^18.x",
    "next": "^14.x"
  }
}
```

---

## 📞 Support

Pour toute question :
1. Consultez les guides complets (liens ci-dessus)
2. Vérifiez le code source dans les fichiers créés
3. Contactez le lead technique

---

**État** : ✅ Prêt pour l'intégration backend  
**Dernière mise à jour** : 15 février 2026
