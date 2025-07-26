-- CreateTable
CREATE TABLE "Producer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cpfCnpj" TEXT NOT NULL,

    CONSTRAINT "Producer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Producer_cpfCnpj_key" ON "Producer"("cpfCnpj");

-- CreateIndex
CREATE INDEX "Producer_cpfCnpj_idx" ON "Producer"("cpfCnpj");
