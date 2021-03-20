const mongoose = require("mongoose");
const string_to_slug = require("../helpers/string_to_slug");

const ForumSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: null
    },
    slug: {
        type: String,
        required: true,
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

ForumSchema.pre("save", next => {
    this.slug = string_to_slug(this.name);
    this.updatedAt = Date.now();
    next();
})

module.exports = mongoose.model("Forum", ForumSchema);