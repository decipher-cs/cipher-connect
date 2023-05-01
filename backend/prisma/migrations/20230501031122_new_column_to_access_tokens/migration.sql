/*
  Warnings:

  - Added the required column `token_value` to the `access_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `access_tokens` ADD COLUMN `token_value` VARCHAR(191) NOT NULL;
