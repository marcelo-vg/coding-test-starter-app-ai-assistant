import 'dotenv/config';

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing ${name}. Copy .env.example to .env and fill it in before starting the server.`,
    );
  }
  return value;
}

export const config = {
  port: Number(process.env.PORT ?? 3001),
  anthropicApiKey: required('ANTHROPIC_API_KEY'),
  model: process.env.LLM_MODEL ?? 'claude-sonnet-5',
} as const;
