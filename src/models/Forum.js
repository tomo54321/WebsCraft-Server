const mongoose = require("mongoose");

const ForumSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: null
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: "Category",
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

ForumSchema.pre("save", function(next) {
    this.updatedAt = Date.now();
    next();
})

module.exports = mongoose.model("Forum", ForumSchema);