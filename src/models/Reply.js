const mongoose = require("mongoose");
const ReplySchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    reply: {
        type: String,
        required: true,
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

exports.ReplyModel = mongoose.model("Reply", ReplySchema);