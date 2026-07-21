const User = require("../models/User");
const Settings = require("../models/Settings");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "nexus_secret_jwt_key_123456";

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: "30d"
    });
};

// @desc    Register new user
// @route   POST /api/auth/signup
exports.signup = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Create user
        const user = await User.create({ email, password });

        // Initialize user settings
        await Settings.create({ user: user._id });

        res.status(201).json({
            success: true,
            token: generateToken(user._id),
            user: { email: user.email }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Authenticate user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        // Check password match
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        res.status(200).json({
            success: true,
            token: generateToken(user._id),
            user: { email: user.email }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    JWT Auth verification middleware
exports.protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ success: false, error: "Access Denied", message: "Not authorized to access this route" });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        if (!req.user) {
            return res.status(401).json({ success: false, error: "Authentication Failed", message: "User session not found" });
        }
        next();
    } catch (error) {
        // Fall back elegantly to secure JSON error blocks instead of raw system stack traces
        const errorMsg = error.name === "TokenExpiredError" ? "Session expired" : "Invalid auth credentials";
        return res.status(401).json({ 
            success: false, 
            error: "Authentication Required", 
            message: errorMsg
        });
    }
};
