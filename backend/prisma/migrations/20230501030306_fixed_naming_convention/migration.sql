/*
  Warnings:

  - You are about to drop the `accessToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `accessToken` DROP FOREIGN KEY `accessToken_token_owner_fkey`;

-- DropTable
DROP TABLE `accessToken`;

-- CreateTable
CREATE TABLE `accessTokens` (
    `token_owner` VARCHAR(60) NOT NULL,

    PRIMARY KEY (`token_owner`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `accessTokens` ADD CONSTRAINT `accessTokens_token_owner_fkey` FOREIGN KEY (`token_owner`) REFERENCES `users`(`username`) ON DELETE CASCADE ON UPDATE CASCADE;
