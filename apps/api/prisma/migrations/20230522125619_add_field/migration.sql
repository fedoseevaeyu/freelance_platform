/*
  Warnings:

  - You are about to drop the column `initId` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "initId",
ADD COLUMN     "client_agree" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "freelancer_agree" BOOLEAN NOT NULL DEFAULT false;
