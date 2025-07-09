import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createRequestHandler } from 'react-router';

const app = new Hono();

// 启用 CORS（虽然同域名下不需要，但作为备用）
app.use(
  '*',
  cors({
    origin: '*',
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);

// API 路由
app.get('/api/health', (c) => {
  return c.json({
    status: 'ok',
    message: '测试成功',
    timestamp: new Date().toISOString(),
  });
});

// 对于所有其他路由，返回 SPA
app.get('*', (c) => {
  const requestHandler = createRequestHandler(
    () =>
      import('virtual:react-router/server-build').catch((err) => {
        console.log('err', err);
      }),
    'production' // 强制生产模式以提供静态资源
  );

  return requestHandler(c.req.raw, {
    cloudflare: { env: c.env, ctx: c.executionCtx },
  });
});

export default app;

/** 以下是服务端 ssr 逻辑 */
// import { Hono } from "hono";
// import { createRequestHandler } from "react-router";

// const app = new Hono();

// // Add more routes here

// app.get("*", (c) => {
//   const requestHandler = createRequestHandler(
//     () => import("virtual:react-router/server-build"),
//     import.meta.env.MODE,
//   );

//   return requestHandler(c.req.raw, {
//     cloudflare: { env: c.env, ctx: c.executionCtx },
//   });
// });

// export default app;
