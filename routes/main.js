//Include
const express  = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const Category = require('../models/Category');
//Blog and Send Blog Posts (GET)

router.get('', (req,res) => {
    res.redirect('blog');
});


router.get('/blog', (req,res) => {
    const postPerPage = 2
    const page = req.query.page || 1
    Post.find({})
        .populate({path:'author', model:User})
        .populate({path:'category', model:Category})
        .sort({$natural:-1})
        .skip((postPerPage * page) - postPerPage)
        .limit(postPerPage)
        .then(posts =>{
            Post.countDocuments()
                .then(postCount =>{
                    Category.find({})
                            .then(categories =>{
                                res.render('site/blog', {posts:posts.map(p=> p.toJSON()),
                                                         categories:categories.map(c=> c.toJSON()),
                                                         active:{blog:true},
                                                         pageTitle:"Blog Page",
                                                         current: parseInt(page),
                                                         pages : Math.ceil(postCount/postPerPage)});
                            })
                })
        })
});


//Module Exports
module.exports = router;