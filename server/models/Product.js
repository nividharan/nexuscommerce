const mongoose = require("mongoose");

const SpecSchema = new mongoose.Schema({
    label: { type: String, required: true },
    value: { type: String, required: true }
});

const ProductSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    rawNotes: { type: String, required: true },
    cost: { type: Number, required: true },
    category: { type: String, required: true },
    title: { type: String, required: true },
    shortDesc: { type: String, required: true },
    specs: [SpecSchema],
    tags: [String],
    sku: { type: String, required: true },
    rawImg: { type: String, required: true },
    studioImg: { type: String, required: true }
});

module.exports = mongoose.model("Product", ProductSchema);
