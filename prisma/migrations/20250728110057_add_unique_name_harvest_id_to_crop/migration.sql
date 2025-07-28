/*
  Warnings:

  - A unique constraint covering the columns `[harvestId,name]` on the table `Crop` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Crop_harvestId_name_key" ON "Crop"("harvestId", "name");
