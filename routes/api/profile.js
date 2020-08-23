const auth = require('../../middleware/auth');
const express = require('express');
const router = express.Router();
const { check, validationResult } = require("express-validator/check");

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { find } = require('../../models/Profile');

// Get api/profile/me
// Gets current user's profile
// Will be private

router.get('/me', auth, async (req, res) => {
    try
    {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']); // Populate brings in extra data we may need.fail
                                                                                                           // First param is from what object and the second param is the list of data variables we want

        if (!profile) // If profile doesn't exist, send message
        {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }

        res.json(profile);
    }
    catch (err)
    {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// POST api/profile
// Create or update a user profile
// Will be private

router.post('/', 
[  
    auth, 
    [
        check('status', 'Status is required').not().isEmpty(),
        check('skills', 'Skills is required').not().isEmpty(),
    ] 
], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) // If there are errors
    {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        company,
        website,
        state,
        city,
        bio,
        status,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;

    // Build profile

    const profileFields = {};

    // Get all filled out fields to put into profileFields

    profileFields.user = req.user.id;

    if (company)
    {
        profileFields.company = company;
    }

    if (website)
    {
        profileFields.website = website;
    }

    if (state)
    {
        profileFields.state = state;
    }

    if (city)
    {
        profileFields.city = city;
    }

    if (bio)
    {
        profileFields.bio = bio;
    }

    if (status)
    {
        profileFields.status = status;
    }

    if (skills)
    {
        profileFields.skills = skills.split(',').map(skill => skill.trim()); // Removes the unnecessary spaces off of a skill
    }

    // Build social object

    profileFields.social = {};

    // Get all filled out social fields to put into profileFields.social

    if(youtube)
    {
        profileFields.social.youtube = youtube;
    }

    if(twitter)
    {
        profileFields.social.twitter = twitter;
    }

    if(facebook)
    {
        profileFields.social.facebook = facebook;
    }

    if(linkedin)
    {
        profileFields.social.linkedin = linkedin;
    }

    if(instagram)
    {
        profileFields.social.instagram = instagram;
    }

    try
    {
        let profile = await Profile.findOne({ user: req.user.id });

        if (profile) // If the profile exists, just update it
        {
            profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true });

            return res.json(profile);
        }
        
        // Create your profile

        profile = new Profile(profileFields);

        await profile.save();

        res.json(profile);
    }
    catch (err)
    {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get api/profile/
// Gets all profiles
// Will be public

router.get('/', async (req, res) => 
{
    try 
    {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']); // Gets all profiles with their name and avatar from user included

        res.json(profiles);
    } 
    catch (err) 
    {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get api/profile/user/:user_id
// Gets specific profile by ID
// Will be public

router.get('/user/:user_id', async (req, res) => 
{
    try 
    {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']); // Finds profile that has given user id and takes the name and avatar with it

        if(!profile) // If profile doesn't exist, send message
        {
            return res.status(400).json({ msg: 'Profile not found' });
        }

        res.json(profile);
    } 
    catch (err) 
    {
        console.error(err.message);

        if(err.kind == 'ObjectId')
        {
            return res.status(400).json({ msg: 'Profile not found' });
        }

        res.status(500).send('Server error');
    }
});

// Delete api/profile/
// Delete profile, user, & posts
// Will be private

router.delete('/', auth, async (req, res) => 
{
    try 
    {
        // Remove profile
        await Profile.findOneAndRemove({ user: req.user.id });

        // Remove User
        await User.findOneAndRemove({ _id: req.user.id });

        res.json({ msg: 'User deleted' });
    } 
    catch (err) 
    {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Put api/profile/experience
// Add profile experience
// Will be private

router.put('/experience', [auth, 
    [
        check('title', 'Title is required').not().isEmpty(),
        check('company', 'Company is required').not().isEmpty(),
        check('from', 'From date is required').not().isEmpty(),
        check('to', 'To date is required').not().isEmpty(),
    ]], async (req, res) => 
    {
        const errors = validationResult(req);
    
        if(!errors.isEmpty()) // If errors are not empty, show error message
        {
            return res.status(400).json({ errors: errors.array() })
        }
    
        const {
            title, 
            company, 
            state,
            city, 
            from, 
            to, 
            current, 
            description
        } = req.body;
    
        const newExp = {
            title: title,
            company: company,
            state: state,
            city: city,
            from: from,
            to: to,
            current: current,
            description: description
        }
    
        try 
        {
            const profile = await Profile.findOne({ user: req.user.id });
    
            profile.experience.unshift(newExp); // unshift is pushing but most recent are first

            await profile.save();
    
            res.json(profile);
        } 
        catch (err) 
        {
            console.error(err.message);
            res.status(500).send('Server error');
        }
});

// Put api/profile/experience/:exp_id
// Delete profile experience
// Will be private

router.delete('/experience/:exp_id', auth, async (req, res) => 
{
    try 
    {
        const profile = await Profile.findOne({ user: req.user.id });

        // Get remove index
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id); // Finds the index of the experience that matches with the params id

        profile.experience.splice(removeIndex, 1); // Removes the experience that's in the specific index (removeIndex)

        await profile.save()

        res.json(profile);
    } 
    catch (err) 
    {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Put api/profile/education
// Add profile education
// Will be private

router.put('/education', [auth, 
    [
        check('school', 'School is required').not().isEmpty(),
        check('degree', 'Degree is required').not().isEmpty(),
        check('fieldofstudy', 'Field of study is required').not().isEmpty(),
        check('from', 'From date is required').not().isEmpty(),
        check('to', 'To date is required').not().isEmpty(),
    ]], async (req, res) => 
    {
        const errors = validationResult(req);
    
        if(!errors.isEmpty()) // If errors are not empty, show error message
        {
            return res.status(400).json({ errors: errors.array() })
        }
    
        const {
            school, 
            degree, 
            fieldofstudy,
            from, 
            to, 
            current, 
            description
        } = req.body;
    
        const newEdu = {
            school: school,
            degree: degree,
            fieldofstudy: fieldofstudy,
            from: from,
            to: to,
            current: current,
            description: description
        }
    
        try 
        {
            const profile = await Profile.findOne({ user: req.user.id });
    
            profile.education.unshift(newEdu); // unshift is pushing but most recent are first

            await profile.save();
    
            res.json(profile);
        } 
        catch (err) 
        {
            console.error(err.message);
            res.status(500).send('Server error');
        }
});

// Put api/profile/experience/:exp_id
// Delete profile experience
// Will be private

router.delete('/education/:edu_id', auth, async (req, res) => 
{
    try 
    {
        const profile = await Profile.findOne({ user: req.user.id });

        // Get remove index
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id); // Finds the index of the experience that matches with the params id

        profile.education.splice(removeIndex, 1); // Removes the experience that's in the specific index (removeIndex)

        await profile.save()

        res.json(profile);
    } 
    catch (err) 
    {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;