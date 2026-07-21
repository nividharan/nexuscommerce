const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({
    id: { type: String, required: true }, // unique cart item id
    presetId: { type: String, required: true },
    title: { type: String, required: true },
    shortDesc: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    cost: { type: Number, required: true },
    specs: [{
        label: { type: String, required: true },
        value: { type: String, required: true }
    }],
    sku: { type: String, required: true },
    studioImg: { type: String, required: true },
    tags: [String]
});

const CartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    items: [CartItemSchema]
});

module.exports = mongoose.model("Cart", CartSchema);
