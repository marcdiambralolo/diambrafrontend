# Backend — Upload d'image de couverture des livres

## Contexte

Le frontend envoie désormais un **fichier image** (`coverImage`) lors de la création ou modification d'un livre. Le payload peut être envoyé en **JSON** (sans image) ou en **multipart/form-data** (avec image).

Le backend doit :
1. Accepter le multipart sur les endpoints existants
2. Stocker le fichier sur le VPS
3. Retourner l'URL publique dans le champ `coverImage` de la réponse

---

## 1. Endpoints concernés

### `POST /api/v1/books` — Créer un livre

Le frontend envoie soit du JSON (sans image), soit du `multipart/form-data` (avec image).

**Champs du formulaire (multipart) :**

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `title` | string | ✅ | Titre du livre |
| `subtitle` | string | ✅ | Sous-titre |
| `description` | string | ✅ | Description (min 50 caractères) |
| `author` | string | ✅ | Auteur |
| `category` | string | ✅ | Catégorie |
| `price` | number (string en multipart) | ✅ | Prix en FCFA |
| `pageCount` | number (string en multipart) | ✅ | Nombre de pages |
| `isActive` | boolean (string "true"/"false" en multipart) | ✅ | Statut actif/inactif |
| `coverImage` | File (image) | ❌ | Image de couverture (JPG, PNG, WebP) |

> **Important** : En multipart, `price`, `pageCount` et `isActive` sont envoyés sous forme de string. Il faut les parser côté backend (`parseFloat`, `parseInt`, `=== 'true'`).

### `PATCH /api/v1/books/:bookId` — Modifier un livre

Même logique que le POST. Si `coverImage` est présent dans le multipart, remplacer l'ancienne image (et supprimer l'ancien fichier si souhaité).

---

## 2. Implémentation NestJS

### 2.1. Installer Multer (si pas déjà fait)

```bash
npm install @nestjs/platform-express
npm install -D @types/multer
```

### 2.2. Controller

```typescript
import {
  Controller, Post, Patch, Body, Param,
  UseInterceptors, UploadedFile, ParseFilePipe,
  FileTypeValidator, MaxFileSizeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuid } from 'uuid';

const UPLOAD_DIR = process.env.UPLOAD_DIR || '/var/www/uploads/books';

const storage = diskStorage({
  destination: UPLOAD_DIR,
  filename: (_req, file, cb) => {
    const ext = extname(file.originalname).toLowerCase();
    cb(null, `${uuid()}${ext}`);
  },
});

const imageValidators = new ParseFilePipe({
  fileIsRequired: false,
  validators: [
    new FileTypeValidator({ fileType: /^image\/(jpeg|png|webp)$/ }),
    new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5 Mo
  ],
});

@Controller('api/v1/books')
export class BooksController {

  @Post()
  @UseInterceptors(FileInterceptor('coverImage', { storage }))
  async create(
    @Body() dto: CreateBookDto,
    @UploadedFile(imageValidators) file?: Express.Multer.File,
  ) {
    // Parser les champs multipart
    const bookData = {
      ...dto,
      price: typeof dto.price === 'string' ? parseFloat(dto.price) : dto.price,
      pageCount: typeof dto.pageCount === 'string' ? parseInt(dto.pageCount, 10) : dto.pageCount,
      isActive: typeof dto.isActive === 'string' ? dto.isActive === 'true' : dto.isActive,
    };

    if (file) {
      // Construire l'URL publique (selon config Nginx ci-dessous)
      bookData.coverImage = `${process.env.PUBLIC_UPLOAD_URL || '/uploads'}/books/${file.filename}`;
    }

    return this.booksService.create(bookData);
  }

  @Patch(':bookId')
  @UseInterceptors(FileInterceptor('coverImage', { storage }))
  async update(
    @Param('bookId') bookId: string,
    @Body() dto: UpdateBookDto,
    @UploadedFile(imageValidators) file?: Express.Multer.File,
  ) {
    const bookData = {
      ...dto,
      price: typeof dto.price === 'string' ? parseFloat(dto.price) : dto.price,
      pageCount: typeof dto.pageCount === 'string' ? parseInt(dto.pageCount, 10) : dto.pageCount,
      isActive: typeof dto.isActive === 'string' ? dto.isActive === 'true' : dto.isActive,
    };

    if (file) {
      bookData.coverImage = `${process.env.PUBLIC_UPLOAD_URL || '/uploads'}/books/${file.filename}`;
      // Optionnel : supprimer l'ancien fichier
      // const oldBook = await this.booksService.findById(bookId);
      // if (oldBook.coverImage) await this.deleteOldFile(oldBook.coverImage);
    }

    return this.booksService.update(bookId, bookData);
  }
}
```

