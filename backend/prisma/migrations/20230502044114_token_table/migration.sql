/*
  Warnings:

  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `user` table. All the data in the column will be lost.
  - Added the required column `password_hash` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `create_time` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `password_hash` VARCHAR(60) NOT NULL,
    ADD COLUMN `username` VARCHAR(16) NOT NULL,
    ADD PRIMARY KEY (`username`);

-- CreateTable
CREATE TABLE `refresh_tokens` (
    `token_value` VARCHAR(191) NOT NULL,
    `userUsername` VARCHAR(16) NOT NULL,

    PRIMARY KEY (`token_value`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `refresh_tokens` ADD CONSTRAINT `refresh_tokens_userUsername_fkey` FOREIGN KEY (`userUsername`) REFERENCES `user`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;
