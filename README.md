## Instructions d'installation

1. Cloner le projet
```bash
git clone https://github.com/yduclospro-dev/advanced-blog.git

cd advanced-blog
```

2. Installer les dépendances
```bash
npm install
```

3. Générer le client Prisma
```bash
npx prisma generate
```

## Commandes utiles

Lancer le projet :
```bash
npm run serve
```

Lancer tous les tests :
```bash
npm run test
```

Lancer les tests en mode watch :
```bash
npm run test:watch
```

Vérifier le lint :
```bash
npm run lint
```

## Fonctionnalités principales

- Inscription utilisateur
- Connexion + génération de JWT
- Se déconnecter
- Réinitialisation de mot de passe avec envoi d'email
- Création, modification et suppression d’articles
- Ajouter des commentaires à des articles

## Base de données

Ce projet utilise PostgreSQL associé à Prisma ORM.

Prisma est un ORM moderne qui simplifie énormément la gestion de la base de données.

Ses avantages :
- un schéma centralisé et typé (schema.prisma)
- des migrations automatiques
- un client généré automatiquement qui offre de l’autocomplétion
- une gestion claire des relations entre modèles
- compatible avec TypeScript sans configuration supplémentaire

Avec Prisma, on manipule la base en code, ce qui réduit les erreurs SQL et garantit une structure cohérente.

## API

L’API permet de gérer :
- les routes d’authentification
- les utilisateurs
- la réinitialisation de mot de passe
- les articles
- les commentaires sous chaque article

Documentation complète :
https://documenter.getpostman.com/view/50257644/2sB3dHUsNp

## Tests

Les tests utilisent Jest et une base PostgreSQL temporaire lancée via Docker.

Avant de lancer les tests :
1. Docker Desktop doit être actif
2. La base est lancée automatiquement via les scripts ```test:ci:db:start```

Pour exécuter les tests :
```bash
npm run test
```

Le test lance automatiquement :
- un container PostgreSQL dédié
- un reset complet de la base
- l’exécution des tests en série
- la fermeture du container

## Prisma – Seed

Un script seed.ts initialise automatiquement la base avec :
- un administrateur (créé si inexistant)
- 3 utilisateurs standards
- 200 articles générés automatiquement

Résumé du fonctionnement :
- vérifie l’existence d’un admin
- en crée un sinon
- génère plusieurs utilisateurs avec mots de passe hashés
- crée 200 articles datés sur les 200 derniers jours

Cela permet d’avoir une base de données directement exploitable après l’installation.


## Redis 



## Déploiement

