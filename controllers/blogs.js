const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');


blogsRouter.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find({})
            .populate('user', { username: 1, name: 1})
            .exec();

        res.json(blogs);
    } catch (err) {
        console.error('Error fetching: ', err);
        res.status(500).json({ error: 'server'});
    }
})

blogsRouter.post('/', async (req,res, next) => {
    try {
    const token = req.token;
    
    if(!token.id) {
        return res.status(401).json({ error : 'invalid token'});
    }
    const user = await User.findById(token.id);
    console.log(user);
    const blog = new Blog({
        title: req.body.title,
        author: req.body.author,
        url: req.body.url,
        likes: req.body.likes === undefined ? 0 : req.body.likes,
        user: user.id
    })

    const saved = await blog.save();
    user.blogs = user.blogs.concat(saved._id);
    await user.save();
    res.status(201).json(saved);
    } catch (err) {
        console.error('Error creating blog: ', err);
        res.status(401).json({ error: 'Invalid token '});
    }
    
    
})

blogsRouter.delete('/:id', async (req, res, next) => {
    const token = req.token;
    const blogId = req.params.id;

    if(!token.id) {
        res.status(401).json({ error : 'invalid token'});
    }

    const user = await User.findById(token.id);
    const blog = await Blog.findById(blogId);

    if(blog.user.toString() === user.id.toString()) {
        await Blog.findByIdAndRemove(req.params.id);
        res.status(204).json({ message: 'deletion succesful'});
    } else {
        res.status(401).json({error : "wrong user"});
    }
})

blogsRouter.put('/:id', (req, res, next) => {
    const body = req.body;
      
    const blog = {
        likes: body.likes
    }

    Blog.findByIdAndUpdate(req.params.id, blog, { new: true })
    .then(updatedBlog => {
        res.json(updatedBlog)
    })
    .catch(error => next(error));
})

module.exports = blogsRouter;