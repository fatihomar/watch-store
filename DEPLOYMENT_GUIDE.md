# 🚀 Deployment Guide for Watch Shop App

This guide will help you host your website for free using **Render** (for the website) and **MongoDB Atlas** (for the database).

## Prerequisites

1.  **GitHub Account**: You need an account on [github.com](https://github.com).
2.  **Git Installed**: Ensure Git is installed on your computer.

---

## Step 1: Push Code to GitHub

1.  **Initialize Git** (if not done):
    Open your terminal in the project folder and run:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```

2.  **Create a Repository on GitHub**:
    *   Go to GitHub and create a new repository (name it `watch-shop` or similar).
    *   Do **not** check "Initialize with README".

3.  **Push Code**:
    Follow the instructions on GitHub to push your existing code:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
    git branch -M main
    git push -u origin main
    ```

---

## Step 2: Set Up Database (MongoDB Atlas)

1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up.
2.  Create a **Free Cluster**.
3.  **Create a Database User**:
    *   Go to "Database Access" -> "Add New Database User".
    *   Choose a generic username (e.g., `admin`) and a strong password. **Write this password down!**
4.  **Network Access**:
    *   Go to "Network Access" -> "Add IP Address".
    *   Select "Allow Access From Anywhere" (`0.0.0.0/0`).
5.  **Get Connection String**:
    *   Click "Connect" on your cluster -> "Drivers".
    *   Copy the connection string. It looks like:
        `mongodb+srv://admin:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority`

---

## Step 3: Deploy on Render

1.  Go to [render.com](https://render.com) and sign up with your GitHub account.
2.  Click **"New +"** and select **"Web Service"**.
3.  Connect your GitHub repository.
4.  **Configure the Service**:
    *   **Name**: `watch-shop` (or whatever you like).
    *   **Region**: Frankfurt or closest to you.
    *   **Runtime**: Node.
    *   **Build Command**: `npm install`
    *   **Start Command**: `node server.js`
5.  **Environment Variables** (Important!):
    *   Scroll down to "Environment Variables".
    *   Add a new variable:
        *   **Key**: `MONGODB_URI`
        *   **Value**: Paste your MongoDB connection string from Step 2.
        *   *Check the connection string*: Replace `<password>` with your actual database password.
6.  Click **"Create Web Service"**.

---

## Step 5: Populate Database

Since this is a new database, it will be empty initially.
1.  Open your new website URL (e.g., `https://watch-shop.onrender.com`).
2.  Add `/seed-manual` to the end of the URL (e.g., `https://watch-shop.onrender.com/seed-manual`).
3.  You should see "Seeded successfully!".
4.  Go back to the homepage, and you will see your watches!

## Step 6: Success!

Your watch shop is now live on the internet.

