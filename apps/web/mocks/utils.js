import {HttpResponse} from "msw";
const encoder = new TextEncoder()

export const createResolver = (content, convertor) => () => {
    const stream = new ReadableStream({
        async start(controller) {
            try {
                let index = 0;
                const messages = convertor(content)

                const timer = setInterval(() => {
                    if (index >= messages.length && timer) {
                        clearInterval(timer);
                        controller.close();
                        return
                    }
                    controller.enqueue(encoder.encode(JSON.stringify(messages[index]) + '\n\n'));
                    index += 1;

                }, 60)

            } catch (e) {
                console.error(e);
            }
        },
    });
    // ...and respond to them using this JSON response.
    return new HttpResponse(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            Connection: "keep-alive",
        },
    });
}
