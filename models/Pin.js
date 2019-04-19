const mongoose = require("mongoose");

const PinSchema = new mongoose.Schema({
    createdAt: String,
    title: String,
    content: String,
    image: String,
    latitude: Number,
    longitude: Number,
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    comments: [
        {
            text: String,
            createdAt: {type: Date, default: Date.now},
            author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        }
    ],
}, {timestamps: true});

module.exports = mongoose.model("Pin", PinSchema);
