const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Cookie parser (To read the JWT from cookies)
app.use(cookieParser());

// Enable CORS (Allows React frontend to communicate with this API)
app.use(cors({
    origin: 'http://localhost:5173', // Update this when deploying
    credentials: true // Crucial for sending cookies back and forth
}));

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// Basic route to test the server
app.get('/', (req, res) => {
  res.send('Task Manager API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port localhost:${PORT}`);
});