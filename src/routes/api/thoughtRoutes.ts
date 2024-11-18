// routes/userRoutes.ts
import express from 'express';
import { createThought, getAllThoughts, getThoughtById, updateThought, deleteThought, addReaction, removeReaction } from '../../controllers/thoughtController';

const router = express.Router();

// POST /api/users - Create a new user
router.post('/', createThought);
router.get('/', getAllThoughts);
router.get('/:id', getThoughtById);
router.put('/:id', updateThought);
router.delete('/:id', deleteThought)
router.route('/:id/reactions').post(addReaction)
router.route('/:thoughtId/reactions/:reactionId').delete(removeReaction);



// ... other routes

export default router;
