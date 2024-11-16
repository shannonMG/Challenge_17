// routes/userRoutes.ts
import express from 'express';
import { createThought } from '../../controllers/thoughtController';

const router = express.Router();

// POST /api/users - Create a new user
router.post('/', createThought);

// ... other routes

export default router;
