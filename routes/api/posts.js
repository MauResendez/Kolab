const express = require('express');
const { Router } = require('express');
const router = express.Router();

// Get api/users
// Gets all of the posts
// Will be public
router.get('/', (req, res) => {
    res.send('Posts route');
});

module.exports = router;