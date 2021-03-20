const mongoose = require("mongoose");
const ReplySchema = mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId
    },
    reply: {
        type: String
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
ReplySchema.pre("save", function(next) {
    this.updatedAt = Date.now();
    next();
})
exports.ReplySchema = ReplySchema;