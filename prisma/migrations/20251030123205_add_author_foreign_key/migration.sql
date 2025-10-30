/*
  Warnings:

  - You are about to drop the column `author` on the `Article` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userName]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authorId` to the `Article` table without a default value. This is not possible if the table is not empty.

*/

-- Étape 1 : Ajouter la contrainte unique sur userName
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");

-- Étape 2 : Ajouter la colonne authorId (temporairement nullable)
ALTER TABLE "Article" ADD COLUMN "authorId" TEXT;

-- Étape 3 : Mettre à jour les articles existants pour lier avec l'utilisateur correspondant
-- Cela suppose que le champ "author" contient le userName
UPDATE "Article" 
SET "authorId" = (
  SELECT "id" FROM "User" WHERE "User"."userName" = "Article"."author"
);

-- Étape 4 : Rendre authorId NOT NULL maintenant qu'il est rempli
ALTER TABLE "Article" ALTER COLUMN "authorId" SET NOT NULL;

-- Étape 5 : Supprimer l'ancienne colonne author
ALTER TABLE "Article" DROP COLUMN "author";

-- Étape 6 : Ajouter la contrainte de clé étrangère
ALTER TABLE "Article" ADD CONSTRAINT "Article_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

