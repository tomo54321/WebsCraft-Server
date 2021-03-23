const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    permissions: [
        {
            type: String
        }
    ],
    bans:[
        {
            active: {
                type: Boolean,
                default: true
            },
            banned_from: {
                type: Date,
                default: Date.now
            },
            expires: {
                type: Date,
                default: null
            },
            reason: {
                type: String,
                default: null
            },
            banned_by: {
                type: mongoose.Types.ObjectId,
                ref: "User"
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("User", UserSchema);