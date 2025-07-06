import { Router} from 'express'
import {login, refreshToken, getPermissions } from '../controllers/auth.controller'

const router = Router();

// @ts-ignore
router.post('/login', login);
// @ts-ignore
router.post('/refresh-token', refreshToken);
// @ts-ignore
router.get('/permissions', getPermissions);

export default router;