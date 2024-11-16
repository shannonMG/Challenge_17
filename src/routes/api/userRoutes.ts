// routes/userRoutes.ts
import express from 'express';
import { createUser } from '../../controllers/userController';

const router = express.Router();

// POST /api/users - Create a new user
router.post('/', createUser);

// ... other routes

export default router;
