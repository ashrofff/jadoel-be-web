/*
  Warnings:

  - Added the required column `shipmentFee` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "shipmentFee" DECIMAL(65,30) NOT NULL;

-- CreateTable
CREATE TABLE "StoreConfig" (
    "shippingId" TEXT NOT NULL,
    "longitudeStore" TEXT NOT NULL,
    "latitudeStore" TEXT NOT NULL,
    "costPerKm" DECIMAL(65,30) NOT NULL,
    "phoneStore" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StoreConfig_pkey" PRIMARY KEY ("shippingId")
);

-- CreateTable
CREATE TABLE "UserShipping" (
    "userShippingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "longitude" DECIMAL(65,30) NOT NULL,
    "latitude" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserShipping_pkey" PRIMARY KEY ("userShippingId")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserShipping_userId_key" ON "UserShipping"("userId");

-- AddForeignKey
ALTER TABLE "UserShipping" ADD CONSTRAINT "UserShipping_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
