/*
  Warnings:

  - You are about to drop the column `maxReties` on the `Job` table. All the data in the column will be lost.
  - Added the required column `maxRetries` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable

ALTER TABLE "Job" RENAME COLUMN "maxReties" TO "maxRetries";
