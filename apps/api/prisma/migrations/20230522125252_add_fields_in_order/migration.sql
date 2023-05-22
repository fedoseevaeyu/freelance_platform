/*
  Warnings:

  - Added the required column `initId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jobPostId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "initId" TEXT NOT NULL,
ADD COLUMN     "jobPostId" TEXT NOT NULL,
ADD COLUMN     "serviceId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_jobPostId_fkey" FOREIGN KEY ("jobPostId") REFERENCES "JobPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
