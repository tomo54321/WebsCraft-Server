const mongoose = require("mongoose");
const string_to_slug = require("../helpers/string_to_slug");

const CategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: null
    },
    forums: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Forum"
        }
    ],
    slug: {
        type: String,
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

CategorySchema.pre("save", next => {
    this.slug = string_to_slug(this.name);
    this.updatedAt = Date.now();
    next();
})

module.exports = mongoose.model("Category", CategorySchema);