# Spécification du formulaire d’inscription Médium (Frontend → Backend)

## Endpoint
POST `/users/register-medium` (multipart/form-data)

## Format d’envoi (clé → type → description)

- `spiritualName` : string — Nom spirituel du médium
- `spiritualQuote` : string — Devise ou phrase spirituelle
- `presentation` : string — Présentation du parcours spirituel
- `specialties[]` : string[] — Liste des spécialités divinatoires (cases à cocher)
- `specialtyOther` : string — Spécialité personnalisée (champ texte)
- `domains[]` : string[] — Domaines de consultation (cases à cocher)
- `methods[]` : string[] — Méthodes de consultation (cases à cocher)
- `experience` : string — Années d’expérience (valeurs : "1-3", "3-5", "5-10", "10-20", ">20")
- `message` : string — Message d’accueil affiché aux consultants
- `fullName` : string — Nom complet (privé)
- `phone` : string — Téléphone (privé)
- `email` : string — Email (privé)
- `country` : string — Pays (privé, liste déroulante)
- `city` : string — Ville (privé)
- `photo` : File (JPG/PNG) — Photo de profil (obligatoire)
- `idPhoto` : File (JPG/PNG, optionnel) — Photo de pièce d’identité (optionnelle)
- `ethical` : string ('true'/'false') — Engagement éthique (case à cocher obligatoire)
- `videoLink` : string — Lien vidéo de présentation (YouTube, TikTok, etc.)

## Remarques techniques
- Le frontend envoie toutes les données via `FormData` (multipart/form-data).
- Les champs à choix multiples (`specialties`, `domains`, `methods`) sont envoyés sous forme de tableaux indexés :
  - `specialties[0]`, `specialties[1]`, ...
  - `domains[0]`, ...
  - `methods[0]`, ...
- Les fichiers sont envoyés dans les clés `photo` (obligatoire) et `idPhoto` (optionnel).
- Le champ `ethical` est une string 'true' ou 'false'.
- Tous les champs texte sont en UTF-8.

## Validation côté frontend
- La photo de profil est requise.
- L’engagement éthique doit être coché.
- Les autres champs sont validés côté frontend (required, email, etc.).

## Exemple de payload (FormData)

```
spiritualName: "Oracle Kemi"
spiritualQuote: "La lumière révèle toujours la vérité"
presentation: "J’ai découvert mes dons à l’enfance..."
specialties[0]: "Tarot"
specialties[1]: "Astrologie"
specialtyOther: "Cartomancie intuitive"
domains[0]: "Amour et relations"
domains[1]: "Travail et carrière"
methods[0]: "Chat écrit"
methods[1]: "Appel vidéo"
experience: "5-10"
message: "Je suis là pour éclairer votre chemin."
fullName: "Marie Dupont"
phone: "+33612345678"
email: "marie@exemple.com"
country: "France"
city: "Paris"
photo: (fichier JPG)
idPhoto: (fichier JPG, optionnel)
ethical: "true"
videoLink: "https://youtube.com/shorts/abc123"
```

## À prévoir côté backend
- Accepter le format multipart (FormData)
- Gérer les tableaux indexés pour specialties/domains/methods
- Vérifier la présence de la photo de profil et de l’engagement éthique
- Stocker les fichiers reçus (photo, idPhoto)
- Valider les emails, téléphones, etc. selon les besoins métier
