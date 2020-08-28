import koaRouter from 'koa-router';
import { fileUpload, listPreviewSave, fileUploadTest } from '../controller/file';

const router = koaRouter();

// 设置url前缀
router.prefix('/api/file');

router.post('/upload', fileUpload);

router.post('/list_preview_save', listPreviewSave);

router.post('/test', fileUploadTest);

export default router;
