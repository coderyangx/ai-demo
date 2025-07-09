import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';

import type { Route } from './+types/root';
import './app.css';

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body>
        <div id='root'>{children}</div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

// 简化错误边界，适用于 SPA
export function ErrorBoundary(props: any) {
  console.log('ErrorBoundary ', props);
  return (
    <main className='pt-16 p-4 container mx-auto'>
      <h1>404</h1>
      <p>页面出错了, 请刷新页面重试</p>
    </main>
  );
}

// "scripts": {
//   "build": "react-router build --mode=spa",
//   "cf-typegen": "wrangler types",
//   "deploy": "npm run build && wrangler deploy",
//   "dev": "react-router dev --mode=spa",
//   "preview": "npm run build && vite preview"
// }
