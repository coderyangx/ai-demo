// 工具集
import { z } from 'zod';
import { dateTools } from './date';

export const getToolsSet = (ctx: any) => {
  const tools = [
    {
      id: 'getFormFields',
      name: '获取表单字段',
      description: '获取表单字段',
      parameters: z.object({
        formId: z.string().describe('表单ID, 必填'),
      }),
    },
  ].reduce((prev, curr) => {
    prev[curr.id] = curr as any;
    return prev;
  }, {} as Record<string, any>);

  return {
    ...tools,
    ...dateTools,
  };
};
