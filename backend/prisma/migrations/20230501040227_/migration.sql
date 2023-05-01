/*
  Warnings:

  - You are about to drop the `access_tokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `access_tokens` DROP FOREIGN KEY `access_tokens_token_owner_fkey`;

-- DropTable
DROP TABLE `access_tokens`;

-- CreateTable
CREATE TABLE `refresh_tokens` (
    `token_owner` VARCHAR(60) NOT NULL,
    `token_value` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`token_owner`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `refresh_tokens` ADD CONSTRAINT `refresh_tokens_token_owner_fkey` FOREIGN KEY (`token_owner`) REFERENCES `users`(`username`) ON DELETE CASCADE ON UPDATE CASCADE;
