/*
  Warnings:

  - You are about to drop the column `is_active` on the `branches` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `branches` DROP COLUMN `is_active`,
    ADD COLUMN `photo` VARCHAR(255) NULL;
