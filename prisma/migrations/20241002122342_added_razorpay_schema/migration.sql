/*
  Warnings:

  - You are about to drop the `SripeCustomer` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `razorpayOrderId` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `razorpayPaymentId` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `razorpaySignature` to the `Purchase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Purchase` ADD COLUMN `razorpayOrderId` VARCHAR(191) NOT NULL,
    ADD COLUMN `razorpayPaymentId` VARCHAR(191) NOT NULL,
    ADD COLUMN `razorpaySignature` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `SripeCustomer`;

-- CreateTable
CREATE TABLE `RazorpayCustomer` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `razorpayCustomerId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `RazorpayCustomer_userId_key`(`userId`),
    UNIQUE INDEX `RazorpayCustomer_razorpayCustomerId_key`(`razorpayCustomerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
