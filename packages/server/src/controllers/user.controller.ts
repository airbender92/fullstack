import { Request, Response } from 'express'
import User from '../models/user.model'
import { errorResponse, successResponse } from '../utils/responseUtil'


export const createUser = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const newUser = new User({ username, password });
        const savedUser = await newUser.save();
        successResponse(res, 201, savedUser);

    } catch (err) {
        errorResponse(res, 500, 'Failed to create user');

    }
}

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        successResponse(res, 200, users);

    } catch (error) {
        errorResponse(res, 500, 'Failed to fetch users');
    }
}