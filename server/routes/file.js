const router = require('koa-router')();
const controller = require('../controller/file');

// 设置url前缀
router.prefix('/api/file');

router.post('/upload', controller.fileUpload);

module.exports = router;
