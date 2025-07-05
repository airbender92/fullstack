import { Router} from 'express'
import { getLotteryFrequency } from '../controllers/lottery.controller'

const router = Router();

// @ts-ignore
router.get('/', getLotteryFrequency);

export default router