const mongoose = require("mongoose");

const SettingsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    defaultMargin: {
        type: Number,
        default: 60
    },
    defaultShipping: {
        type: Number,
        default: 200
    },
    defaultFee: {
        type: Number,
        default: 3.0
    },
    defaultCurrency: {
        type: String,
        default: "INR"
    },
    shopifyDomain: {
        type: String,
        default: ""
    },
    shopifyAccessToken: {
        type: String,
        default: ""
    },
    activePlan: {
        type: String,
        default: "Free"
    }
});

module.exports = mongoose.model("Settings", SettingsSchema);
