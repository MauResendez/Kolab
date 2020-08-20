const express = require('express');
const connectDB = require('./config/db');

// Connect database
connectDB();

const app = express();

// Init Middleware
app.use(express.json({ extended: false })); // Lets you get data from req.body
app.get('/', (req, res) =>
{
    res.send("API Running");
});

// Define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));

const PORT = process.envPORT || 5000;

app.listen(PORT, () => console.log("Server started on port " + PORT));

