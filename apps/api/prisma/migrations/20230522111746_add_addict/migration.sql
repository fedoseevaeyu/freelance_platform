/*
  Warnings:

  - Added the required column `skills` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `technologies` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workExp` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "skills" TEXT NOT NULL,
ADD COLUMN     "technologies" TEXT NOT NULL,
ADD COLUMN     "workExp" TEXT NOT NULL;
