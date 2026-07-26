import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";

const CLIENT_FALLBACK_PRODUCTS = [
    {
        id: "backpack",
        cost: 1800,
        category: "Apparel > Backpacks & Bags",
        title: "Aegis Minimalist Waterproof Travel Backpack",
        shortDesc: "The ultimate streamlined companion for urban commuters and daily travelers. Engineered from high-density, water-resistant ballistic nylon to protect all your devices.",
        specs: [
            { label: "Material", value: "1680D Waterproof Ballistic Nylon" },
            { label: "Compartment", value: "Padded sleeve fits up to 15.6\" Laptop" }
        ],
        tags: ["laptop backpack", "waterproof backpack", "travel bag"],
        sku: "AEGIS-BKPK-GRY",
        rawImg: "src/assets/backpack_raw.jpg",
        studioImg: "src/assets/backpack_studio.jpg"
    },
    {
        id: "chair",
        cost: 3600,
        category: "Furniture > Office Chairs",
        title: "Vortex Mesh Ergonomic Office Chair",
        shortDesc: "Experience elite ergonomic support during long work hours. Featuring adaptive lumbar alignment and dynamic airflow mesh engineered for prolonged daily productivity.",
        specs: [
            { label: "Backrest", value: "High-elasticity breathable cooling mesh" }
        ],
        tags: ["ergonomic chair", "office chair", "mesh desk chair"],
        sku: "VORTEX-CHAIR-BLK",
        rawImg: "src/assets/chair_raw.jpg",
        studioImg: "src/assets/chair_studio.jpg"
    },
    {
        id: "watch",
        cost: 2900,
        category: "Electronics > Wearable Technology",
        title: "Aura Pro Smart Health & Active Watch",
        shortDesc: "A premium wearable device tracking real-time heart rate, sleep quality, and performance telemetry. Features high-res AMOLED display and premium widgets.",
        specs: [
            { label: "Display", value: "1.43\" AMOLED Always-On Screen" }
        ],
        tags: ["smart watch", "fitness tracker"],
        sku: "AURA-WATCH-PRO",
        rawImg: "src/assets/backpack_raw.jpg",
        studioImg: "src/assets/backpack_studio.jpg"
    },
    {
        id: "desk",
        cost: 12000,
        category: "Furniture > Office Desks",
        title: "Ascend Dual-Motor Standing Desk Workspace",
        shortDesc: "Upgrade your productivity with a high-performance standing desk. Equipped with dual quiet motors, smart touch memory settings, and solid oak finish.",
        specs: [
            { label: "Desktop Size", value: "55\" x 28\" Solid Oak Tabletop" }
        ],
        tags: ["standing desk", "height adjustable"],
        sku: "ASCEND-DESK-OAK",
        rawImg: "src/assets/chair_raw.jpg",
        studioImg: "src/assets/chair_studio.jpg"
    },
    {
        id: "headphones",
        cost: 4500,
        category: "Electronics > Audio",
        title: "Hyperion ANC Wireless Studio Headphones",
        shortDesc: "Immerse yourself in high-fidelity sound. Features active noise cancellation to block ambient noise, crystal-clear mic clarity, and ultra-soft memory ear cushions.",
        specs: [
            { label: "Drivers", value: "40mm Custom Neodymium Audio Drivers" }
        ],
        tags: ["headphones", "wireless audio", "noise cancelling"],
        sku: "HYPERION-ANC-BLK",
        rawImg: "src/assets/backpack_raw.jpg",
        studioImg: "src/assets/backpack_studio.jpg"
    },
    {
        id: "ringlight",
        cost: 2200,
        category: "Electronics > Photography",
        title: "Lumina Studio 18\" Bi-Color Ring Light & Stand",
        shortDesc: "Professional lighting for live streaming, product photography, and video creation. Equipped with dimmable color temperature controls and sturdy phone mount.",
        specs: [
            { label: "Ring Diameter", value: "18-inch High-Lumen LED Panel" }
        ],
        tags: ["ring light", "studio lighting"],
        sku: "LUMINA-RING-18",
        rawImg: "src/assets/chair_raw.jpg",
        studioImg: "src/assets/chair_studio.jpg"
    },
    {
        id: "waterbottle",
        cost: 850,
        category: "Home > Drinkware",
        title: "ZenHydro 1L Vacuum Insulated Steel Flask",
        shortDesc: "Keep your beverages icy cold or piping hot all day long. Built with double-wall food-grade 18/8 stainless steel and a sweat-proof matte finish.",
        specs: [
            { label: "Capacity", value: "1000ml / 32oz Volume" }
        ],
        tags: ["water bottle", "insulated flask"],
        sku: "ZENHYDRO-1L-SLT",
        rawImg: "src/assets/backpack_raw.jpg",
        studioImg: "src/assets/backpack_studio.jpg"
    },
    {
        id: "drone",
        cost: 24500,
        category: "Electronics > Drones",
        title: "Titan X 4K HDR Camera Aerial Drone",
        shortDesc: "Capture breathtaking aerial cinematography with 4K HDR video, 3-axis motorized gimbal stabilization, and smart GPS auto-return safety tracking.",
        specs: [
            { label: "Camera Sensor", value: "1/2.3\" CMOS 12MP 4K HDR" }
        ],
        tags: ["drone", "4k camera drone"],
        sku: "TITANX-DRONE-4K",
        rawImg: "src/assets/chair_raw.jpg",
        studioImg: "src/assets/chair_studio.jpg"
    }
];

