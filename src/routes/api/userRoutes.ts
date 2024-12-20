// routes/userRoutes.ts
import express from 'express';
import { createUser, getAllUsers, getUserById, updateUser, deleteUser, addFriend, removeFriend} from '../../controllers/userController';

const router = express.Router();


router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.route('/:userId/friends/:id').post(addFriend);
router.route('/:userId/friends/:id').delete(removeFriend);

export default router;
