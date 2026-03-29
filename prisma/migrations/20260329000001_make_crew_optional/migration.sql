-- AlterTable
ALTER TABLE "User" ALTER COLUMN "crewId" DROP NOT NULL;

-- AlterTable change foreign key constraint
ALTER TABLE "User" DROP CONSTRAINT "User_crewId_fkey";

ALTER TABLE "User" ADD CONSTRAINT "User_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew"("id") ON DELETE SET NULL ON UPDATE CASCADE;
