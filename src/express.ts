// apps/server/src/index.ts
import express, { Request, Response, NextFunction } from 'express';
import honoApp from '.';
// import { serve } from '@hono/node-server';
import cors from 'cors';
import OpenAI from 'openai';
import { custom, z } from 'zod';
import { createOpenAI } from '@ai-sdk/openai';
// import { pipeDataStreamToResponse } from '@ai-sdk/node';
import { streamText, generateObject, generateText } from 'ai';
import dotenv from 'dotenv';
import { logger } from './log';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

const openaiSdk = createOpenAI({
  apiKey: process.env.FRIDAY_API_KEY,
  baseURL: 'https://aigc.sankuai.com/v1/openai/native/',
});

const openai = new OpenAI({
  // 修改friday-key
  apiKey: process.env.FRIDAY_API_KEY,
  baseURL: 'https://aigc.sankuai.com/v1/openai/native/',
  // https://aigc.sankuai.com/v1/openai/native/chat/completions
});

app.use(
  cors({
    origin: [
      'https://aicoder.dpdns.org', // client 域名
    ],
  })
);
app.use(express.json()); // 解析请求体中的json数据

const clientDistPath = path.join(__dirname, '../../../packages/client/dist');
console.log('客户端文件路径:', clientDistPath);

// 静态文件（放在 API 路由之前）
app.use(
  express.static(clientDistPath, {
    index: 'index.html',
    setHeaders: (res, filePath) => {
      // 为 HTML 文件设置缓存控制
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    },
  })
);

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// 普通对话接口
app.post('/api/agent/chat', async (req: Request, res: any) => {
  try {
    const { message } = req.body;
    const cookies = req.headers.cookie;

    if (!message) {
      logger.warn('客户端发送了空消息');
      return res.status(400).json({ error: 'Message is required' });
    }

    const completion = await openai.chat.completions.create({
      // model: 'gpt-3.5-turbo', // 使用性价比高的模型
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: message }],
      temperature: 0.2,
      // top_p: 0.2,
      // stream: true,
      // tool_choice: 'auto',
      // tools: [
      //   {
      //     type: 'function',
      //     function: {
      //       name: 'get_current_time',
      //       description: 'Get the current time',
      //       parameters: {
      //         type: 'object',
      //         properties: { time: { type: 'string', description: 'The current time' } },
      //         required: ['time'],
      //       },
      //       strict: true,
      //       // execute: async (args) => {
      //       //   return { time: new Date().toISOString() };
      //       // },
      //     },
      //   },
      // ],
    });

    // AI 回复
    const aiResponse = completion.choices[0].message.content;

    // 响应前端
    res.status(200).json({ message: aiResponse });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    logger.error({
      type: 'llm-error',
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });
    res.status(500).json({ error: 'AI 服务出错了' });
  }
});

// 流式输出接口
app.post('/api/agent/stream', async (req: Request, res: Response) => {
  const requestId = `stream-${Date.now()}`;
  try {
    // 设置响应头
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // const result = streamText({
    //   model: openaiSdk('gpt-4o-mini'),
    //   messages: req.body.messages,
    // 下面这种流式响应与 useChat 兼容性最好
    // onChunk: (chunk) => {
    //   console.log('chunk: ', chunk);
    //   res.write(
    //     `data: ${JSON.stringify({ content: chunk.chunk.textDelta })}\n\n`
    //   );
    // },
    // onFinish: () => {
    //   res.write('data: [DONE]\n\n');
    //   res.end();
    // },
    // });
    // return pipeDataStreamToResponse(result.toDataStream(), res); // node.js 适配器输出
    // express 基于 nodejs 原始http模块（req、res对象），而 hono 支持 web standards（Request、Response）
    // ai-sdk 返回的是标准 web api 的 Response 对象，需要适配
    // const webResponse = result.toDataStreamResponse();
    // if (webResponse.body) {
    //   const reader = webResponse.body.getReader();
    //   try {
    //     while (true) {
    //       const { done, value } = await reader.read();
    //       if (done) break;
    //       res.write(value);
    //     }
    //     res.end();
    //   } catch (error) {
    //     res.end();
    //   }
    // } else {
    //   res.end();
    // }

    // /** openai 需要手动处理流式输出 */
    // // const stream = await openai.chat.completions.create({
    // //   model: 'gpt-4o-mini',
    // //   messages: [{ role: 'user', content: message }],
    // //   stream: true,
    // // });
    // // let fullResponse = '';
    // // for await (const chunk of stream) {
    // //   const content = chunk.choices[0]?.delta?.content || '';
    // //   console.log('大模型输出: ', content);
    // //   if (content) {
    // //     fullResponse += content;
    // //     // 发送数据
    // //     res.write(`data: ${JSON.stringify({ content })}\n\n`);
    // //   }
    // // }

    /** 使用 ai-sdk 自动流式，好像不兼容 useChat */
    const result = streamText({
      model: openaiSdk('gpt-4o-mini'),
      messages: req.body.messages,
    });
    for await (const textPart of result.textStream) {
      res.write(`data: ${JSON.stringify({ content: textPart })}\n\n`);
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    // 如果连接仍然打开，发送错误消息
    if (!res.headersSent) {
      res.status(500).json({ error: 'AI 服务出错了' });
    } else {
      res.write(`data: ${JSON.stringify({ error: 'AI 服务出错了' })}\n\n`);
      res.end();
    }
  }
});

// 测试接口
app.post('/api/agent/test', (req: Request, res: any) => {
  const { message } = req.body;
  if (!message) {
    logger.warn('测试接口收到空消息');
    return res.status(400).json({ error: 'Message is required' });
  }
  const responseText = `I am a AI agent. You said: '${message}'`;
  res.json({ response: responseText });
});

// 错误处理中间件
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error({
    type: 'server-error',
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(500).json({
    error: '服务器内部错误',
  });
});

app.listen(port, () => {
  // logger.info({
  //   type: 'server-start',
  //   message: `服务器启动成功，运行在 http://localhost:${port}`,
  //   port,
  //   environment: process.env.NODE_ENV || 'development',
  // });
  console.log(`✅[express后端服务]: is running at http://localhost:${port}`);
});

/**
 * 启动 hono 后端服务
 */
// serve(
//   {
//     fetch: honoApp.fetch,
//     port: process.env.HONO_PORT ? Number(process.env.HONO_PORT) : 8080,
//   },
//   (info) => {
//     console.log(
//       `✅[hono 后端服务]: is running at http://localhost:${info.port}`
//     );
//   }
// );
