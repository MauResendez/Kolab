const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator/check');
const config = require('config');
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../../models/User');

// Get api/auth
// Authorizes users
// Will be public
// Middleware auth is implemented to instantly check if there's a valid token exists or not
router.get('/', auth, async (req, res) => {
    try
    {
        const user = await User.findById(req.user.id).select('-password'); // Gets all of the user info excluding the password
        res.json(user);
    }
    catch (err)
    {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Post api/auth
// Gets token to be able to go to private routes (Logging in)
// Will be public
router.post('/', [
    check('email', 'Please include a valid email').isEmail(), // Checks for specific error. First param is what variable you're checking, second is error message
    check('password', 'Password is required').exists(), // Checks for specific error. First param is what variable you're checking, second is error message 
], async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try
    {
        // See if user exists
        let user = await User.findOne({ email: email });

        if(!user)
        {
            return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }]});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch)
        {
            return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }]});
        }

        const payload = {
            user: {
                id: user.id
            }
        }

        // Lets you get a jwt token from your payload and own config secret to use to authenticate access on private routes

        jwt.sign(payload, config.get('jwtSecret'), 
        {
            expiresIn: 360000
        }, 
        (err, token) => {
            if(err)
            {
                throw err;
            }

            res.json({ token });
        });


    }
    catch (err)
    {
        console.error(err.message);
        res.status(500).send('Server error');
    }

});

module.exports = router;