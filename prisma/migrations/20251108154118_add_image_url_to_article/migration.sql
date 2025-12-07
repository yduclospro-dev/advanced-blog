-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "imageUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");
