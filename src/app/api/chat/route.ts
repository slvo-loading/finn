import { streamText, tool } from 'ai';
import { mem0 } from '@/lib/mem0';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { addMemories } from '@mem0/vercel-ai-provider';
import { supabase } from '@/lib/supabase';


export async function POST(req: NextRequest) {

  try {
    console.log('Received request:', req.url);

    const url = new URL(req.url);
    const model = url.searchParams.get('model');
    console.log('Received model:', model);
    if (!model) {
      return new NextResponse('Model is required', { status: 400 });
    }

    const body = await req.json();
    const { messages } = body;

    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid token' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error) {
      console.error('Auth error:', error);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!user || !user.id) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    const result = await streamText({
      model: mem0(model,{user_id: user.id}),
      system: `
        You are a friendly, intelligent AI assistant who remembers important things about the user and helps them across multiple conversations. 
        When the user shares something meaningful — like a preference, goal, decision, or fact — use the "addUserMemory" tool to remember it. 
        Only call tools when it's genuinely helpful to do so. If you're unsure, just continue the conversation normally.

        If you're asked a question that needs past context, try to recall any relevant memories using your long-term memory.`,
      messages,
      maxTokens: 100,
      temperature: 0.7,
      tools: {
        add: tool({
          description: 'Store important facts, preferences, goals, or memories about the user that may be useful in future conversations.',
          parameters: z.object({
            content: z.string().describe('A detailed piece of information or context to remember about the user.'),
          }),
          async execute({ content }) {
            await addMemories([{
              role: 'user',
              content: [{ type: 'text', text: content }],},],
              { user_id: user.id }
            );
            return `Saved to memory: "${content}"`;
          },
        })},
    })

  return result.toDataStreamResponse({
    sendUsage: true,
  });
} catch (error) {
  console.error('API Error:', error);
  console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
  return new NextResponse('Internal Server Error', { status: 500 });
}
}
