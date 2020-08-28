import koaRouter from 'koa-router';
import { componentGet, componentSave, componentlist } from '../controller/component';

const router = koaRouter();

router.prefix('/api/component');

router.post('/get', componentGet);

router.post('/save', componentSave);

router.get('/list', componentlist);

export default router;
