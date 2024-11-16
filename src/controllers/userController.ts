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
      .select('-__v'); // Exclude the __v field if desired

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

    // Optional: Remove the user's associated thoughts
    await Thought.deleteMany({ username: user.username });

    res.json({ message: 'User and associated thoughts deleted successfully.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const addFriend = async (req: Request, res: Response) => {
  try {
    const { userId, friendId } = req.body;

    // Step 1: Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(friendId)) {
      return res.status(400).json({ message: 'Invalid user ID(s).' });
    }

    // Step 2: Prevent users from adding themselves as friends
    if (userId === friendId) {
      return res.status(400).json({ message: 'User cannot add themselves as a friend.' });
    }

    // Convert IDs to ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const friendObjectId = new mongoose.Types.ObjectId(friendId);

    // Step 3: Check if both users exist
    const user = await User.findById(userObjectId);
    const friend = await User.findById(friendObjectId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    if (!friend) {
      return res.status(404).json({ message: 'Friend not found.' });
    }

    // Step 4: Check if the friend is already in the user's friends list
    if (!user.friends.some(friend => friend.equals(friendObjectId))) {
      user.friends.push(friendObjectId);
      await user.save();
    }

    // Step 5: Add userId to friend's friends list for bidirectional friendship
    if (!friend.friends.some(f => f.equals(userObjectId))) {
      friend.friends.push(userObjectId);
      await friend.save();
    }

    res.status(200).json({
      message: 'Friendship added successfully.',
      user,
      friend
    });
  } catch (error) {
    console.error('Error adding friend:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const deleteFriend = async (req: Request, res: Response) => {
  try {
    console.log('Received body:', req.body); // Log the incoming request body

    const { userId, friendId } = req.body;

    console.log('Parsed userId:', userId);
    console.log('Parsed friendId:', friendId);

    if (!userId || !friendId) {
      return res.status(400).json({ message: 'Missing userId or friendId.' });
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(friendId)) {
      console.error('Invalid ObjectId(s)');
      return res.status(400).json({ message: 'Invalid user ID(s).' });
    }

    // Rest of your code remains the same
    res.status(200).json({ message: 'IDs are valid.' });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