const Marketplace = () => {
    const [products, setProducts] = useState(CLIENT_FALLBACK_PRODUCTS);
    const [loading, setLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState("All");
    const [syncingId, setSyncingId] = useState("");
    
    const { settings, addToDbCart, token } = useContext(AuthContext);
    const navigate = useNavigate();

    // Guard margin boundaries to prevent division by zero or infinite markups
    const calculatePrice = (cost) => {
        const marginVal = Math.min(Math.max(settings.defaultMargin || 60, 5), 95);
        const feeVal = Math.min(Math.max(settings.defaultFee || 3.0, 0), 20);
        
        const marginDec = marginVal / 100;
        const feeDec = feeVal / 100;
        const denominator = 1 - marginDec - feeDec;
        
        if (denominator <= 0) {
            return (cost + (settings.defaultShipping || 200)) * 3;
        }
        
        return ((cost + (settings.defaultShipping || 200)) / denominator);
    };

    const getCurrencySymbol = () => {
        return settings.defaultCurrency === "INR" || settings.defaultCurrency === "₹" ? "₹" : "$";
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get("/api/products");
                if (res.data && res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
                    setProducts(res.data.data);
                }
            } catch (err) {
                console.warn("[Marketplace] API fetch note, utilizing fallback catalog:", err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const [successId, setSuccessId] = useState("");

    // Quick add directly to cart (Saves transition friction)
    const handleQuickQueue = async (e, prod) => {
        e.preventDefault();
        e.stopPropagation();

        if (!token) {
            alert("Sign in required to add items to the cart.");
            navigate("/login");
            return;
        }

        setSyncingId(prod.id);
        const retailPrice = calculatePrice(prod.cost);
        
        const cartItem = {
            id: prod.id + "_" + Math.random().toString(36).substr(2, 4),
            presetId: prod.id,
            title: prod.title,
            shortDesc: prod.shortDesc,
            category: prod.category,
            price: retailPrice,
            cost: prod.cost,
            specs: prod.specs,
            sku: prod.sku,
            studioImg: prod.studioImg,
            tags: prod.tags
        };

        try {
            await addToDbCart(cartItem);
            setSuccessId(prod.id);
            setTimeout(() => {
                setSuccessId("");
            }, 1500);
        } catch (err) {
            console.error(err);
        } finally {
            setSyncingId("");
        }
    };

    if (loading) {
        return <div style={{ color: "var(--text-secondary)", textAlign: "center", padding: "100px" }}>Loading catalog variations...</div>;
    }

    // Filter catalog items
    const filteredProducts = products.filter(prod => {
        if (activeFilter === "All") return true;
        return prod.category.toLowerCase().includes(activeFilter.toLowerCase());
    });

    const currencySym = getCurrencySymbol();
    const categories = ["All", "Apparel", "Furniture", "Electronics"];

    return (
        <main className="app-content">
            {/* Floating non-blocking green success badge toast */}
            {successId && (
                <div style={{
                    position: "fixed",
                    bottom: "24px",
                    right: "24px",
                    background: "rgba(52, 211, 153, 0.95)",
                    color: "#0b0f19",
                    padding: "12px 20px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 15px rgba(52, 211, 153, 0.4)",
                    fontWeight: 800,
                    fontSize: "0.85rem",
                    zIndex: 1000,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.1)"
                }}>
                    <span>✓</span>
                    <span>Active queue synced successfully in MERN state!</span>
                </div>
            )}

            {/* Hero Banner */}
            <section className="card glass" style={{ padding: "2.5rem", marginBottom: "2rem", background: "linear-gradient(135deg, rgba(17, 24, 39, 0.9) 0%, rgba(6, 10, 19, 0.9) 100%)", border: "1px solid var(--border-glow)" }}>
                <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.85rem", fontWeight: "800", marginBottom: "0.5rem" }}>
                    Automated <span className="gradient-text">E-commerce Pipeline Gallery</span>
                </h1>
                <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: "1.5", maxWidth: "800px" }}>
                    Welcome to the catalog workspace. Select any variant showcase model below to calculate list prices, initiate AI background removals, audit Pydantic schema details, and add products to your Shopify export cart.
                </p>
            </section>

            {/* CRO Discovery Tabs (Category Filtering) */}
            <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", borderBottom: "1px solid var(--border-glass)", paddingBottom: "1rem" }}>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveFilter(cat)}
                        style={{
                            padding: "8px 20px",
                            fontSize: "0.8rem",
                            borderRadius: "20px",
                            background: activeFilter === cat ? "rgba(56, 189, 248, 0.08)" : "transparent",
                            border: "none",
                            position: "relative",
                            color: activeFilter === cat ? "var(--accent-cyan)" : "var(--text-secondary)",
                            fontWeight: activeFilter === cat ? "bold" : "normal",
                            cursor: "pointer",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            transform: activeFilter === cat ? "scale(1.05)" : "scale(1)"
                        }}
                    >
                        <span>{cat}</span>
                        {activeFilter === cat && (
                            <div style={{
                                position: "absolute",
                                bottom: "-17px",
                                left: "15%",
                                right: "15%",
                                height: "3px",
                                background: "linear-gradient(90deg, var(--accent-cyan) 0%, var(--accent-indigo) 100%)",
                                borderRadius: "2px",
                                boxShadow: "0 2px 10px rgba(56, 189, 248, 0.6)",
                                zIndex: 5
                            }} />
                        )}
                    </button>
                ))}
            </div>

            {/* Product Store Grid */}
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.15rem", fontWeight: "700", marginBottom: "1.25rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Active Catalog Models ({filteredProducts.length})
            </h3>
            
            <div className="marketplace-grid">
                {filteredProducts.map(prod => {
                    const retailPrice = calculatePrice(prod.cost);
                    const isSyncing = syncingId === prod.id;
                    const isSuccess = successId === prod.id;
                    return (
                        <div key={prod.id} className="product-card">
                            <div className="product-img-box">
                                <img src={`/${prod.rawImg}`} alt={prod.title} />
                            </div>
                            <div className="product-info-box">
                                <span className="detail-category" style={{ fontSize: "0.6rem", marginBottom: "0.3rem", display: "block" }}>{prod.category}</span>
                                <h4 className="product-title">{prod.title}</h4>
                                <p className="product-meta-desc">{prod.shortDesc}</p>
                                <div className="product-price-row">
                                    <span className="product-price">{currencySym}{retailPrice.toFixed(2)}</span>
                                    <span className="product-cost">{currencySym}{(prod.cost * 1.5).toFixed(0)}</span>
                                    <span className="product-margin">{settings.defaultMargin}% Margin</span>
                                </div>
                                <div style={{ display: "flex", gap: "0.75rem", marginTop: "auto" }}>
                                    <Link to={`/product?id=${prod.id}`} className="btn-secondary" style={{ flex: 1, padding: "8px", textDecoration: "none", textAlign: "center", fontSize: "0.8rem" }}>
                                        Pipeline
                                    </Link>
                                    <button 
                                        onClick={(e) => handleQuickQueue(e, prod)} 
                                        className="btn-primary" 
                                        style={{ 
                                            flex: 1, 
                                            padding: "8px", 
                                            fontSize: "0.8rem",
                                            position: "relative",
                                            overflow: "hidden"
                                        }}
                                        disabled={isSyncing || isSuccess}
                                    >
                                        {isSyncing ? (
                                            <div style={{
                                                position: "absolute",
                                                inset: 0,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                background: "rgba(56, 189, 248, 0.2)",
                                                backdropFilter: "blur(2px)"
                                            }}>
                                                <div style={{
                                                    width: "14px",
                                                    height: "14px",
                                                    border: "2px solid rgba(56, 189, 248, 0.2)",
                                                    borderTop: "2px solid var(--accent-cyan)",
                                                    borderRadius: "50%",
                                                    animation: "spin 0.8s linear infinite"
                                                }} />
                                            </div>
                                        ) : isSuccess ? (
                                            <span>✓ Done</span>
                                        ) : (
                                            <span>Quick Queue</span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </main>
    );
};

export default Marketplace;
