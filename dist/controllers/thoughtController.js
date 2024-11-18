import Thought from '../models/Thought';
import User from '../models/User';
export const createThought = async (req, res) => {
    try {
        const { thoughtText, username, userId } = req.body;
        // Validate required fields
        if (!thoughtText || !username || !userId) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        // Create the thought
        const thought = await Thought.create({ thoughtText, username });
        // Add the thought to the user's thoughts array
        await User.findByIdAndUpdate(userId, { $push: { thoughts: thought._id } }, { new: true });
        res.status(201).json(thought);
    }
    catch (error) {
        console.error('Error creating thought:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};
