import { Router} from 'express'
import {login, refreshToken, getPermissions } from '../controllers/auth.controller'
import { verifyToken } from '../middleware/auth';

const router = Router();

// @ts-ignore
router.post('/login', login);
// @ts-ignore
router.post('/refresh-token', refreshToken);
// @ts-ignore
router.get('/permissions', verifyToken, getPermissions);

export default router;