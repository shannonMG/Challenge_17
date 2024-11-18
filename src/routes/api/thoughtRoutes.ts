// routes/userRoutes.ts
import express from 'express';
import { createThought, getAllThoughts, getThoughtById, updateThought, deleteThought, addReaction, removeReaction } from '../../controllers/thoughtController';

const router = express.Router();


router.post('/', createThought);
router.get('/', getAllThoughts);
router.get('/:id', getThoughtById);
router.put('/:id', updateThought);
router.delete('/:id', deleteThought)
router.route('/:id/reactions').post(addReaction)
router.route('/:id/reactions/:reactionId').delete(removeReaction);

export default router;
