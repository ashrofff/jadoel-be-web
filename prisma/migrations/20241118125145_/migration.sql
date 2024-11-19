/*
  Warnings:

  - Added the required column `isDeleted` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL;
