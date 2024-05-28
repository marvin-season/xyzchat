import {StreamingTextResponse, streamText} from "ai";
import {openai} from "@ai-sdk/openai";

const textDecoder = new TextDecoder();
export async function POST(req: Request) {
    const {messages} = await req.json();
    const response = await fetch('http://localhost:3001/completion')

    // const result = await streamText({
    //     model: openai("gpt-4-turbo"),
    //     messages,
    // });
    // return new StreamingTextResponse(result.toAIStream());

    if (response.ok && response.body) {
        return new StreamingTextResponse(response.body.pipeThrough(new TransformStream({
            transform: (chunk, controller) => {
                let data = textDecoder.decode(chunk);
                controller.enqueue(JSON.parse(data).content + '\n')
            }
        })));
    }
}
