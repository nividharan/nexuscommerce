const FALLBACK_PRESETS = [
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
        rawImg: "src/assets/backpack_raw.jpg",
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
        rawImg: "src/assets/chair_raw.jpg",
        studioImg: "src/assets/chair_studio.jpg"
    },
    {
        id: "headphones",
        rawNotes: "Wireless active noise cancelling headphones. 40mm audio drivers. 40hr battery life. Soft memory foam earcups.",
        cost: 4500,
        category: "Electronics > Audio",
        title: "Hyperion ANC Wireless Studio Headphones",
        shortDesc: "Immerse yourself in high-fidelity sound. Features active noise cancellation to block ambient noise, crystal-clear mic clarity, and ultra-soft memory ear cushions.",
        specs: [
            { label: "Drivers", value: "40mm Custom Neodymium Audio Drivers" },
            { label: "ANC", value: "Hybrid Active Noise Cancellation (-35dB)" },
            { label: "Playtime", value: "40 Hours continuous playback" },
            { label: "Connectivity", value: "Bluetooth 5.3 + 3.5mm AUX jack" }
        ],
        tags: ["headphones", "wireless audio", "noise cancelling", "anc headphones", "studio sound"],
        sku: "HYPERION-ANC-BLK",
        rawImg: "src/assets/backpack_raw.jpg",
        studioImg: "src/assets/backpack_studio.jpg"
    },
    {
        id: "ringlight",
        rawNotes: "18-inch LED ring light. Bi-color temperature, tripod stand, phone holder. USB powered, wireless remote control.",
        cost: 2200,
        category: "Electronics > Photography",
        title: "Lumina Studio 18\" Bi-Color Ring Light & Stand",
        shortDesc: "Professional lighting for live streaming, product photography, and video creation. Equipped with dimmable color temperature controls and sturdy phone mount.",
        specs: [
            { label: "Ring Diameter", value: "18-inch High-Lumen LED Panel" },
            { label: "Color Temp", value: "3200K - 5600K Dimmable Kelvin" },
            { label: "Stand", value: "Adjustable 75\" Aluminum Tripod" },
            { label: "Controls", value: "Dual knob + Wireless Bluetooth Remote" }
        ],
        tags: ["ring light", "studio lighting", "photography gear", "video lighting", "streaming setup"],
        sku: "LUMINA-RING-18",
        rawImg: "src/assets/chair_raw.jpg",
        studioImg: "src/assets/chair_studio.jpg"
    },
    {
        id: "waterbottle",
        rawNotes: "Vacuum insulated water bottle. 1 Liter capacity. Keeps drinks cold for 24 hours or hot for 12 hours. BPA free steel.",
        cost: 850,
        category: "Home > Drinkware",
        title: "ZenHydro 1L Vacuum Insulated Steel Flask",
        shortDesc: "Keep your beverages icy cold or piping hot all day long. Built with double-wall food-grade 18/8 stainless steel and a sweat-proof matte finish.",
        specs: [
            { label: "Capacity", value: "1000ml / 32oz Volume" },
            { label: "Insulation", value: "Double-Wall Vacuum Insulation" },
            { label: "Retention", value: "24 Hours Cold / 12 Hours Hot" },
            { label: "Lid", value: "Leakproof Straw & Spout Cap Included" }
        ],
        tags: ["water bottle", "insulated flask", "stainless steel", "drinkware", "gym bottle"],
        sku: "ZENHYDRO-1L-SLT",
        rawImg: "src/assets/backpack_raw.jpg",
        studioImg: "src/assets/backpack_studio.jpg"
    },
    {
        id: "drone",
        rawNotes: "4K HDR camera drone. 3-axis gimbal, 31 min flight time, 10km HD video transmission. GPS auto-return mode.",
        cost: 24500,
        category: "Electronics > Drones",
        title: "Titan X 4K HDR Camera Aerial Drone",
        shortDesc: "Capture breathtaking aerial cinematography with 4K HDR video, 3-axis motorized gimbal stabilization, and smart GPS auto-return safety tracking.",
        specs: [
            { label: "Camera Sensor", value: "1/2.3\" CMOS 12MP 4K HDR" },
            { label: "Gimbal", value: "3-Axis Mechanical Stabilization" },
            { label: "Flight Time", value: "Up to 31 Minutes per battery" },
            { label: "Range", value: "10km HD Low-Latency Video Stream" }
        ],
        tags: ["drone", "4k camera drone", "aerial photography", "quadcopter", "tech gear"],
        sku: "TITANX-DRONE-4K",
        rawImg: "src/assets/chair_raw.jpg",
        studioImg: "src/assets/chair_studio.jpg"
    }
];

module.exports = FALLBACK_PRESETS;
