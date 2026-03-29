-- DropForeignKey
ALTER TABLE "DayNote" DROP CONSTRAINT "DayNote_userId_fkey";

-- DropTable
DROP TABLE "DayNote";

-- AlterTable
ALTER TABLE "Crew" ADD COLUMN "crewCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Crew_crewCode_key" ON "Crew"("crewCode");
