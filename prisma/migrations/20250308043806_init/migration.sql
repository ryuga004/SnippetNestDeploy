-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "coverImage" TEXT,
    "points" INTEGER NOT NULL DEFAULT 0,
    "bio" TEXT,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "socialId" TEXT,
    "statsId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Social" (
    "id" TEXT NOT NULL,
    "github" TEXT,
    "twitter" TEXT,
    "linkedin" TEXT,

    CONSTRAINT "Social_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stats" (
    "id" TEXT NOT NULL,
    "contributions" INTEGER NOT NULL DEFAULT 0,
    "rank" INTEGER NOT NULL DEFAULT 0,
    "problemSolved" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_socialId_key" ON "User"("socialId");

-- CreateIndex
CREATE UNIQUE INDEX "User_statsId_key" ON "User"("statsId");

-- CreateIndex
CREATE UNIQUE INDEX "Social_github_key" ON "Social"("github");

-- CreateIndex
CREATE UNIQUE INDEX "Social_twitter_key" ON "Social"("twitter");

-- CreateIndex
CREATE UNIQUE INDEX "Social_linkedin_key" ON "Social"("linkedin");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_socialId_fkey" FOREIGN KEY ("socialId") REFERENCES "Social"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_statsId_fkey" FOREIGN KEY ("statsId") REFERENCES "Stats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
