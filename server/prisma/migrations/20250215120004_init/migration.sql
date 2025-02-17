/*
  Warnings:

  - You are about to drop the column `userId` on the `TaskAssignment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[taskId]` on the table `TaskAssignment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "TaskAssignment" DROP CONSTRAINT "TaskAssignment_userId_fkey";

-- DropIndex
DROP INDEX "TaskAssignment_userId_taskId_key";

-- AlterTable
ALTER TABLE "TaskAssignment" DROP COLUMN "userId";

-- CreateIndex
CREATE UNIQUE INDEX "TaskAssignment_taskId_key" ON "TaskAssignment"("taskId");
