-- DropForeignKey
ALTER TABLE "EmailVerificationCode" DROP CONSTRAINT "EmailVerificationCode_userId_fkey";

-- DropTable
DROP TABLE "EmailVerificationCode";
