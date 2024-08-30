// import { ChatOpenAI } from "@langchain/openai";
// import { HttpsProxyAgent } from "https-proxy-agent";
// import { LangChainAdapter } from "ai";

// export const maxDuration = 60;

// const proxyUrl = process.env.PROXY_URL || "http://localhost:3128";
// const proxyAgent = new HttpsProxyAgent(proxyUrl);

// export async function POST(req: Request) {
//   const { prompt } = await req.json();

//   const model = new ChatOpenAI({
//     model: "gpt-4-turbo",
//     temperature: 0,
//     configuration: {
//       httpAgent: proxyAgent, // Use httpAgent or httpsAgent based on your proxy protocol
//     },
//   });

//   const stream = await model.stream(prompt);

//   return LangChainAdapter.toDataStreamResponse(stream);
// }

import { streamText, StreamData } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const openai = createOpenAI({
  // example fetch wrapper that logs the input to the API call:
  fetch: async (url, options) => {
    // console.log("URL", url);
    // console.log("Headers", JSON.stringify(options!.headers, null, 2));
    // console.log(
    //   `Body ${JSON.stringify(JSON.parse(options!.body! as string), null, 2)}`
    // );

    const query = JSON.parse(options!.body! as string).messages[0].content;

    const originalResponse = await fetch(
      "https://smartvision.dcclouds.com/aiapp/i7owy6eh3jon1/api/apps/chat",
      {
        ...options,
        body: JSON.stringify({
          app_id: "1772",
          files: [],
          inputs: {},
          query,
          referenced_query: "",
          response_mode: "streaming",
          stream: true,
        }),
      }
    );

    const transformedStream = new ReadableStream({
      async start(controller) {
        const reader = originalResponse.body!.getReader();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          try {
            const decoder = new TextDecoder();
            const encoder = new TextEncoder();
            const text = decoder.decode(value).replace("data: ", "");

            const oJSON = JSON.parse(text);

            const tJSON = {
              id: oJSON.id,
              object: "chat.completion.chunk",
              created: new Date(),
              model: "qwen2-7b-instruct",
              choices: [
                {
                  index: 0,
                  delta: {
                    content: oJSON.answer,
                  },
                  logprobs: null,
                  finish_reason: null,
                },
              ],
              meta: {
                ...oJSON,
              },
            };

            const transformedText = encoder.encode(
              `data: ${JSON.stringify(tJSON)}\n\n`
            );
            // Enqueue the transformed value to the new stream
            controller.enqueue(transformedText);
          } catch (error) {
            console.error("Error", error, text);
            controller.error(error);
            break;
          }
        }

        controller.close();
      },
    });

    // console.log("Response", response.status, response.body);

    return new Response(transformedStream, {
      headers: originalResponse.headers,
      status: originalResponse.status,
      statusText: originalResponse.statusText,
    });
  },

  baseURL: "http://10.3.73.98:8000/v1",
  apiKey: "b68142afb9954d31af589032577d6d0f",
});

export async function POST(req: Request) {
  const { prompt } = await req.json();

  // optional: use stream data
  const data = new StreamData();
  data.append("call started");

  const result = await streamText({
    model: openai("Qwen2-1.5B-Instruct"),
    maxTokens: 2000,
    prompt,
    onFinish: () => {
      data.append("call completed");
      data.close();
    },
  });

  // Respond with the stream
  return result.toDataStreamResponse({ data });
}
