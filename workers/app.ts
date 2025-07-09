import { Hono } from 'hono';
import { createRequestHandler } from 'react-router';

const app = new Hono();

// API 路由
app.get('/api/*', (c) => {
  // 这里可以添加你的 API 端点
  return c.json({ message: 'API endpoint' });
});

// 对于所有其他路由，返回 SPA
app.get('*', (c) => {
  const requestHandler = createRequestHandler(
    () => import('virtual:react-router/server-build'),
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
