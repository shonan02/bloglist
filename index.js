const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})

const Blog = mongoose.model('Blog', blogSchema);

const mongoUrl = `mongodb+srv://root:root@cluster1.sqbexiy.mongodb.net/Blog?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(mongoUrl);

app.get('/api/blogs', (req, res) => {
    Blog.find({})
        .then(blogs => res.json(blogs));
})

app.post('/api/blogs', (req,res) => {
    const blog = new Blog(req.body);

    blog.save().then(saved => {
        res.status(201).json(saved);
    })
})


const PORT = 3003;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
})