/* eslint-disable no-restricted-globals */

(async () => self.onmessage = function (e: MessageEvent<{ payload: string, uri: string }>) {
    const { uri, payload } = e.data

    const socket = new WebSocket(uri);

    // Listen for an open socket
    socket.addEventListener("open", (event) => {
        // Listen for messages
        socket.addEventListener("message", (event) => {
            const message = JSON.parse((event.data as string));
            console.debug("[Debug]", "(Web-Worker)", "(Message)", {
                server: (event.target as WebSocket).url,
                message: message
            });

            this.postMessage(JSON.stringify(message, null, 4));
        });

        // Listen for closures
        socket.addEventListener("close", (event) => {
            if (!(event.wasClean)) {
                console.warn("[Warning]", "(Web-Worker)", "(Close)", {
                    server: (event.target as WebSocket).url,
                    message: "Unexpected Internal Socket Closure"
                });
            } else {
                console.debug("[Debug]", "(Web-Worker)", "(Close)", {
                    server: (event.target as WebSocket).url,
                    message: "Clean Socket Closure"
                });
            }
        });

        try {
            const serial = JSON.parse(payload)
            console.debug("[Debug]", "(Web-Worker)", "(Open)", {
                payload: serial
            })
        } catch (e) {
            console.warn("[Warning]", "(Web-Worker)", "(Open)", "Unable to JSON.Parse payload string");
        }

        // --> Initialize Message Channel(s)
        socket.send(payload);
    });
})();

export {};

export type Event = { payload: string, uri: string };
