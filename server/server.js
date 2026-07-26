const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const connectDB = require("./config/db");
const Product = require("./models/Product");

// Load Environment variables relative to backend server directory
dotenv.config({ path: path.join(__dirname, ".env") });

// Verify Environmental compliance before database connection or route handlers boot
const { verifyEnvironmentCompliance } = require("./middleware/envGuard");
verifyEnvironmentCompliance();

// Connect to Database
connectDB();

const app = express();

// Security Middlewares
app.use(helmet({
    contentSecurityPolicy: false
}));

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Limit each IP to 200 requests per window
    message: { success: false, message: "Too many API requests, please try again in 15 minutes." }
});
app.use("/api/", apiLimiter);

// Middlewares
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        // Dynamically echo back requesting origin to satisfy W3C credentialed CORS policy
        return callback(null, origin);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    credentials: true
}));
app.use(express.json());

// Import Controllers
const { signup, login, protect } = require("./controllers/authController");
const { getProducts, getProductById } = require("./controllers/productController");
const { getCart, addToCart, removeFromCart, getSettings, updateSettings, exportToShopify } = require("./controllers/cartController");
const { createCheckoutSession, handleWebhook, getBillingStatus } = require("./controllers/billingController");

// -------------------------------------------------------------
// SEED & SYNC ALL 8 CATALOG PRESETS TO DATABASE
// -------------------------------------------------------------
const FALLBACK_PRESETS = require("./config/presets");

const seedDatabase = async () => {
    try {
        console.log("[Server] Syncing 8 B2B catalog items to database...");
        for (const preset of FALLBACK_PRESETS) {
            await Product.findOneAndUpdate(
                { id: preset.id },
                preset,
                { upsert: true, new: true }
            );
        }
        console.log("[Server] Catalog synchronization complete (8 items active).");
    } catch (err) {
        console.error(`[Server] Seeding/Sync failed: ${err.message}`);
    }
};
seedDatabase();

// -------------------------------------------------------------
// ROUTES BINDING
// -------------------------------------------------------------

// Authentication Routes
app.post("/api/auth/signup", signup);
app.post("/api/auth/login", login);

// Product Catalog Routes
app.get("/api/products", getProducts);
app.get("/api/products/:id", getProductById);

// Cart Exporter Routes (Protected)
app.get("/api/cart", protect, getCart);
app.post("/api/cart", protect, addToCart);
app.delete("/api/cart/:id", protect, removeFromCart);
app.post("/api/cart/export-shopify", protect, exportToShopify);

// Settings Configuration Routes (Protected)
app.get("/api/settings", protect, getSettings);
app.post("/api/settings", protect, updateSettings);

// Billing & Subscription Routes (Protected)
app.post("/api/billing/create-checkout-session", protect, createCheckoutSession);
app.get("/api/billing/status", protect, getBillingStatus);
app.post("/api/billing/webhook", handleWebhook);

// Serve product image assets statically for visual catalog assets
app.use("/src/assets", express.static(path.join(__dirname, "../client/src/assets")));
app.use("/assets", express.static(path.join(__dirname, "../client/src/assets")));

const fs = require("fs");

// Serve client production build statically if built locally
const clientDistPath = path.join(__dirname, "../client/dist");
if (fs.existsSync(clientDistPath)) {
    app.use(express.static(clientDistPath));
}

// Fallback all non-API routing to index.html or API health check status
app.get("*", (req, res) => {
    const indexPath = path.resolve(__dirname, "../client/dist", "index.html");
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(200).json({ 
            success: true, 
            message: "NexusCommerce B2B API Server Active", 
            status: "online" 
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`[Server] Express active on port ${PORT} in ${process.env.NODE_ENV || "development"} mode.`);
});
