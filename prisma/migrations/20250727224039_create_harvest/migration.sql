-- CreateTable
CREATE TABLE "Harvest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "farmId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Harvest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Harvest_farmId_idx" ON "Harvest"("farmId");

-- CreateIndex
CREATE INDEX "Harvest_year_idx" ON "Harvest"("year");

-- CreateIndex
CREATE UNIQUE INDEX "Harvest_farmId_year_key" ON "Harvest"("farmId", "year");

-- AddForeignKey
ALTER TABLE "Harvest" ADD CONSTRAINT "Harvest_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;
