const Cart = require("../models/Cart");
const Settings = require("../models/Settings");

// @desc    Get current user's cart
// @route   GET /api/cart
exports.getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }
        res.status(200).json({ success: true, data: cart.items });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add item to cart
// @route   POST /api/cart
exports.addToCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }

        const newItem = req.body;
        cart.items.push(newItem);
        await cart.save();

        res.status(200).json({ success: true, data: cart.items });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
exports.removeFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        // Filter out item
        cart.items = cart.items.filter(item => item.id !== req.params.id);
        await cart.save();

        res.status(200).json({ success: true, data: cart.items });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get user baseline setting variables
// @route   GET /api/settings
exports.getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne({ user: req.user._id });
        if (!settings) {
            settings = await Settings.create({ user: req.user._id });
        }
        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update user settings
// @route   POST /api/settings
exports.updateSettings = async (req, res) => {
    try {
        const { defaultMargin, defaultShipping, defaultFee, defaultCurrency, shopifyDomain, shopifyAccessToken, activePlan } = req.body;

        let settings = await Settings.findOne({ user: req.user._id });
        if (!settings) {
            settings = new Settings({ user: req.user._id });
        }

        if (defaultMargin !== undefined) settings.defaultMargin = defaultMargin;
        if (defaultShipping !== undefined) settings.defaultShipping = defaultShipping;
        if (defaultFee !== undefined) settings.defaultFee = defaultFee;
        if (defaultCurrency !== undefined) settings.defaultCurrency = defaultCurrency;
        if (shopifyDomain !== undefined) settings.shopifyDomain = shopifyDomain;
        if (shopifyAccessToken !== undefined) settings.shopifyAccessToken = shopifyAccessToken;
        if (activePlan !== undefined) settings.activePlan = activePlan;

        await settings.save();
        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
