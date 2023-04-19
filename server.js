const Koa = require('koa');
const Router = require('koa-router');
const next = require('next');
const nc = require('next-connect');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const api = nc();
api.use(require('./src/pages/api/hello'));
api.use(async (req, res, next) => {
  // 在这里添加您的 API 路由代码
  // 例如：
  if (req.method === 'POST') {
    const { name } = req.body;
    res.status = 200;
    res.body = `Hello, ${name}!`;
  } else {
    await handle(req, res);
  }
  await next();
});

const server = new Koa();
const router = new Router();
router.use('/api', api);
server.use(router.routes());

app.prepare().then(() => {
  server.listen(3000, () => {
    console.log('Server started on port 3000');
  });
});
