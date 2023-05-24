/*
  Warnings:

  - You are about to drop the column `jobPostId` on the `Tags` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tags" DROP CONSTRAINT "Tags_jobPostId_fkey";

-- AlterTable
ALTER TABLE "Tags" DROP COLUMN "jobPostId";

-- CreateTable
CREATE TABLE "_JobPostToTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_JobPostToTags_AB_unique" ON "_JobPostToTags"("A", "B");

-- CreateIndex
CREATE INDEX "_JobPostToTags_B_index" ON "_JobPostToTags"("B");

-- AddForeignKey
ALTER TABLE "_JobPostToTags" ADD CONSTRAINT "_JobPostToTags_A_fkey" FOREIGN KEY ("A") REFERENCES "JobPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobPostToTags" ADD CONSTRAINT "_JobPostToTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
