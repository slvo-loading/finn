// cost per token in USD (example: OpenAI, Anthropic, DeepSeek, etc.)
export const MODEL_COST_PER_TOKEN_USD: Record<string, number> = {
    "openai:gpt-4o": 0.00001,          // $0.01 per 1k tokens  =>  $0.00001 per token
    "anthropic:claude-3-sonnet-20240229": 0.00004,  // $0.008 per 1k tokens
    "deepseek:deepseek-chat": 0.000003, // $0.002 per 1k tokens
  };
  