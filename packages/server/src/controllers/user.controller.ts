import { Request, Response } from 'express'
import User from '../models/user.model'

export const createUser = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const newUser = new User({ username, password });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create user' });
    }
}

export const getUsers = async(req: Request, res: Response) => {
    try{
        const users = await User.find();
        res.status(200).json(users);
    } catch(error) {
        res.status(500).json({error: 'Failed to fetch users'})
    }
}