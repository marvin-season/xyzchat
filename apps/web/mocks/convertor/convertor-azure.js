export default function (content) {
    const messages = [];

    content.split('\n').forEach((line) => {
        messages.push({
            event: "message",
            content: line
        })
    })
    return messages;
}


// interface AzureMessage {
//     event: 'message' | '',
//     content: string,
// }
