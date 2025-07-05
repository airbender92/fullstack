import { Request, Response} from 'express'
import User from '../models/user.model'
import jwt from 'jsonwebtoken'

const generateToken = (userId: string) => {
    return jwt.sign({userId}, process.env.JWT_SECRET as string, {expiresIn: '1h'});
}

const generateRefreshToken = (userId: string) => {
        return jwt.sign({userId}, process.env.JWT_REFRESH_SECRET as string, {expiresIn: '7d'});
}

export const login = async(req: Request, res: Response) => {
    try{
        const { username, password} = req.body;
        const user = await User.findOne({username})
        if(!user || !(await user.comparePassword(password))) {
            return res.status(401).json({error: 'Invalid credentials'})
        }
        const token = generateToken(user._id as string);
        const refreshToken = generateRefreshToken(user._id as string);

        res.status(200).json({token, refreshToken, userId: user._id});

    }catch(error) {
        res.status(500).json({ error: 'Internal server error'})
    }
}

export const refreshToken = async(req: Request, res: Response) => {
    try{
        const { refreshToken} = req.body;
        if(!refreshToken) {
            return res.status(401).json({error: 'Refresh token is required'})
        }
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN as string);
        const userId = (decoded as { userId: string}).userId;

        const newToken = generateToken(userId);
        const newRefreshToken = generateRefreshToken(userId);
        res.status(200).json({ token: newToken, refreshToken: newRefreshToken})
    }catch(error) {
        res.status(401).json({error: 'Invalid refresh token'})
    }

}