### 2.3. Schéma MongoDB (Mongoose)

Si ce n'est pas déjà fait, ajouter le champ `coverImage` au schéma :

```typescript
@Prop({ type: String, required: false, default: null })
coverImage: string;
```

### 2.4. DTO

```typescript
// create-book.dto.ts
export class CreateBookDto {
  @IsString() title: string;
  @IsString() subtitle: string;
  @IsString() @MinLength(50) description: string;
  @IsString() author: string;
  @IsString() category: string;
  price: number | string;       // string en multipart
  pageCount: number | string;   // string en multipart
  isActive: boolean | string;   // "true"/"false" en multipart
  @IsOptional() @IsString() coverImage?: string;
}
```

---

## 3. Stockage des fichiers sur le VPS

### 3.1. Créer le dossier d'uploads

```bash
sudo mkdir -p /var/www/uploads/books
sudo chown -R www-data:www-data /var/www/uploads
sudo chmod -R 755 /var/www/uploads
```

### 3.2. Variables d'environnement backend

```bash
# .env du backend NestJS
UPLOAD_DIR=/var/www/uploads/books
PUBLIC_UPLOAD_URL=https://api.monetoile.org/uploads
```

---

## 4. Configuration Nginx

Servir les fichiers uploadés sans passer par NestJS (plus performant) :

```nginx
server {
    # ... config existante du backend ...

    # Servir les uploads statiquement
    location /uploads/ {
        alias /var/www/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;

        # Sécurité : n'autoriser que les images
        location ~* \.(jpg|jpeg|png|webp|gif|svg)$ {
            try_files $uri =404;
        }

        # Bloquer tout autre type de fichier
        location ~ \.(?!jpg|jpeg|png|webp|gif|svg).+$ {
            return 403;
        }
    }
}
```

Après modification, recharger Nginx :

```bash
sudo nginx -t && sudo systemctl reload nginx
```

---

## 5. Réponse attendue par le frontend

Le frontend s'attend à recevoir un champ `coverImage` (string URL) dans l'objet `Book` retourné par les endpoints :

```json
{
  "_id": "...",
  "bookId": "...",
  "title": "Guide Spirituel",
  "subtitle": "Les fondamentaux",
  "description": "...",
  "price": 5000,
  "pageCount": 250,
  "category": "Spiritualité",
  "author": "Mon Étoile",
  "isActive": true,
  "coverImage": "https://api.monetoile.org/uploads/books/a1b2c3d4-e5f6.jpg",
  "createdAt": "2026-02-18T10:00:00.000Z"
}
```

Si aucune image n'est uploadée, `coverImage` peut être `null` ou absent — le frontend affichera un placeholder.

---

## 6. Résumé des actions

- [ ] Ajouter `coverImage: string` au schéma Mongoose du Book
- [ ] Ajouter `@UseInterceptors(FileInterceptor('coverImage'))` sur POST et PATCH
- [ ] Parser les champs string (price, pageCount, isActive) en multipart
- [ ] Stocker les fichiers dans `/var/www/uploads/books/`
- [ ] Configurer Nginx pour servir `/uploads/` statiquement
- [ ] Ajouter les variables d'environnement `UPLOAD_DIR` et `PUBLIC_UPLOAD_URL`
- [ ] Retourner l'URL complète dans le champ `coverImage` de la réponse
