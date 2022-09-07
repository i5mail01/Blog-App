//Include
const express  = require('express');
const router = express.Router();
const Category = require('../../models/Category');
const Post = require('../../models/Post');
const path = require('path');


//Admin Router
router.get('/', (req,res) => {
    res.render('admin/index', {pageTitle:"Admin Panel"});
});


//Categories (Get)
router.get('/categories', (req,res) => {
    Category.find({}).sort({$natural:-1}).then(categories=>{
        res.render('admin/categories',{categories:categories.map(category => category.toJSON()), 
                                       pageTitle:"Category List"});
    });
});


//Category Create (Post)
router.post('/categories', (req,res) => {
    Category.create(req.body,(error,category)=>{ //else create an object and copy and use Category.save() promise function     
        if(!error){
            res.redirect('categories');  
        }else{
            res.redirect('categories');  
        }
    });
});


//Category Delete
router.delete('/categories/:id', (req,res) => {
    if(!req.session.isAdmin){
        res.redirect('/404');
    }

    Category.deleteOne({_id:req.params.id})
            .then(()=>{
                res.redirect('/admin/categories');
    });
});


//Posts (Get)
router.get('/posts', (req,res) => {
    Post.find({})
        .populate({path:'category', model:Category})
        .sort({$natural:-1})
        .then(posts =>{
            res.render('admin/posts', {posts:posts.map(p => p.toJSON()), 
                                       pageTitle:"Post List"});
    });
});


//Post Delete 
router.delete('/posts/:id', (req,res) => {
    Post.deleteOne({_id:req.params.id})
        .then(()=>{
            res.redirect('/admin/posts');
    });
});


//Edit (GET)
router.get('/posts/edit/:id', (req,res) => {
    Post.findOne({_id:req.params.id})
        .then(post =>{
            Category.find({})
                    .then(categories=>{
                        res.render('admin/editpost', {post:post.map(p => p.toJSON()),
                                                      categories:categories.map(c => c.toJSON()),
                                                      pageTitle:"Edit Post" });
                    });
        });
});


//Edit Post (POST)
router.put('/posts/:id', (req,res) => {
    //image control
    if (req.files!=null){
        uniqueSlug=req.body.slugTitle;
        let post_image = req.files.post_image;
        post_image.name= (uniqueSlug).slice(-7);
        post_image.mv(path.resolve(__dirname, '../../public/img/postimages', post_image.name));
        var imagePath = `/img/postimages/${post_image.name}`;
    }
    else{
        var imagePath = null;
    }
    Post.findOne({_id:req.params.id})
        .then(post =>{
            post.title=req.body.title;
            post.content=req.body.content;
            post.category=req.body.category;
            post.post_image = imagePath;
            post.save().then(post=>{
                res.redirect('/admin/posts');
            });
        });
});

//Module Exports
module.exports = router;