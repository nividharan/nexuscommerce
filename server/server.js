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
const { getCart, addToCart, removeFromCart, getSettings, updateSettings } = require("./controllers/cartController");
const { createCheckoutSession, handleWebhook, getBillingStatus } = require("./controllers/billingController");

// -------------------------------------------------------------
// SEED INITIAL PRESETS IF DATABASE IS EMPTY
// -------------------------------------------------------------
const seedDatabase = async () => {
    try {
        const count = await Product.countDocuments();
        if (count === 0) {
            console.log("[Server] Seeding initial database presets...");
            const presets = [
                {
                    id: "backpack",
                    rawNotes: "Grey minimalist nylon backpack. Has pockets, water resistant, laptop compartment. Sturdy straps. Clean look.",
                    cost: 1800,
                    category: "Apparel > Backpacks & Bags",
                    title: "Aegis Minimalist Waterproof Travel Backpack",
                    shortDesc: "The ultimate streamlined companion for urban commuters and daily travelers. Engineered from high-density, water-resistant ballistic nylon to protect all your devices.",
                    specs: [
                        { label: "Material", value: "1680D Waterproof Ballistic Nylon" },
                        { label: "Compartment", value: "Padded sleeve fits up to 15.6\" Laptop" },
                        { label: "Hardware", value: "Weatherproof zippers & steel buckles" },
                        { label: "Straps", value: "Ergonomic mesh padding with trolley sleeve" }
                    ],
                    tags: ["laptop backpack", "waterproof backpack", "travel bag", "minimalist design", "commuter gear"],
                    sku: "AEGIS-BKPK-GRY",
                    rawImg: "src/assets/backpack_raw.jpg",
                    studioImg: "src/assets/backpack_studio.jpg"
                },
                {
                    id: "chair",
                    rawNotes: "Black office desk chair. Swivel mesh. Lumbar support. Adjustable armrests and height. Sturdy metal base.",
                    cost: 3600,
                    category: "Furniture > Office Chairs",
                    title: "Vortex Mesh Ergonomic Office Chair",
                    shortDesc: "Experience elite ergonomic support during long work hours. Featuring adaptive lumbar alignment and dynamic airflow mesh engineered for prolonged daily productivity.",
                    specs: [
                        { label: "Backrest", value: "High-elasticity breathable cooling mesh" },
                        { label: "Lumbar Support", value: "Adaptive dynamic pressure relief" },
                        { label: "Armrests", value: "3D height & rotation adjustable" },
                        { label: "Base", value: "Heavy-duty steel base with silent casters" }
                    ],
                    tags: ["ergonomic chair", "office chair", "mesh desk chair", "lumbar support", "home office"],
                    sku: "VORTEX-CHAIR-BLK",
                    rawImg: "src/assets/chair_raw.jpg",
                    studioImg: "src/assets/chair_studio.jpg"
                },
                {
                    id: "watch",
                    rawNotes: "Futuristic smart watch. Health monitoring, fitness tracker, AMOLED display, wireless charging. Slate dark theme.",
                    cost: 2900,
                    category: "Electronics > Wearable Technology",
                    title: "Aura Pro Smart Health & Active Watch",
                    shortDesc: "A premium wearable device tracking real-time heart rate, sleep quality, and performance telemetry. Features high-res AMOLED display and premium widgets.",
                    specs: [
                        { label: "Display", value: "1.43\" AMOLED Always-On Screen" },
                        { label: "Telemetry", value: "SpO2, heart-rate, and stress monitoring" },
                        { label: "Battery Life", value: "Up to 14 days of typical smart usage" },
                        { label: "Waterproof", value: "5ATM swimming-grade resistance" }
                    ],
                    tags: ["smart watch", "fitness tracker", "health monitor", "wearable tech", "amoled display"],
                    sku: "AURA-WATCH-PRO",
                    rawImg: "src/assets/backpack_raw.jpg", // fallback to existing asset
                    studioImg: "src/assets/backpack_studio.jpg"
                },
                {
                    id: "desk",
                    rawNotes: "Standing desk, dual-motor. Smart memory control panel. Cable organizer. Solid wood oak tabletop. Solid frame.",
                    cost: 12000,
                    category: "Furniture > Office Desks",
                    title: "Ascend Dual-Motor Standing Desk Workspace",
                    shortDesc: "Upgrade your productivity with a high-performance standing desk. Equipped with dual quiet motors, smart touch memory settings, and solid oak finish.",
                    specs: [
                        { label: "Desktop Size", value: "55\" x 28\" Solid Oak Tabletop" },
                        { label: "Motors", value: "Dual electric heavy-duty lifts (<45dB)" },
                        { label: "Height Range", value: "24.5\" to 50\" adjustable elevation" },
                        { label: "Capacity", value: "350 lbs dynamic load allowance" }
                    ],
                    tags: ["standing desk", "height adjustable", "office desk", "ergonomic workspace", "dual motor"],
                    sku: "ASCEND-DESK-OAK",
                    rawImg: "src/assets/chair_raw.jpg", // fallback to existing asset
                    studioImg: "src/assets/chair_studio.jpg"
                }
            ];
            await Product.insertMany(presets);
            console.log("[Server] Seeding completed successfully.");
        }
    } catch (err) {
        console.error(`[Server] Seeding failed: ${err.message}`);
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
