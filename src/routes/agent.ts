// 大模型路由
import { Router } from 'express';

const router = Router();

router.post('/chat', async (req, res) => {
  const { messages } = req.body;
  // const response = await myAgent.run(messages);
  const response = '我是后端返回内容';
  console.log(response);
  res.json({ response });
});

export default router;
