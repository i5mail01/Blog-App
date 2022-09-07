//Include
const express  = require('express');
const router = express.Router();
const Post = require('../models/Post');
const urlSlug = require('url-slug');
const path = require('path');
const User = require('../models/User');
const Category = require('../models/Category');


//Add Post Page
router.get('/new', (req,res) => {
    //if admin control
    if(req.session.isAdmin){
        return Category.find({})
                       .then(categories =>{
                        res.render('site/addpost', {categories:categories.map(c=> c.toJSON()), 
                                                    active:{addpost:true},
                                                    pageTitle:"New Post"})
                    });
    }else {
        res.redirect('/users/login');
    }
});


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

router.get("/search", (req, res) => {
    if (req.query.search) {
       const regex = new RegExp(escapeRegex(req.query.search), 'gi');
       Post.find({"title":regex})
           .populate({path:'author', model:User})
           .populate({path:'category', model:Category})
           .sort({$natural:-1})
           .then(posts =>{
              Category.find({})
                      .then(categories =>{
                        res.render('site/blog', {posts:posts.map(p=> p.toJSON()),
                                                 categories:categories.map(c=> c.toJSON()),
                                                 active:{blog:true}});
                    })
            })
    }
});



router.get('/category/:categoryId', (req, res)=>{
    Post.find({category:req.params.categoryId})
        .populate({path:'author', model:User})
        .populate({path:'category', model:Category})
        .sort({$natural:-1})
        .then(posts =>{
            Category.find({})
                    .then(categories =>{
                        res.render('site/blog', {posts:posts.map(p=> p.toJSON()),
                                                 categories:categories.map(c=> c.toJSON()),
                                                 active:{blog:true}});
                    })
        })
});



router.get('/:slugTitle', (req,res) => {
    Post.findOne({slugTitle:req.params.slugTitle})
        .populate({path:'author', model:User})
        .populate({path:'category', model:Category})
        .then(post=>{
            Category.find({})
                    .then(categories =>{
                        Post.find({})
                            .populate({path:'author', model:User})
                            .populate({path:'category', model:Category})
                            .sort({$natural:-1})
                            .then(posts =>{
                                res.render('site/post', {post:post.map(p=> p.toJSON()), 
                                                         categories:categories.map(c=> c.toJSON()),
                                                         posts:posts});
                            })
        })
    });
});


router.post('/add',(req,res) => {
    var uniqueSlug=urlSlug(req.body.title, {
        separator: '_',
        transformer: urlSlug.transformers.lowercase
    });
      

    function slugify(countSlug) {
        Post.findOne({slugTitle:uniqueSlug},(err,post)=>{
            if (post===null) {
                req.body.slugTitle=uniqueSlug;
                if (req.files!=null){
                    let post_image = req.files.post_image;
                    post_image.name= (uniqueSlug).slice(-5);
                    post_image.mv(path.resolve(__dirname, '../public/img/postimages', post_image.name));
                    var imagePath = `/img/postimages/${post_image.name}`;
                }
                else{
                    var imagePath = null;
                }


                Post.create({
                    ...req.body,
                    post_image: imagePath,
                    author : req.session.userId,
                    category:req.body.category,
                });
                console.log(req.body);
            } else {
                countSlug ++
                uniqueSlug += "_" + String(countSlug)
                slugify(countSlug)
            }
        })
    }
    var countSlug = 0
    slugify(countSlug)
    req.session.sessionFlash = {
        type: 'alert alert-success',
        message: 'Successful...'
    };
    res.redirect('/blog');
});


module.exports = router;