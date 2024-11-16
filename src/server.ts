import express from 'express';
import connectDB from './config/connection';
import userRoutes from './routes/userRoutes';

const app = express();
app.use(express.json());

// Connect to the database
connectDB();

app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
