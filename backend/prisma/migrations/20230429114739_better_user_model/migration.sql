-- CreateTable
CREATE TABLE `users` (
    `username` VARCHAR(16) NOT NULL,
    `password_hash` VARCHAR(32) NOT NULL,
    `create_time` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`username`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
