import express from 'express';
import mongoose from 'mongoose';
import jsonParser from './middleware/jsonParser.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(jsonParser);

// Function to connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect('mongodb://localhost/myapp',);
    console.log('Connected Successfully to MongoDB');

    // Start the server after successful database connection
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
    });
  } catch (err) {
    console.error('Database connection error:', err);
  }
}

// Call the async function to connect to the database and start the server
connectDB();
