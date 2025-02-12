const mongoose = require("mongoose");
const path = require('path');
const multer = require('multer');
const imagePath = '/uploads/userImges';

const CommentsSchema = mongoose.Schema({
    postId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    }],
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    comments: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    like: [
        {
            type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        }
    ],
    dislike: [
        {
            type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        }
    ],
    Status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

const StorageImage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', imagePath));
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now());
    }
})

CommentsSchema.statics.uploadImageFile = multer({ storage: StorageImage }).single('image');
CommentsSchema.statics.imgPath = imagePath;

const Comments = mongoose.model("Comments", CommentsSchema);

module.exports = Comments;