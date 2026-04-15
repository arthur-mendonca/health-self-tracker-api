-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "TagCategory" AS ENUM ('SYMPTOM', 'INTERFERENCE', 'TRIGGER', 'RESCUE', 'GENERAL');

-- CreateEnum
CREATE TYPE "DropTime" AS ENUM ('MORNING', 'AFTERNOON', 'EVENING', 'NONE');

-- CreateEnum
CREATE TYPE "SubstanceType" AS ENUM ('MEDICATION', 'SUPPLEMENT');

-- CreateTable
CREATE TABLE "DailyRecord" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "metrics" JSONB,
    "structuredNotes" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "TagCategory" NOT NULL DEFAULT 'GENERAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Substance" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "SubstanceType" NOT NULL,
    "defaultDose" TEXT,

    CONSTRAINT "Substance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailySubstance" (
    "id" TEXT NOT NULL,
    "dailyRecordId" TEXT NOT NULL,
    "substanceId" TEXT NOT NULL,
    "exactDose" TEXT NOT NULL,
    "notes" TEXT,
    "effectDropTime" "DropTime",
    "experiencedCrash" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "DailySubstance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyActivity" (
    "id" TEXT NOT NULL,
    "dailyRecordId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "DailyActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DailyRecordToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DailyRecordToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyRecord_date_key" ON "DailyRecord"("date");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Substance_name_key" ON "Substance"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DailySubstance_dailyRecordId_substanceId_key" ON "DailySubstance"("dailyRecordId", "substanceId");

-- CreateIndex
CREATE UNIQUE INDEX "Activity_name_key" ON "Activity"("name");

-- CreateIndex
CREATE INDEX "_DailyRecordToTag_B_index" ON "_DailyRecordToTag"("B");

-- AddForeignKey
ALTER TABLE "DailySubstance" ADD CONSTRAINT "DailySubstance_dailyRecordId_fkey" FOREIGN KEY ("dailyRecordId") REFERENCES "DailyRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailySubstance" ADD CONSTRAINT "DailySubstance_substanceId_fkey" FOREIGN KEY ("substanceId") REFERENCES "Substance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyActivity" ADD CONSTRAINT "DailyActivity_dailyRecordId_fkey" FOREIGN KEY ("dailyRecordId") REFERENCES "DailyRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyActivity" ADD CONSTRAINT "DailyActivity_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DailyRecordToTag" ADD CONSTRAINT "_DailyRecordToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "DailyRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DailyRecordToTag" ADD CONSTRAINT "_DailyRecordToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
