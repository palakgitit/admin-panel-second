const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },

        lastName: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },

        mobile: {
            type: String,
            default: "",
            trim: true,
        },

        city: {
            type: String,
            default: "",
            trim: true,
        },

        dob: {
            type: Date,
        },

        hobby: {
            type: String,
            default: "",
            trim: true,
        },

        gender: {
            type: String,
            enum: ["Male", "Female", "Other", ""],
            default: "",
        },

        address: {
            type: String,
            default: "",
            trim: true,
        },

        role: {
            type: String,
            default: "User",
            trim: true,
        },

        bio: {
            type: String,
            default: "",
            trim: true,
        },

        avatar: {
            type: String,
            default: "default.png",
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);