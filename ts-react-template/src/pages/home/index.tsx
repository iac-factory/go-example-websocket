import React from "react";

import CXS from "classnames";
import Styles from "./index.module.scss";

import type * as W from "../../web-workers/example/main";

const CX = CXS.bind(Styles);

export const Page = () => {
    const classes = {
        page: CX({}, Styles.page)
    };

    const worker: Worker = React.useMemo(() => new Worker(new URL("../../web-workers/example/main.ts", import.meta.url)), []);
    const [message, setMessage] = React.useState<{ loading: boolean, value: string }>({
        loading: true,
        value: null
    });

    React.useEffect(() => {
        if (window.Worker) {
            const input: W.Event = {
                uri: "ws://localhost:8080/web-socket",
                payload: JSON.stringify({
                    interval: 3000,
                    delay: 1000
                })
            };

            worker.postMessage(input);
        }
    }, [worker]);

    React.useEffect(() => {
        if (window.Worker) {
            worker.onmessage = (e: MessageEvent<string>) => {
                // console.log(e);
                const output = JSON.parse(e.data);

                setMessage((initial) => ({
                    ...initial,
                    loading: false,
                    value: JSON.stringify(output, null, 4)
                }));
            };
        }
    }, [worker]);

    return (
        <div className={classes.page}>
            Hello World
            <p>
                {
                    (message.loading) ? ("Loading Web-Worker...") : (message.value)
                }
            </p>
        </div>
    );
};

export default Page;
