'use server';

import { generateText } from 'ai';
import { deepseek } from '@ai-sdk/deepseek';

const stripMarkdown = (text: string): string => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove **bold**
      .replace(/\*(.*?)\*/g, '$1')     // Remove *italic*
      .replace(/__(.*?)__/g, '$1')     // Remove __bold__
      .replace(/_(.*?)_/g, '$1')       // Remove _italic_
      .replace(/`(.*?)`/g, '$1')       // Remove `code`
      .replace(/#+\s/g, '')            // Remove # headers
      .trim();
  };

export async function generateChatTitle (firstMessage: string) {
    try {
      const { text } = await generateText({
        model: deepseek("deepseek-chat"),
        prompt: `Based on this message: "${firstMessage}"
      
        Generate a concise 2-4 word title that captures the main topic or question. Examples:
        - "What is photosynthesis?" → "Photosynthesis"
        - "How do I bake a cake?" → "Cake Baking"
        - "Explain machine learning" → "Machine Learning"
        - "Debug my Python code" → "Python Debugging"

        Return only the title, no quotes or formatting:`,
        maxTokens: 20,
      });
      
      return stripMarkdown(text)
    } catch (error) {
      console.error('Error generating title:', error);
      return 'New Chat';
    }
  };