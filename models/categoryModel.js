const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema({
    categoryname: {
        type: String,
        required: true
    },
    categorystatus: {
        type: Boolean,
        default: true
    },
    blogid:[ {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Blog'

    }]
}, {
    timestamps: true
})

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category