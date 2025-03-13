/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `snippets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "coding_problems" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "snippets" DROP COLUMN "updatedAt",
ALTER COLUMN "tags" SET DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "solutions" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
