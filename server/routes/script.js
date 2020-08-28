import koaRouter from 'koa-router';
import { scriptGet, scriptSave, scriptDelete,  scriptList, openSSH, initDir } from '../controller/script';

const router = koaRouter();

// 设置url前缀
router.prefix('/api/script');

router.get('/list', scriptList);

router.get('/get', scriptGet);

router.post('/save', scriptSave);

router.post('/delete', scriptDelete)

router.post('/open-ssh', openSSH);

router.post('/init-dir', initDir);

export default router;
