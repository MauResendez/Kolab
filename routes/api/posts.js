const express = require('express');
const router = express.Router();
const { check, validationResult} = require('express-validator');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// Post api/posts
// Will create a post
// Will be private
router.post('/', 
[
    auth, 
    [
        check('text', 'Text is required').not().isEmpty()
    ]
], async (req, res) => 
{
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({ errors: errors.array() });
    }

    try 
    {
        const user = await User.findById(req.user.id).select('-password');

        const newPost = new Post
        ({
            text: req.body.text,
            first_name: user.first_name,
            last_name: user.last_name,
            avatar: user.avatar,
            user: req.user.id
        });

        const post = await newPost.save();

        res.json(post);
    } 
    catch (err) 
    {
        console.error(err.message);
        res.status(500).send('Server error');
    } 
});

// Get all api/posts
// Will get all posts
// Will be private
router.get('/', auth, async (req, res) =>
{
    try 
    {
        const posts = await Post.find().sort({ date: -1}); // Sorts it from most recent to least

        res.json(posts);
    } 
    catch (err) 
    {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get all api/posts/:id
// Will get a specific post
// Will be private
router.get('/:id', auth, async (req, res) =>
{
    try 
    {
        const post = await Post.findById(req.params.id);

        if(!post) // In case there isn't a post with the id given
        {
            return res.status(404).json({ msg: 'Post not found' });
        }

        res.json(post);
    } 
    catch (err) 
    {
        console.error(err.message);

        if(err.kind === 'ObjectId') // If id given is not in ObjectId format, send msg
        {
            return res.status(404).json({ msg: 'Post not found' });
        }

        res.status(500).send('Server error');
    }
});

// Delete all api/posts/:id
// Will delete a specific post
// Will be private
router.delete('/:id', auth, async (req, res) => 
{
    try 
    {
        const post = await Post.findById(req.params.id);

        if(!post) // In case there isn't a post with the id given
        {
            return res.status(404).json({ msg: 'Post not found' });
        }

        if(post.user.toString() !== req.user.id) // If post's user's id is not the same as current user's id, send an error message
        {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await post.remove();

        res.json({ msg: 'Post deleted' });
    } 
    catch (err) 
    {
        console.error(err.message);

        if(err.kind === 'ObjectId') // If id given is not in ObjectId format, send msg
        {
            return res.status(404).json({ msg: 'Post not found' });
        }

        res.status(500).send('Server error');
    }
});

// Delete all api/posts/like/:id
// Will like a post
// Will be private
router.put('/:id/like', auth, async (req, res) =>
{
    try 
    {
        const post = await Post.findById(req.params.id);
        
        // Iterates through every like the post has and checks if there's one that has your id in it
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0)
        {
            return res.status(400).json({ msg: 'Post already liked' });
        }

        post.likes.unshift({ user: req.user.id });

        await post.save();

        res.json(post.likes);
    } 
    catch (err) 
    {
        console.error(err.message);

        if(err.kind === 'ObjectId') // If id given is not in ObjectId format, send msg
        {
            return res.status(404).json({ msg: 'Post not found' });
        }

        res.status(500).send('Server error');
    }
});

// Delete all api/posts/unlike/:id
// Will unlike a post
// Will be private
router.put('/:id/unlike', auth, async (req, res) =>
{
    try 
    {
        const post = await Post.findById(req.params.id);
        
        // Iterates through every like the post has and checks if there's no like that has your id in it'
        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0)
        {
            return res.status(400).json({ msg: 'Post has not yet been liked' });
        }

        // Get remove index
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id); // Finds the index of the like that matches with the user id

        post.likes.splice(removeIndex, 1);

        await post.save();

        res.json(post.likes);
    } 
    catch (err) 
    {
        console.error(err.message);

        if(err.kind === 'ObjectId') // If id given is not in ObjectId format, send msg
        {
            return res.status(404).json({ msg: 'Post not found' });
        }

        res.status(500).send('Server error');
    }
});

// Post api/posts/:id/comment
// Will comment on a post
// Will be private
router.post('/:id/comment', 
[
    auth, 
    [
        check('text', 'Text is required').not().isEmpty()
    ]
], async (req, res) => 
{
    const errors = validationResult(req);

    if(!errors.isEmpty())
    {
        return res.status(400).json({ errors: errors.array() });
    }

    try 
    {
        const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);

        const newComment =
        {
            text: req.body.text,
            first_name: user.first_name,
            last_name: user.last_name,
            avatar: user.avatar,
            user: req.user.id
        };

        post.comments.unshift(newComment);

        await post.save();

        res.json(post.comments);
    } 
    catch (err) 
    {
        console.error(err.message);
        res.status(500).send('Server error');
    } 
});

// Delete api/posts/:id/comment/:comment_id
// Will delete comment on a post
// Will be private
router.delete('/:id/comment/:comment_id', auth, async (req, res) => 
{
    try 
    {
        // const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);

        if(!post) // In case there isn't a post with the id given
        {
            return res.status(404).json({ msg: 'Post not found' });
        }

        const comment = post.comments.find(comment => comment.id === req.params.comment_id);

        if(comment.user.toString() !== req.user.id) // If post's user's id is not the same as current user's id, send an error message
        {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // Get remove index
        const removeIndex = post.comments.map(comment => comment.id.toString()).indexOf(req.params.comment_id); // Finds the index of the comment that matches commend_id with the params id

        post.comments.splice(removeIndex, 1);
        
        await post.save();
        
        res.json(post.comments);
    } 
    catch (err) 
    {
        console.error(err.message);
        res.status(500).send('Server error');
    } 
});

module.exports = router;