/**
 * Express Boot-time Environmental Compliance Guard Middleware
 * Ensures all required environment variables are mapped prior to server initialization
 */
const verifyEnvironmentCompliance = () => {
    const requiredKeys = [
        'NODE_ENV', 
        'PORT', 
        'MONGODB_URI', 
        'JWT_SECRET', 
        'PRODUCTION_FRONTEND_URL'
    ];

    console.log("🛡️ Running environment variables validation checks...");

    for (const key of requiredKeys) {
        const value = process.env[key];
        if (value === undefined || value === null || value.toString().trim() === '') {
            console.error("\n======================================================================");
            console.error(`❌ CRITICAL CONFIGURATION FAILURE: Environmental variable [${key}] is entirely unmapped inside the system environment.`);
            console.error("======================================================================\n");
            // Forcefully terminate execution to block broken instances from starting
            process.exit(1);
        }
    }

    console.log("🛡️ Environmental variables validated. Initiating secure application boot sequence.\n");
};

module.exports = { verifyEnvironmentCompliance };
