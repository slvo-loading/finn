import { createMem0 } from '@mem0/vercel-ai-provider';

export const mem0 = createMem0({
  provider: 'openai', // or 'anthropic', 'mistral', etc.
  mem0ApiKey: process.env.MEM0_API_KEY || '',       // store in .env
  apiKey: process.env.OPENAI_API_KEY || '',         // store in .env
  config: {
    compatibility: 'strict',
  },
});
