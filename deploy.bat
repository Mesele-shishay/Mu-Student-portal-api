@echo off
REM MU eStudent API - Vercel Deployment Script (Windows)
REM This script automates the deployment process to Vercel

echo 🚀 Starting deployment to Vercel...

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Vercel CLI is not installed. Please install it first:
    echo npm install -g vercel
    pause
    exit /b 1
)

REM Check if user is logged in to Vercel
vercel whoami >nul 2>&1
if errorlevel 1 (
    echo 🔐 Please login to Vercel first:
    echo vercel login
    pause
    exit /b 1
)

REM Clean previous build
echo 🧹 Cleaning previous build...
call npm run clean

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Build the project
echo 🔨 Building the project...
call npm run build

REM Check if build was successful
if not exist "dist\index.js" (
    echo ❌ Build failed! dist\index.js not found.
    pause
    exit /b 1
)

echo ✅ Build completed successfully!

REM Deploy to Vercel
echo 🚀 Deploying to Vercel...
vercel --prod

echo 🎉 Deployment completed!
echo 📋 Check your Vercel dashboard for the deployment URL
pause 