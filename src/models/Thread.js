const mongoose = require("mongoose");
const { ReplySchema } = require("./Reply");

const ThreadSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    forum: {
        type: mongoose.Types.ObjectId,
        ref: "Forum"
    },
    replies: [
        ReplySchema
    ],
    locked: {
        type: Boolean,
        default: false,
    },
    startedBy: {
        type: mongoose.Types.ObjectId,
        ref: "User"
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

ThreadSchema.pre("save", function(next){
    this.updatedAt = Date.now();
    next();
})


module.exports = mongoose.model("Thread", ThreadSchema);