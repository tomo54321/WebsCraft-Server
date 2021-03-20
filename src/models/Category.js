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

CategorySchema.pre("save", async function() {
    this.slug = string_to_slug(this.name);

    const count = await this.constructor.countDocuments({ 
        slug: this.slug,
        _id: {
            $ne: this.id
        }
    });
    if(count > 0){
        this.slug = `${this.slug}${count}`;
    }

    this.updatedAt = Date.now();
    
});

module.exports = mongoose.model("Category", CategorySchema);