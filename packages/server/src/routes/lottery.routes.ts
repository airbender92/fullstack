import { Router} from 'express'
import { getLotteryList, checkLotteryExists } from '../controllers/lottery.controller'

const router = Router();

// @ts-ignore
router.get('/getLotteryByRange', getLotteryList);
// 新增路由
// @ts-ignore
router.post('/checkLotteryExists', checkLotteryExists);

export default router