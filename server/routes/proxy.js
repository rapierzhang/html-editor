import koaRouter from 'koa-router';
import { getProxy, postProxy } from '../controller/proxy';

const router = koaRouter();

// 设置url前缀
router.prefix('/api/');

router.get('/proxy', getProxy);

router.post('/proxy', postProxy);

export default router;
