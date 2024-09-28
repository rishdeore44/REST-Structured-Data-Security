const express = require('express');
const connectDB = require('./db');
const dataRoutes = require('./routes/dataRoutes');
const validateToken = require('./middleware/validateToken');
require('./auth');

const app = express();
const PORT = 3001;

connectDB();

// Middleware
app.use(express.json());
app.use(validateToken);

// Routes
app.use('/api/v1/data', dataRoutes);  // Route prefix should be set here

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
