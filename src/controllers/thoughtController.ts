// controllers/thoughtController.ts
import { Request, Response } from 'express';
import Thought from '../models/Thought';
import User from '../models/User';
import mongoose from 'mongoose';

export const createThought = async (req: Request, res: Response) => {
  try {
    const { thoughtText, username, userId } = req.body;

    // Validate required fields
    if (!thoughtText || !username || !userId) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Create the thought
    const thought = await Thought.create({ thoughtText, username });

    // Add the thought to the user's thoughts array
    await User.findByIdAndUpdate(
      userId,
      { $push: { thoughts: thought._id } },
      { new: true }
    );

    res.status(201).json(thought);
  } catch (error) {
    console.error('Error creating thought:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const getAllThoughts = async (req: Request, res: Response) => {
  try {
    const thoughts = await Thought.find().select('-__v');
    res.json(thoughts);
  } catch (error) {
    console.error('Error fetching thoughts:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const getThoughtById = async (req: Request, res: Response) => {
  try {
    const thoughtId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(thoughtId)) {
      return res.status(400).json({ message: 'Invalid thought ID.' });
    }

    const thought = await Thought.findById(thoughtId).select('-__v');

    if (!thought) {
      return res.status(404).json({ message: 'Thought not found.' });
    }

    res.json(thought);
  } catch (error) {
    console.error('Error fetching thought:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const updateThought = async (req: Request, res: Response) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { runValidators: true, new: true }
    ).select('-__v');

    if (!thought) {
      return res.status(404).json({ message: 'Thought not found.' });
    }

    res.json(thought);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteThought = async (req: Request, res: Response) => {
  try {
    const thoughtId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(thoughtId)) {
      return res.status(400).json({ message: 'Invalid thought ID.' });
    }

    const deletedThought = await Thought.findByIdAndDelete(thoughtId);

    if (!deletedThought) {
      return res.status(404).json({ message: 'Thought not found.' });
    }

    res.json({ message: 'Thought deleted successfully.' });
  } catch (error) {
    console.error('Error deleting thought:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const addReaction = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { reactionBody, username } = req.body;

  if (!reactionBody || !username) {
    return res.status(400).json({ message: 'reactionBody and username are required.' });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid thought ID.' });
  }

  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      id,
      { $push: { reactions: { reactionBody, username } } },
      { new: true, runValidators: true }
    ).select('-__v');

    if (!updatedThought) {
      return res.status(404).json({ message: 'Thought not found.' });
    }

    res.json(updatedThought);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const removeReaction = async (req: Request, res: Response) => {
  const { id, reactionId } = req.params;

  console.log('Thought ID:', id); // For debugging
  console.log('Reaction ID:', reactionId); // For debugging

  // Validate the thought ID
  if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(reactionId)) {
    return res.status(400).json({ message: 'Invalid thought ID or reaction ID.' });
  }

  try {
    // Remove the reaction from the thought
    const updatedThought = await Thought.findByIdAndUpdate(
      id,
      { $pull: { reactions: { _id: reactionId } } },
      { new: true }
    ).select('-__v');

    if (!updatedThought) {
      return res.status(404).json({ message: 'Thought not found.' });
    }

    res.json({ message: 'Reaction deleted successfully.', updatedThought });
  } catch (error: any) {
    console.error('Error deleting reaction:', error);
    res.status(500).json({ message: error.message });
  }
};

