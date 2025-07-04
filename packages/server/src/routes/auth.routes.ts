import { Router} from 'express'
import {login, refreshToken } from '../controllers/auth.controller'

const router = Router();

// @ts-ignore
router.post('/login', login);
// @ts-ignore
router.post('/refresh-token', refreshToken);

export default router;