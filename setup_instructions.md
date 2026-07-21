# NexusCommerce MERN Stack Local Setup & Run Guide

This guide provides instructions to install dependencies, run a local MongoDB database, start the Node.js Express backend API server, and launch the Vite React frontend client.

---

## 🛠️ Step 1: Install Node.js & npm

Since Node.js is not yet installed in your system PATH, download it to run the React developer server and Express backend.

1. **Download Node.js**:
   Go to the official download page: **[Node.js Downloads](https://nodejs.org/en/download/)** and download the Windows Installer (`.msi`) for the **LTS (Long Term Support)** version.
2. **Install**:
   Run the `.msi` file and follow the setup wizard. Make sure the option to **"Add to PATH"** is checked.
3. **Verify**:
   Open a new PowerShell window and run:
   ```powershell
   node -v
   npm -v
   ```
   Confirm that both commands output version numbers.

---

## 🍃 Step 2: Set Up MongoDB Database

The application connects to a MongoDB database to persist operator accounts, catalog presets, cart queues, and margin variables.

### Option A: Local MongoDB Community Server (Recommended)
1. **Download**:
   Go to **[MongoDB Community Server Download](https://www.mongodb.com/try/download/community)** and download the Windows `.msi` installer.
2. **Install**:
   Follow the installer instructions. Ensure **"Install MongoDB as a Service"** is checked (this runs the database in the background automatically).
3. **MongoDB Compass**:
   During setup, leave "Install MongoDB Compass" checked. This provides a GUI to visually inspect your tables, cart collections, and user collections.

### Option B: Cloud Database (MongoDB Atlas)
If you prefer not to install MongoDB locally:
1. Create a free account at **[MongoDB Atlas](https://www.mongodb.com/cloud/atlas)**.
2. Create a free shared cluster and copy your **connection URI** (e.g. `mongodb+srv://<username>:<password>@cluster.mongodb.net/nexuscommerce`).
3. Create a `.env` file inside the `/server` folder and set:
   ```env
   MONGO_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/nexuscommerce
   ```

---

## 🚀 Step 3: Run the Application

Once Node.js and MongoDB are installed, launch the client and server.

### 1. Start the Express Backend Server
1. Open a PowerShell terminal and navigate to the `/server` directory:
   ```powershell
   cd "C:\agent\New folder\server"
   ```
2. Install npm packages:
   ```powershell
   npm install
   ```
3. Start the Node server:
   ```powershell
   npm start
   ```
   *(The terminal will show: `[Database] MongoDB Connected...` and `[Server] Express active on port 5000`)*.

### 2. Start the Vite React Frontend Client
1. Open a second PowerShell terminal and navigate to the `/client` directory:
   ```powershell
   cd "C:\agent\New folder\client"
   ```
2. Install npm packages:
   ```powershell
   npm install
   ```
3. Start the Vite React development server:
   ```powershell
   npm run dev
   ```
   *(Vite will spin up the local server on **`http://localhost:3000`**)*.

---

## 🔍 How to Verify and Run Flows

1. Open your browser and navigate to **`http://localhost:3000`**. You will see the dark-mode MERN storefront landing page.
2. Click **Login** -> click **Create an Account** to register a new operator email and password.
3. Log in -> navigate to **Settings** -> set a default margin of `75%` and click save (persists directly in MongoDB).
4. Return to **Marketplace** -> select **View Production Pipeline** for a product -> click **Initiate Pipeline** (runs the background segmentations, LLM taxonomy classifiers, and audits).
5. Edit descriptions and parameters in-place, then click **Add to Cart** -> go to **Cart** to compile Shopify variant JSON arrays and download standard bulk import CSV sheets.
