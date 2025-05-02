import type { NextApiRequest, NextApiResponse } from 'next';
import { renderTemplate } from '@/lib/renderTemplate';
import { PromptObject } from '@/lib/types';
import { experimental_streamText } from '@vercel/ai';

export const config = {
  runtime: 'edge'
};

export default async function handler(req: Request) {
  const payload: PromptObject = await req.json();

  const prompt = renderTemplate(payload.template, payload.variables);

  const response = await experimental_streamText({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    stream: true
  });

  return new Response(response.body, {
    headers: { 'Content-Type': 'text/event-stream' }
  });
}
