import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { deepseek } from '@ai-sdk/deepseek';
import { streamText, createProviderRegistry } from 'ai';


export async function POST(req: Request) {
  // try{
  // const body = await req.json();
  // console.log('Full received body:', body);
  // const { messages, model } = body;

  // console.log('Received model:', model);

  // if (!model) {
  //   return new Response('Model is required', { status: 400 });
  // }

  try {
    const url = new URL(req.url);
    const model = url.searchParams.get('model');

    const body = await req.json();
    const { messages } = body;

    console.log('Received model:', model);
    if (!model) {
      return new Response('Model is required', { status: 400 });
    }

    const registry = createProviderRegistry(
      {
        openai,
        anthropic,
        deepseek,
      });


  const result = await streamText({
    model: registry.languageModel(model),
    system: 'You are a helpful assistant that answers questions about the environmental impact of AI and machine learning.',
    messages,
    maxTokens: 100,
    temperature: 0.7,
    // headers: {
    //   'Cache-Control': 'no-cache',
    //   'x-request-id': crypto.randomUUID(),
    // },
  })

  return result.toDataStreamResponse();
} catch (error) {
  console.error('API Error:', error);
  console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
  return new Response('Internal Server Error', { status: 500 });
}
}
