const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    ProductName:{
        type: String,
        required: true
    },
    Product: {
        type: String,
        required: true,
    },
    StudentTeamID:{
        type: String,
        required: true,
    },
    ProjectID:{
        type: String,
        required: true,
    },
    Visibility: {
        type: Number,
        required: true,
        default: 1
    }
});

const productModel = mongoose.model("product", productSchema);

module.exports = { productModel };