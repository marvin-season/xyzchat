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
        return new Response(response.body.pipeThrough(new TransformStream({
            transform: (chunk, controller) => {
                try {
                    const content = JSON.parse(textDecoder.decode(chunk)).content
                    controller.enqueue('0: "' + content + '"\n')
                } catch (e) {
                }
            }
        })), {
            status: response.status,
            headers: {
                'Content-Type': 'text/event-stream; charset=utf-8',
            },
        });
    }
}
