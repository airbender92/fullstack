import { Router} from 'express'
import { getLotteryList } from '../controllers/lottery.controller'

const router = Router();

// @ts-ignore
router.get('/getLotteryByRange', getLotteryList);

export default router