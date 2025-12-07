# Advanced Blog API

API REST complète pour un système de blog avec authentification, gestion d'articles, commentaires, upload d'images et jobs asynchrones.

## 📋 Table des matières

- [🚀 Technologies](#-technologies)
- [📦 Prérequis](#-prérequis)
- [🛠️ Installation](#️-installation)
- [⚙️ Configuration](#️-configuration)
- [🎯 Commandes utiles](#-commandes-utiles)
- [🧪 Lancer les tests](#-lancer-les-tests)
- [🚀 Déploiement](#-déploiement)
- [🔴 Usage de Redis](#-usage-de-redis)
- [🏗️ Architecture](#️-architecture)
- [📚 API Documentation](#-api-documentation)
- [🔗 Sécurité](#-sécurité)
- [🐛 Dépannage](#-dépannage)
- [📊 Métriques](#-métriques)
- [🔗 Liens utiles](#-liens-utiles)

## 🚀 Technologies

- **Backend**: Express.js 5.1.0, Node.js 22, TypeScript 5
- **Base de données**: PostgreSQL avec Prisma ORM 7.1.0
- **Cache & Queue**: Redis (Upstash en production)
- **Authentification**: JWT avec refresh tokens (cookies)
- **Email**: Resend pour l'envoi d'emails
- **Upload**: Cloudinary pour les images
- **Jobs asynchrones**: Bull avec monitoring Bull Board
- **Tests**: Jest 30.2.0 (59 tests)
- **Documentation API**: Swagger/OpenAPI 3.0.0
- **Déploiement**: Render

## 📦 Prérequis

- Node.js 22+
- Docker et Docker Compose
- PostgreSQL 13+ (ou via Docker)
- Redis (ou via Docker)
- Compte Cloudinary (pour upload d'images)
- Compte Resend (pour envoi d'emails)
- Compte Upstash Redis (pour production)

## 🛠️ Installation

### 1. Cloner le projet

```bash
git clone https://github.com/yduclospro-dev/advanced-blog.git
cd advanced-blog
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Créer un fichier `.env` à la racine du projet :

```env
# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/advanced_blog"

# JWT
JWT_SECRET="votre-secret-jwt-tres-long-et-securise"

# Redis (local)
REDIS_URL="redis://localhost:6379"

# Cloudinary
CLOUDINARY_CLOUD_NAME="votre-cloud-name"
CLOUDINARY_API_KEY="votre-api-key"
CLOUDINARY_API_SECRET="votre-api-secret"

# Resend
RESEND_API_KEY="votre-resend-api-key"
RESEND_FROM="noreply@votredomaine.com"

# CORS
CORS_ORIGIN="http://localhost:3000"

# Port
PORT=3000
```

### 4. Lancer les services Docker

```bash
# Démarrer PostgreSQL et Redis
docker compose -f docker-compose.test.yml up -d
```

### 5. Initialiser la base de données

```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma migrate deploy

# Peupler la base avec des données de test
npx prisma db seed
```

## ⚙️ Configuration

### Comptes de test

Après le seed, vous pouvez utiliser ces comptes :

| Rôle  | Email             | Mot de passe | Description                           |
|-------|-------------------|--------------|---------------------------------------|
| Admin | `admin@blog.com`  | `admin123`   | Accès complet, peut gérer tous les contenus |
| User  | `user1@blog.com`  | `user123`    | Utilisateur standard avec 50 articles |
| User  | `user2@blog.com`  | `user123`    | Utilisateur standard avec 75 articles |
| User  | `user3@blog.com`  | `user123`    | Utilisateur standard avec 75 articles |

**Note de sécurité** : Ces mots de passe sont pour le développement uniquement. En production, utilisez des mots de passe forts et uniques.

### Base de données

Le schéma Prisma se trouve dans `prisma/schema.prisma`. Il contient :
- **User** : Utilisateurs avec rôles (USER/ADMIN), email unique, mots de passe hashés (bcrypt)
- **Article** : Articles de blog avec titre, contenu, image optionnelle, auteur
- **Comment** : Commentaires liés aux articles et utilisateurs
- **Migrations** : Historique des changements de schéma (8 migrations appliquées)

**Données de seed** :
- 4 utilisateurs (1 admin + 3 users)
- 200 articles répartis entre les utilisateurs
- Base prête pour les tests et le développement

## 🎯 Commandes utiles

### Développement

```bash
# Démarrer en mode développement (avec hot reload)
npm run dev

# Démarrer uniquement le serveur (sans Redis auto-start)
npx tsx -r tsconfig-paths/register WebApi/server.ts
```

### Build

```bash
# Compiler le projet TypeScript
npm run build

# Le build génère les fichiers dans /dist
```

### Base de données

#### Développement (PostgreSQL local)
```bash
# Ouvrir Prisma Studio (interface graphique)
npx prisma studio

# Créer une nouvelle migration
npx prisma migrate dev --name nom-de-la-migration

# Reseed la base de données
npx prisma db seed
```

#### Production (Render PostgreSQL)
```bash
# Les migrations sont appliquées automatiquement au build
# Voir : npm run build dans package.json

# Pour forcer l'application des migrations
npx prisma migrate deploy
```

### Redis

#### Développement (Docker local)
```bash
# Démarrer Redis localement
docker start redis-dev

# Arrêter Redis
docker stop redis-dev

# Voir les logs Redis
docker logs redis-dev

# Redis accessible sur : redis://localhost:6379
```

#### Production (Upstash)
```bash
# Redis managé - pas de commandes à exécuter
# Configuration automatique via REDIS_URL
# Dashboard : https://console.upstash.com/redis
```

## 🧪 Lancer les tests

### Vue d'ensemble

L'application contient **59 tests** unitaires et d'intégration qui valident tous les endpoints de l'API.

### Infrastructure de tests

#### Ce qui se passe quand vous lancez `npm test` :

1. **Préparation de l'environnement** (script `pretest`)
   ```bash
   # Arrête le Redis de développement pour éviter les conflits
   docker stop redis-dev
   ```

2. **Démarrage des services Docker** (`docker-compose.test.yml`)
   ```yaml
   # PostgreSQL de test sur le port 5433 (pas 5432)
   postgres:
     image: postgres:13
     environment:
       POSTGRES_DB: testdb
       POSTGRES_USER: testuser
       POSTGRES_PASSWORD: testpass
     ports:
       - "5433:5432"
   
   # Redis de test sur le port 6379
   redis:
     image: redis:7-alpine
     ports:
       - "6379:6379"
   ```

3. **Attente que PostgreSQL soit prêt** (`wait-for-db.ts`)
   ```bash
   # Vérifie que PostgreSQL est accessible avant de continuer
   wait-on tcp:localhost:5433
   ```

4. **Application des migrations Prisma**
   ```bash
   # Crée le schéma dans la base de test
   prisma migrate deploy
   ```

5. **Exécution des tests Jest** (59 tests en mode séquentiel)
   ```bash
   # --runInBand : exécute les tests un par un (pas en parallèle)
   # Évite les conflits de base de données
   jest --runInBand
   ```

6. **Nettoyage automatique**
   ```bash
   # Arrête et supprime les conteneurs Docker
   # Supprime les volumes (données de test)
   docker compose -f docker-compose.test.yml down -v
   ```

#### Variables d'environnement de test

Les tests utilisent `.env.test` :
```env
DATABASE_URL="postgresql://testuser:testpass@localhost:5433/testdb"
TEST_IN_DOCKER=true
NODE_ENV=test
```

### Tests par catégorie

```bash
# Tests utilisateurs (login, register, refresh, logout, me, users)
npm test -- user

# Tests articles (CRUD, search, pagination)
npm test -- article

# Tests commentaires (CRUD sur articles)
npm test -- comment

# Tests images (upload, delete via Cloudinary)
npm test -- image

# Tests password reset (forgot-password, reset-password)
npm test -- password-reset
```

### Mocking et isolation

#### Redis
```typescript
// En mode test : Mock Redis (pas de vraie connexion)
const mockRedis = {
  get: async () => null,
  set: async () => null,
  incr: async () => 1,
  // ... pas de vraie persistance
};
```

#### Bull Queue
```typescript
// En mode test : Queue en mémoire (pas de Redis)
export const emailQueue = isTest
  ? new Queue("email") // In-memory
  : new Queue("email", redisConfig); // Redis réel
```

#### Cloudinary
```typescript
// Tests mockent les appels Cloudinary
// Pas de vrais uploads pendant les tests
```

### Couverture de tests

```bash
# Générer le rapport de couverture
npm test -- --coverage

# Résultat attendu :
# - 100% des endpoints API testés
# - 59 tests passing
# - Tous les cas d'erreur couverts (401, 403, 404, 409, etc.)
```

### Structure des tests

```
tests/
├── globalApp.ts           # Instance Express partagée
├── globalTeardown.ts      # Nettoyage après tous les tests
├── jest.setup.ts          # Configuration Jest globale
└── api/unit/
    ├── user/
    │   ├── login.test.ts        # 6 tests
    │   ├── register.test.ts     # 7 tests
    │   ├── refresh.test.ts      # 4 tests
    │   ├── logout.test.ts       # 3 tests
    │   ├── me.test.ts           # 3 tests
    │   ├── users.test.ts        # 1 test
    │   └── password-reset.test.ts # 4 tests
    ├── article/
    │   ├── article.test.ts      # 17 tests
    │   └── search.test.ts       # 4 tests
    ├── comment/
    │   └── comment.test.ts      # 8 tests
    └── image/
        └── image.test.ts        # 2 tests
```

### Exemple de test

```typescript
// tests/api/unit/user/login.test.ts
describe('POST /api/login', () => {
  it('should login successfully with valid credentials', async () => {
    // Arrange : créer un utilisateur
    const user = await createTestUser();
    
    // Act : tenter de se connecter
    const response = await request(app)
      .post('/api/login')
      .send({ email: user.email, password: 'password123' });
    
    // Assert : vérifier le succès
    expect(response.status).toBe(200);
    expect(response.body.result.accessToken).toBeDefined();
    expect(response.headers['set-cookie']).toBeDefined(); // refresh_token
  });
});
```

## 🚀 Déploiement

### Déploiement sur Render

1. **Créer une base de données PostgreSQL sur Render**
   - Copier l'**Internal Database URL**
   - L'ajouter comme variable d'environnement `DATABASE_URL`

2. **Créer un Redis sur Upstash**
   - Créer une instance Redis sur [Upstash](https://console.upstash.com)
   - Copier l'**URL de connexion** (format `rediss://...`)
   - L'ajouter comme variable d'environnement `REDIS_URL`

3. **Configurer le Web Service sur Render**
   - Build Command: `npm install && npm run build`
   - Start Command: `node dist/WebApi/server.js`

4. **Variables d'environnement requises**
   ```
   DATABASE_URL=postgresql://...  (Internal URL de Render)
   REDIS_URL=rediss://...         (URL Upstash)
   JWT_SECRET=...
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   RESEND_API_KEY=...
   RESEND_FROM=...
   CORS_ORIGIN=https://votre-app.onrender.com
   NODE_ENV=production
   ```

5. **Auto-déploiement**
   - Chaque push sur la branche configurée déclenche un déploiement automatique
   - Les migrations Prisma sont appliquées automatiquement au build

### URLs de production

- **API**: https://advanced-blog-4j0k.onrender.com
- **Swagger UI**: https://advanced-blog-4j0k.onrender.com/api-docs
- **Bull Board**: https://advanced-blog-4j0k.onrender.com/admin/queues
- **Health Check**: https://advanced-blog-4j0k.onrender.com/healthz

## 🔴 Usage de Redis

Redis est utilisé pour deux fonctionnalités critiques dans cette application.

### Configuration Redis par environnement

| Environnement | Type | URL | Utilisation |
|---------------|------|-----|-------------|
| **Développement** | Docker local | `redis://localhost:6379` | Redis via `docker-compose.test.yml` |
| **Tests** | In-memory | N/A | Queue Bull en mémoire (pas de Redis) |
| **Production** | Upstash | `rediss://default:password@host:port` | Redis managé avec TLS |

### 1. Rate Limiting (Limitation de tentatives de connexion)

**Objectif** : Protéger l'API contre les attaques par force brute sur l'endpoint `/api/login`.

**Configuration** :
- **Limite** : 5 tentatives de connexion maximum
- **Durée de blocage** : 15 minutes
- **Persistance** : Redis stocke les tentatives par email

#### Développement
```bash
# Redis local via Docker
docker start redis-dev
# L'API se connecte automatiquement à localhost:6379
```

#### Production
```bash
# Redis Upstash (automatique)
# L'API utilise REDIS_URL avec authentification TLS
# Pas de configuration manuelle nécessaire
```

**Fonctionnement** :
```typescript
// Infrastructure/services/AuthRateLimitService.ts
- Clé Redis : `auth:ratelimit:${email}`
- Incrément à chaque tentative échouée
- Blocage automatique après 5 tentatives
- Expiration automatique après 15 minutes
```

**Test** :
1. Essayer de se connecter 5 fois avec un mauvais mot de passe
2. La 6ème tentative retourne : `429 Too Many Requests`
3. Attendre 15 minutes ou redémarrer Redis pour réinitialiser

### 2. Jobs asynchrones (Bull Queue)

**Objectif** : Exécuter des tâches longues en arrière-plan sans bloquer l'API.

**Architecture** :
```
Client → API → Queue (Redis) → Worker → Traitement
         ↓ (réponse immédiate)
```

**Cas d'usage implémenté** : Envoi d'emails de réinitialisation de mot de passe

**Flux de traitement** :
1. **Client** : `POST /api/forgot-password` avec email
2. **API** : Vérifie l'utilisateur, crée un token JWT, **queue le job** → Réponse 200 immédiate
3. **Worker Bull** : Récupère le job depuis Redis
4. **Traitement** : Envoie l'email via Resend
5. **Retry** : En cas d'échec, réessaie 3 fois avec délai exponentiel (2s, 4s, 8s)

**Configuration** :
```typescript
// Infrastructure/queues/queueConfig.ts
- Queue : "email"
- Options : 3 tentatives, backoff exponentiel
- Rétention : 100 derniers jobs complétés
```

#### Développement (Local)
```bash
# 1. Démarrer Redis via Docker
docker start redis-dev

# 2. L'API démarre automatiquement les workers
npm run dev

# 3. Tester un job
curl -X POST http://localhost:3000/api/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@blog.com"}'

# 4. Voir les jobs dans Bull Board
# Ouvrir : http://localhost:3000/admin/queues
```

#### Production (Render + Upstash)
```bash
# Automatique - pas de configuration manuelle
# 1. REDIS_URL pointe vers Upstash (rediss://...)
# 2. Workers démarrent automatiquement avec l'API
# 3. Bull Board accessible à /admin/queues
# 4. Jobs persistés même après redémarrage
```

**Monitoring Bull Board** :
- **URL Dev** : http://localhost:3000/admin/queues
- **URL Prod** : https://advanced-blog-4j0k.onrender.com/admin/queues
- Visualisation en temps réel des jobs (en attente, actifs, complétés, échoués)
- Détails de chaque job (données, logs, statut, retry)

**Avantages** :
- ✅ **Performance** : API répond instantanément sans attendre l'envoi d'email
- ✅ **Fiabilité** : Retry automatique en cas d'échec temporaire
- ✅ **Monitoring** : Visualisation des jobs dans Bull Board
- ✅ **Scalabilité** : Possibilité d'ajouter plusieurs workers

## 🏗️ Architecture

### Structure du projet

```
advanced-blog/
├── Application/           # Couche applicative (services, DTOs)
│   ├── dtos/             # Objets de transfert de données
│   └── services/         # Logique métier
├── Domain/               # Couche domaine (entités, interfaces)
│   ├── entities/         # Entités métier
│   ├── repositories/     # Interfaces des repositories
│   └── errors/           # Erreurs personnalisées
├── Infrastructure/       # Couche infrastructure (implémentations)
│   ├── repositories/     # Implémentations Prisma
│   ├── services/         # Services externes (Email, Rate Limit)
│   └── queues/          # Configuration Bull et workers
├── WebApi/              # Couche présentation (API REST)
│   ├── controllers/     # Contrôleurs Express
│   ├── middleware/      # Middlewares (auth, errors)
│   ├── routes/          # Routes de l'API
│   └── server.ts        # Point d'entrée
├── prisma/              # Schéma et migrations Prisma
├── tests/               # Tests unitaires et d'intégration
└── scripts/             # Scripts utilitaires
```

### Principes architecturaux

- **Clean Architecture** : Séparation des couches (Domain, Application, Infrastructure, WebApi)
- **Dependency Injection** : Via `compositionRoot.ts`
- **Repository Pattern** : Abstraction de l'accès aux données
- **DTO Pattern** : Validation et transformation des données
- **Error Handling** : Gestionnaire d'erreurs centralisé

## 📚 API Documentation

### Swagger UI

Accéder à la documentation interactive : **http://localhost:3000/api-docs**

### Endpoints principaux

#### Authentification
- `POST /api/register` - Créer un compte
- `POST /api/login` - Se connecter (rate limited)
- `POST /api/refresh` - Renouveler le token
- `POST /api/logout` - Se déconnecter

#### Utilisateurs
- `GET /api/users` - Liste des utilisateurs (public)
- `GET /api/me` - Profil de l'utilisateur connecté

#### Articles
- `POST /api/articles` - Créer un article (auth)
- `GET /api/articles/search` - Rechercher des articles (pagination)
- `GET /api/articles/:id` - Détails d'un article
- `PUT /api/articles/:id` - Modifier un article (auth, auteur uniquement)
- `DELETE /api/articles/:id` - Supprimer un article (auth, auteur uniquement)

#### Commentaires
- `POST /api/articles/:articleId/comments` - Commenter un article (auth)
- `GET /api/articles/:articleId/comments` - Liste des commentaires
- `PUT /api/comments/:id` - Modifier un commentaire (auth, auteur uniquement)
- `DELETE /api/comments/:id` - Supprimer un commentaire (auth, auteur uniquement)

#### Images
- `POST /api/upload/image` - Upload une image (multipart, auth)
- `DELETE /api/upload/image` - Supprimer une image (auth)

#### Password Reset
- `POST /api/forgot-password` - Demander réinitialisation (job async)
- `POST /api/reset-password` - Réinitialiser avec token

#### Monitoring & Admin
- `GET /healthz` - Health check (état de l'API et connexion DB)
- `GET /api-docs` - Documentation Swagger UI interactive
- `GET /api-docs.json` - Spécification OpenAPI JSON
- `GET /admin/queues` - Bull Board (monitoring des jobs asynchrones)

### Authentification

L'API utilise JWT avec deux tokens :
- **Access Token** : Bearer token dans header `Authorization` (durée courte)
- **Refresh Token** : HttpOnly cookie sécurisé (durée longue)

```bash
# Exemple de requête authentifiée
curl -X GET http://localhost:3000/api/me \
  -H "Authorization: Bearer <access_token>" \
  -H "Cookie: refresh_token=<refresh_token>"
```

### Sécurité

- ✅ **Rate limiting** : 5 tentatives de connexion max par email / 15 min
- ✅ **CORS** : Configuration stricte des origines autorisées
- ✅ **Helmet** : Protection contre les vulnérabilités web courantes
- ✅ **JWT** : Tokens signés avec secret fort
- ✅ **Bcrypt** : Mots de passe hashés (10 rounds)
- ✅ **Validation** : Validation des entrées utilisateur
- ✅ **HTTPS** : TLS forcé en production

## 🐛 Dépannage

### Erreur de connexion Redis

```bash
# Erreur : ECONNREFUSED localhost:6379
# Solution : Démarrer Redis
docker start redis-dev
# ou
docker compose -f docker-compose.test.yml up -d redis
```

### Erreur de migration Prisma

```bash
# Erreur : P3006 migration failed
# Solution : Reset la base de données (DEV UNIQUEMENT !)
npx prisma migrate reset
npx prisma db seed
```

### Port 3000 déjà utilisé

```bash
# Trouver le processus sur le port 3000
netstat -ano | findstr :3000

# Tuer le processus (remplacer PID)
taskkill /PID <PID> /F

# Ou changer le port dans .env
PORT=3001
```

### Tests échouent

```bash
# S'assurer que Docker tourne
docker ps

# Relancer les conteneurs de test
docker compose -f docker-compose.test.yml down -v
docker compose -f docker-compose.test.yml up -d

# Relancer les tests
npm test
```

## 📊 Métriques

- **59 tests** unitaires et d'intégration
- **100%** couverture des endpoints API
- **200 articles** de seed pour les tests de performance

## 🔗 Liens utiles

- **Production** : https://advanced-blog-4j0k.onrender.com
- **Swagger Docs** : https://advanced-blog-4j0k.onrender.com/api-docs
- **Bull Board** : https://advanced-blog-4j0k.onrender.com/admin/queues
- **Repository** : https://github.com/yduclospro-dev/advanced-blog
- **Prisma Docs** : https://www.prisma.io/docs
- **Bull Docs** : https://github.com/OptimalBits/bull
- **Render Docs** : https://render.com/docs

**Déploiement** : https://advanced-blog-4j0k.onrender.com