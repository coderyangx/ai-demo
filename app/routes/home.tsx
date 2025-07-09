import type { Route } from './+types/home';
import { Welcome } from '../welcome/welcome';
import Chat from '@/chat';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'React SPA App' },
    { name: 'description', content: 'Welcome to React SPA!' },
  ];
}

// 移除 loader，改为客户端数据获取
export default function Home() {
  return (
    <div>
      <Chat />
    </div>
  );
  // return <Welcome message='Hello from SPA!' />;
}
