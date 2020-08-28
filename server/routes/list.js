import koaRouter from 'koa-router';
import { listGet } from '../controller/list'

const router = koaRouter();

// 设置url前缀
router.prefix('/api/list');

router.post('/get', listGet);

export default router;
