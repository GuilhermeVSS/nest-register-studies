/*
  Warnings:

  - A unique constraint covering the columns `[producerId,name]` on the table `Farm` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Farm_producerId_name_key" ON "Farm"("producerId", "name");
