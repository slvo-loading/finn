import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';


export async function POST(req: Request) {
  try{
  const { messages } = await req.json();

  const result = await streamText({
    model: openai('gpt-4o'),
    system: 'You are a helpful assistant that answers questions about the environmental impact of AI and machine learning.',
    messages,
  })

  return result.toDataStreamResponse();
} catch (error) {
  console.error('API Error:', error);
  return new Response('Internal Server Error', { status: 500 });
}
}
