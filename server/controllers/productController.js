const Product = require("../models/Product");
const FALLBACK_PRESETS = require("../config/presets");

// @desc    Get all products
// @route   GET /api/products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        if (products && products.length > 0) {
            return res.status(200).json({ success: true, count: products.length, data: products });
        }
        res.status(200).json({ success: true, count: FALLBACK_PRESETS.length, data: FALLBACK_PRESETS });
    } catch (error) {
        console.warn("[ProductController] DB query failed, returning fallback catalog presets:", error.message);
        res.status(200).json({ success: true, count: FALLBACK_PRESETS.length, data: FALLBACK_PRESETS });
    }
};

// @desc    Get single product details
// @route   GET /api/products/:id
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findOne({ id: req.params.id });
        if (product) {
            return res.status(200).json({ success: true, data: product });
        }
        const fallbackProd = FALLBACK_PRESETS.find(p => p.id === req.params.id);
        if (fallbackProd) {
            return res.status(200).json({ success: true, data: fallbackProd });
        }
        return res.status(404).json({ success: false, message: "Product not found" });
    } catch (error) {
        console.warn("[ProductController] DB query failed, searching fallback presets:", error.message);
        const fallbackProd = FALLBACK_PRESETS.find(p => p.id === req.params.id);
        if (fallbackProd) {
            return res.status(200).json({ success: true, data: fallbackProd });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};
