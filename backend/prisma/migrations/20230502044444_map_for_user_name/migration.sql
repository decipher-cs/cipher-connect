/*
  Warnings:

  - You are about to drop the column `userUsername` on the `refresh_tokens` table. All the data in the column will be lost.
  - Added the required column `user_username` to the `refresh_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `refresh_tokens` DROP FOREIGN KEY `refresh_tokens_userUsername_fkey`;

-- AlterTable
ALTER TABLE `refresh_tokens` DROP COLUMN `userUsername`,
    ADD COLUMN `user_username` VARCHAR(16) NOT NULL;

-- AddForeignKey
ALTER TABLE `refresh_tokens` ADD CONSTRAINT `refresh_tokens_user_username_fkey` FOREIGN KEY (`user_username`) REFERENCES `users`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;
