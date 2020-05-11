const router = require('koa-router')();
const controller = require('../controller/list');
// 设置url前缀
router.prefix('/api/list');

router.get('/get', controller.listGet);

module.exports = router;
