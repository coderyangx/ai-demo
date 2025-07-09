import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  // 可以添加更多路由
  // route("/about", "routes/about.tsx"),
] satisfies RouteConfig;

/** 以下是 ssr 路由 */
// import { type RouteConfig, index } from "@react-router/dev/routes";

// export default [index("routes/home.tsx")] satisfies RouteConfig;
