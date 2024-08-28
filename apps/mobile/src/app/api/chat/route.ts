import { streamText } from "ai";
import { ollama } from "ollama-ai-provider";

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const result = await streamText({
    maxTokens: 1024,
    model: ollama("gemma:2b-instruct"),
    prompt,
  });

  return result.toDataStreamResponse();
}
