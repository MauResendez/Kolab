const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator/check');
const config = require('config');
const express = require('express');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../../models/User');

// Post api/users
// Registers user
// Will be public
router.post('/', 
[
    check('first_name', 'First name is required').not().isEmpty(), // Checks for specific error. First param is what variable you're checking, second is error message
    check('last_name', 'Last name is required').not().isEmpty(), // Checks for specific error. First param is what variable you're checking, second is error message
    check('email', 'Please include a valid email').isEmail(), // Checks for specific error. First param is what variable you're checking, second is error message
    check('password', 'Please enter a password with 8 or more characters').isLength({ min: 8 }), // Checks for specific error. First param is what variable you're checking, second is error message 
], async (req, res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty())
    {
        return res.status(400).json({ errors: errors.array() });
    }

    const { first_name, last_name, email, password } = req.body;

    try
    {
        // See if user exists
        let user = await User.findOne({ email: email });

        if(user)
        {
            return res.status(400).json({ errors: [{msg: 'User already exists' }]});
        }

        // Get users gravatar

        const avatar = gravatar.url(email, {
            s: "200",
            r: "pg",
            d: 'mm'
        });

        user = new User({first_name, last_name, email, avatar, password});

        // Encrypt password

        const salt = await bcrypt.genSalt(10);

        // user.name = user.name.trim(); // To get rid of any unnecessary spaces on the start and end of the name
        user.first_name = user.first_name.trim(); // To get rid of any unnecessary spaces on the start and end of the first name
        user.last_name = user.last_name.trim(); // To get rid of any unnecessary spaces on the start and end of the last name
        user.password = user.password;

        user.password = await bcrypt.hash(password, salt);

        await user.save();

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