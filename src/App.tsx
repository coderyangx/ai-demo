import React, { lazy } from 'react'
// 添加路由
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'

import ChatContainerShadcn from './pages/chat-shadcn' // shadcn
import './App.css'

const ChatShadcn = () => {
  return (
    <div className='min-h-screen bg-gray-100 p-4'>
      {/* <ChatContainer /> */}
      {/* <ChatGemini /> */}

      {/* <h3>express后端</h3> */}
      <ChatContainerShadcn />

      {/* <h3>hono后端</h3> */}
      {/* <ChatComponent /> */}
    </div>
  )
}
const Supabase = lazy(() => import('./pages/supabase'))
const Login = lazy(() => import('./pages/login'))

function App() {
  console.log('App: process.env', import.meta.env.VITE_API_BASE, import.meta.env.VITE_OPEN_API_KEY)

  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<ChatShadcn />} />
        <Route path='/chat' element={<ChatShadcn />} />
        <Route path='/supabase' element={<Supabase />} />
      </Routes>
    </Router>
  )
}

export default App
