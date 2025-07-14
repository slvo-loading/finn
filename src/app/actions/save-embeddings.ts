'use server';
import { embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';
import { supabase } from '@/lib/supabase';

const embedding_model = openai.embedding('text-embedding-ada-002');
const MAX_CHARS = 1000;

function sentenceChunk(text: string, maxLen = MAX_CHARS): string[] {
  const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) ?? [text];
  const chunks: string[] = [];
  let current = '';

  for (const s of sentences) {
    if ((current + s).length > maxLen) {
      chunks.push(current.trim());
      current = s;
    } else {
      current += s;
    }
  }
  if (current) chunks.push(current.trim());
  return chunks;
}

export async function saveEmbeddings(messageId: string, fullText: string) {
    console.log("Saving embeddings for message:", messageId);
    const chunks = sentenceChunk(fullText);
    const { embeddings } = await embedMany({
      model: embedding_model,
      values: chunks,
    });
  
    const rows = embeddings.map((vec, i) => ({
      message_id: messageId,
      chunk_index: i,
      content: chunks[i],
      embedding: vec,
    }));
  
    const { error } = await supabase
    .from('message_embeddings')
    .insert(rows)
    .select();

    if (error) {
      console.error("Error saving embeddings:", error);
    }
  }
  