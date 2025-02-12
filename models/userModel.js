const mongoose = require("mongoose");

const CommentsSchema = mongoose.Schema({
    postId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    }],
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    
    Status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})


const User = mongoose.model("User", CommentsSchema);

module.exports = User;