const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ msg: 'Please provide username and password' });
        }

        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({ username, password });
        await user.save();

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err) return next(err);
            res.status(201).json({ token, user: { id: user.id, username: user.username } });
        });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ msg: 'Please provide username and password' });
        }

        let user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err) return next(err);
            res.json({ token, user: { id: user.id, username: user.username } });
        });
    } catch (err) {
        next(err);
    }
};

exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        next(err);
    }
};
