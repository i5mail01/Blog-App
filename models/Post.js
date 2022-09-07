const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: { 
        type:String, 
        required:true 
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    content: { 
        type:String, 
        required:true 
    },
    slugTitle: { 
        type:String 
    },
    date: { 
        type:Date, 
        default:Date.now 
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required:true
    },
    post_image : {
        type: String,
        required:false
    }
});

module.exports = mongoose.model('Post', PostSchema);