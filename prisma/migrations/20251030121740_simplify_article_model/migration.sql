/*
  Warnings:

  - You are about to drop the column `authorId` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `dislikes` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `Article` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Article" DROP CONSTRAINT "Article_authorId_fkey";

-- AlterTable
ALTER TABLE "Article" DROP COLUMN "authorId",
DROP COLUMN "dislikes",
DROP COLUMN "likes";
