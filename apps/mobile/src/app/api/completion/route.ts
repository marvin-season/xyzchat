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
    const originalResponse = await fetch(url, options);

    const transformedStream = new ReadableStream({
      async start(controller) {
        const reader = originalResponse.body!.getReader();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const decoder = new TextDecoder();
          // Apply your transformation here
          console.log("Transforming", decoder.decode(value));

          // Enqueue the transformed value to the new stream
          controller.enqueue(value);
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

  baseURL: "http://10.0.5.68:8000/v1",
  apiKey: "empty",
});

export async function POST(req: Request) {
  const { prompt } = await req.json();

  // optional: use stream data
  const data = new StreamData();
  data.append("call started");

  const result = await streamText({
    model: openai("qwen2-7b-instruct"),
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
