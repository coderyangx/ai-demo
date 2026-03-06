import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Form, Toast } from '@douyinfe/semi-ui'
import { IconUser, IconMail, IconLock, IconUserAdd } from '@douyinfe/semi-icons'
// import { signIn, signUp } from '../../services/supabase';
import './index.less'

interface AuthProps {
  onAuthSuccess?: () => void
}

const signUp = (values: { email: string; password: string }) => {}

const signIn = (values: { email: string; password: string }) => {}

export default function Auth({ onAuthSuccess }: AuthProps) {
  const navigate = useNavigate()

  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (values: { username?: string; email: string; password: string }) => {
    const { username, email, password } = values
    if (!email || !password) return Toast.error('请填写邮箱和密码')

    try {
      setLoading(true)
      if (isLogin) {
        // 登录
        // const res = await supabase.auth.signInWithOtp({ email });
        await signIn({ email, password })
        // 跳转首页
        navigate('/')
        onAuthSuccess?.()
        return Toast.success('登录成功！')
      }
      // 注册
      if (!username) {
        Toast.error('请填写用户名')
        setLoading(false)
        return
      }
      await signUp({
        email,
        password,
        options: {
          data: {
            username
          }
        }
      })
      Toast.success('注册成功！请查收验证邮件')
    } catch (error: any) {
      console.error('认证错误:', error)
      Toast.error(error.message || (isLogin ? '登录失败' : '注册失败'))
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
  }

  return (
    <div className='login-container'>
      <div className='login-card'>
        <div className='login-header'>
          <div className='login-icon'>
            {isLogin ? <IconUser size='extra-large' /> : <IconUserAdd size='extra-large' />}
          </div>
          <h2 className='login-title'>{isLogin ? '欢迎回来' : '创建账户'}</h2>
          <p className='login-subtitle'>{isLogin ? '登录您的账户以继续' : '注册一个新账户'}</p>
        </div>

        <Form
          className='login-form'
          layout='vertical'
          labelPosition='left'
          labelWidth={70}
          // getFormApi={(formApi) => (api.current = formApi)}
          // onValueChange={(values) => setEmail(values.email)}
          onSubmit={(values) => handleLogin(values)}
        >
          {!isLogin && (
            <Form.Input
              field='username'
              label='用户名'
              placeholder='请输入用户名'
              prefix={<IconUser />}
              rules={[{ required: !isLogin, message: '请输入用户名' }]}
            />
          )}
          <Form.Input
            field='email'
            label='邮箱'
            placeholder='请输入邮箱地址'
            prefix={<IconMail />}
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          />
          <Form.Input
            mode='password'
            field='password'
            label='密码'
            placeholder='请输入密码'
            prefix={<IconLock />}
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6位' }
            ]}
          />

          <Button
            htmlType='submit'
            theme='solid'
            type='primary'
            size='large'
            block
            loading={loading}
            disabled={loading}
            className='login-submit-btn'
          >
            {isLogin ? '登录' : '注册'}
          </Button>
        </Form>

        <div className='login-footer'>
          <span className='login-footer-text'>{isLogin ? '还没有账户？' : '已有账户？'}</span>
          <Button type='tertiary' onClick={toggleMode} className='login-toggle-btn'>
            {isLogin ? '立即注册' : '立即登录'}
          </Button>
        </div>
      </div>
    </div>
  )
}
