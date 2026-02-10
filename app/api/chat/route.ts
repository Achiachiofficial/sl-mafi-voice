import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const { text } = await generateText({
    model: google('models/gemini-1.5-flash'),
    prompt: messages[messages.length - 1].content,
  });

  return new Response(JSON.stringify({ content: text }));
}
