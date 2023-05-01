-- CreateTable
CREATE TABLE `accessToken` (
    `token_owner` VARCHAR(60) NOT NULL,

    PRIMARY KEY (`token_owner`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `accessToken` ADD CONSTRAINT `accessToken_token_owner_fkey` FOREIGN KEY (`token_owner`) REFERENCES `users`(`username`) ON DELETE CASCADE ON UPDATE CASCADE;
