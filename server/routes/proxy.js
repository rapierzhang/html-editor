const router = require('koa-router')();
const controller = require('../controller/proxy');
// 设置url前缀
router.prefix('/api/');

router.get('/proxy', controller.getProxy);

router.post('/proxy', controller.postProxy);

module.exports = router;
