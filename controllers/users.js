const userRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

userRouter.get('/', async (req, res) => {
    const users = await User.find({})
    .populate('blogs', { url: 1, title: 1, author: 1});

    res.json(users);
})

userRouter.post('/', async (req, res, next) => {
    const { username, name, password } = req.body;

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
        username: username,
        name: name,
        password: passwordHash
    })

    user.save().then(saved => {
        res.status(201).json(saved);
    })
    .catch(err => next(err));
})
module.exports = userRouter;