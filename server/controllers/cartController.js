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

// @desc    Export catalog item or cart directly to Shopify Store Admin API
// @route   POST /api/cart/export-shopify
exports.exportToShopify = async (req, res) => {
    try {
        const { productData } = req.body;
        let settings = await Settings.findOne({ user: req.user._id });

        const shopifyDomain = settings?.shopifyDomain;
        const accessToken = settings?.shopifyAccessToken;

        // If credentials present, execute live Shopify API push
        if (shopifyDomain && accessToken) {
            const https = require("https");
            const payload = JSON.stringify({
                product: {
                    title: productData?.title || "NexusCommerce Product",
                    body_html: `<p>${productData?.shortDesc || ""}</p>`,
                    vendor: "NexusCommerce Automation",
                    product_type: productData?.category || "General",
                    tags: productData?.tags ? productData.tags.join(",") : "b2b, nexuscommerce",
                    variants: [
                        {
                            price: productData?.price || "100.00",
                            sku: productData?.sku || "NEXUS-ITEM"
                        }
                    ]
                }
            });

            const options = {
                hostname: shopifyDomain.replace(/^https?:\/\//, "").replace(/\/$/, ""),
                path: "/admin/api/2024-01/products.json",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Shopify-Access-Token": accessToken,
                    "Content-Length": Buffer.byteLength(payload)
                }
            };

            const shopifyReq = https.request(options, (shopifyRes) => {
                let responseBody = "";
                shopifyRes.on("data", chunk => responseBody += chunk);
                shopifyRes.on("end", () => {
                    try {
                        const parsed = JSON.parse(responseBody);
                        if (shopifyRes.statusCode === 201 || parsed.product) {
                            return res.status(200).json({
                                success: true,
                                liveExported: true,
                                message: "Successfully published product directly to your Shopify store!",
                                shopifyProductId: parsed.product?.id
                            });
                        } else {
                            return res.status(200).json({
                                success: true,
                                liveExported: false,
                                message: "Shopify API note: " + (parsed.errors ? JSON.stringify(parsed.errors) : "Credentials check required"),
                                payloadPreview: parsed
                            });
                        }
                    } catch (e) {
                        return res.status(200).json({ success: true, liveExported: false, message: responseBody });
                    }
                });
            });

            shopifyReq.on("error", (e) => {
                res.status(200).json({
                    success: true,
                    liveExported: false,
                    message: "Shopify connection note: " + e.message + ". Payload formatted successfully."
                });
            });

            shopifyReq.write(payload);
            shopifyReq.end();
            return;
        }

        // Default 1-click publishing status if credentials not linked yet
        res.status(200).json({
            success: true,
            liveExported: false,
            message: "1-Click Shopify Exporter Ready! Enter your Shopify Store Domain & Access Token in Account Settings to push directly to your live store.",
            samplePayload: {
                endpoint: "POST /admin/api/2024-01/products.json",
                title: productData?.title || "NexusCommerce Product Item",
                status: "active"
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
