/*
  Warnings:

  - The values [active,ordered,cancelled] on the enum `CartStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `expiry_date` on the `cart_items` table. All the data in the column will be lost.
  - You are about to drop the column `total_price` on the `cart_items` table. All the data in the column will be lost.
  - You are about to drop the column `meal_id` on the `carts` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `carts` table. All the data in the column will be lost.
  - You are about to drop the column `subtotal` on the `order_items` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CartStatus_new" AS ENUM ('ACTIVE', 'ORDERED', 'CANCELLED');
ALTER TABLE "public"."carts" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "carts" ALTER COLUMN "status" TYPE "CartStatus_new" USING ("status"::text::"CartStatus_new");
ALTER TYPE "CartStatus" RENAME TO "CartStatus_old";
ALTER TYPE "CartStatus_new" RENAME TO "CartStatus";
DROP TYPE "public"."CartStatus_old";
ALTER TABLE "carts" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- DropForeignKey
ALTER TABLE "carts" DROP CONSTRAINT "carts_meal_id_fkey";

-- AlterTable
ALTER TABLE "cart_items" DROP COLUMN "expiry_date",
DROP COLUMN "total_price",
ADD COLUMN     "sub_total_amount" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "carts" DROP COLUMN "meal_id",
DROP COLUMN "quantity",
ADD COLUMN     "total_price" DOUBLE PRECISION NOT NULL DEFAULT 0,
ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "subtotal",
ADD COLUMN     "sub_total_amount" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "total_amount" SET DEFAULT 0;
