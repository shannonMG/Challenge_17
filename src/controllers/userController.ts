import { Request, Response } from 'express';
import User from '../models/User';
import mongoose from 'mongoose';
import Thought from '../models/Thought';

export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, email } = req.body;

    // Validate required fields
    if (!username || !email) {
      return res.status(400).json({ message: 'Username and email are required.' });
    }

    // Check if the username or email already exists
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }] 
    });

    if (existingUser) {
      return res.status(409).json({ message: 'Username or email already exists.' });
    }

    // Create the user if no duplicates are found
    const user = await User.create({ username, email });
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find()
      .populate('thoughts')
      .populate('friends')
    

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    // Validate the ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID.' });
    }

    const user = await User.findById(userId)
      .populate('thoughts')
      .populate('friends')
      .select('-__v');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { username, email } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID.' });
    }

    // Validate input
    if (!username && !email) {
      return res.status(400).json({ message: 'At least one field (username or email) is required to update.' });
    }

    // Build the update object
    const updateData: any = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate('thoughts')
      .populate('friends')
      .select('-__v');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json(updatedUser);
  } catch (error: any) {
    console.error('Error updating user:', error);

    // Handle duplicate key error (unique constraint)
    if (error.code === 11000) {
      res.status(409).json({ message: 'Username or email already exists.' });
    } else if (error.name === 'ValidationError') {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error.' });
    }
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID.' });
    }

    // Find the user and delete
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    //Remove the user's associated thoughts
    await Thought.deleteMany({ username: user.username });

    res.json({ message: 'User and associated thoughts deleted successfully.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const addFriend = async (req: Request, res: Response) => {
  console.log('Adding a friend...');
  console.log('User ID:', req.params.userId);
  console.log('Friend ID:', req.params.friendId);

  try {
    // Use findOneAndUpdate to add a friend to the user's friends list
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.id } }, // Add friend ID from params to friends array
      { runValidators: true, new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'No user found with that ID :(' });
    }

    return res.json(user);
  } catch (err) {
    console.error('Error adding friend:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const removeFriend = async (req: Request, res: Response) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.id } }, // Remove the friend using $pull
      { runValidators: true, new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'No user found with that ID :(' });
    }

    return res.json(user);
  } catch (err) {
    console.error('Error removing friend:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
