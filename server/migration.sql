-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firebaseId" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "mrp" REAL NOT NULL,
    "rating" REAL NOT NULL,
    "reviews" INTEGER NOT NULL,
    "img" TEXT NOT NULL,
    "tag" TEXT,
    "badge" TEXT,
    "category" TEXT NOT NULL,
    "petType" TEXT NOT NULL,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "label" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "img" TEXT NOT NULL,
    "bg" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Deal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "sub" TEXT NOT NULL,
    "badge" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "img" TEXT NOT NULL,
    "grad" TEXT NOT NULL,
    "bg" TEXT NOT NULL,
    "border" TEXT NOT NULL,
    "save" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Slide" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "gradient" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "badge" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "cta" TEXT NOT NULL,
    "dog" TEXT NOT NULL,
    "cat" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "FrontendSetting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "storeName" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "logoChar" TEXT NOT NULL,
    "footerDescription" TEXT NOT NULL,
    "facebookUrl" TEXT NOT NULL,
    "instagramUrl" TEXT NOT NULL,
    "youtubeUrl" TEXT NOT NULL,
    "whatsappNumber" TEXT NOT NULL,
    "logoBase64" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "User_firebaseId_key" ON "User"("firebaseId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

