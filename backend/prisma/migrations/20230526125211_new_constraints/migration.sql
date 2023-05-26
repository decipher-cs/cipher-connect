/*
  Warnings:

  - You are about to drop the column `user_username` on the `refresh_tokens` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[display_name]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `refresh_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `display_name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `refresh_tokens` DROP FOREIGN KEY `refresh_tokens_user_username_fkey`;

-- AlterTable
ALTER TABLE `refresh_tokens` DROP COLUMN `user_username`,
    ADD COLUMN `username` VARCHAR(16) NOT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `display_name` VARCHAR(16) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `users_display_name_key` ON `users`(`display_name`);

-- AddForeignKey
ALTER TABLE `refresh_tokens` ADD CONSTRAINT `refresh_tokens_username_fkey` FOREIGN KEY (`username`) REFERENCES `users`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;
