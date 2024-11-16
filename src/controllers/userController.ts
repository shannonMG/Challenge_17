import { Request, Response } from 'express';
import User from '../models/User';

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
