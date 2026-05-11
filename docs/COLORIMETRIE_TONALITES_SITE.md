# Charte Colorimetrie & Tonalites du Site

Cette charte verrouille la direction visuelle globale du site pour garantir une ambiance coherente sur toutes les pages (public, star, profil, admin, offline).

## Palette de reference

### Noyau identitaire
- Primary (indigo nuit): #1E154A
- Secondary (amethyste): #5C3D8F
- Accent premium (or stellaire): #C2913B
- Accent secondaire (azur celeste): #7098C4

### Pastels de support
- Rose mature: #C9A0AC
- Sauge: #6B9E94
- Ciel d'aube: #8AAEC6

### Fonds et textes
- Fond clair principal: #F4F1EC
- Fond clair alterne: #EAE5DB
- Fond sombre principal: #0C0B1D
- Fond sombre alterne: #141228
- Texte clair (sur fond clair): #1C1830
- Texte sombre (sur fond sombre): #EDE7D9

## 10 regles verrouillees

1. Toujours utiliser les variables/tokens du systeme, pas de nouvelles couleurs hardcodees dans les composants.
2. Limiter l'or stellaire aux CTA, statuts premium, et points d'attention.
3. Utiliser l'azur celeste pour les liens secondaires, badges informatifs et icones de soutien.
4. Garder les fonds de page en clair sur base parchemin (#F4F1EC / #EAE5DB), pas de blanc pur dominant.
5. En mode sombre, utiliser uniquement la base nuit cosmique (#0C0B1D / #141228), sans noir pur (#000000).
6. Eviter les couleurs neon ou hyper-saturees dans les fonds, overlays et gradients.
7. Un composant ne doit jamais combiner plus de 1 accent principal + 1 accent secondaire.
8. Les badges doivent rester lisibles: texte fort sur fond doux, contraste AA minimum.
9. Les gradients doivent etre subtils: 2 a 3 stops maximum, faible opacite sur les surfaces larges.
10. Sur mobile, reduire la densite d'effets lumineux (blur/glow) pour conserver lisibilite et performance.

## Tonalite par famille de pages

### Pages publiques (accueil, a propos, terms)
- Tonalite: spirituelle premium accueillante
- Priorite: lecture, confiance, elegance
- Dominante: primary + secondary, accent gold ponctuel

### Espace star et profil utilisateur
- Tonalite: guidance moderne et apaisante
- Priorite: lisibilite, progression, action
- Dominante: surfaces claires, textes profonds, accents cibles

### Pages de contenu esoterique (grades, guidance, rubriques)
- Tonalite: mystique maitrisee
- Priorite: profondeur sans surcharge
- Dominante: mix primary/secondary, pastels en soutien

### Admin
- Tonalite: fonctionnelle et sobre
- Priorite: efficacite et hierarchie de donnees
- Dominante: neutres bleutes, accents tres limites

### Offline/PWA
- Tonalite: marque reconnaissable mais simple
- Priorite: comprehension immediate
- Dominante: or stellaire + indigo nuit

## Regles d'implementation

- CSS global: app/globals.css
- Tokens Tailwind: tailwind.config.ts
- Les nouveaux composants doivent reutiliser les tokens existants avant toute extension.
- Toute nouvelle couleur proposee doit etre validee avec contraste WCAG (AA minimum).

## Checklist rapide avant merge

- Aucune ancienne couleur legacy reintroduite
- Pas de hardcode hors tokens sauf exception justifiee
- Contraste texte/fond valide
- Cohesion visuelle entre mode clair et mode sombre
