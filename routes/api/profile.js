const express = require('express');
const { Router } = require('express');
const router = express.Router();

// Get api/profile
// Gets a profile
// Will be public
router.get('/', (req, res) => {
    res.send('Profile route');
});

module.exports = router;