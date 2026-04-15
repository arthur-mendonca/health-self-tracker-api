-- CreateTable
CREATE TABLE "AuthUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "passwordSalt" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuthUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailVerificationCode" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailVerificationCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuthUser_email_key" ON "AuthUser"("email");

-- CreateIndex
CREATE INDEX "EmailVerificationCode_userId_expiresAt_idx" ON "EmailVerificationCode"("userId", "expiresAt");

-- AddForeignKey
ALTER TABLE "EmailVerificationCode" ADD CONSTRAINT "EmailVerificationCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AuthUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
