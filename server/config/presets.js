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
    }
];

module.exports = FALLBACK_PRESETS;
