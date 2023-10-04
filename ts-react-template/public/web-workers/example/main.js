/* eslint-disable no-restricted-globals */

/***
 * @type {Window | (WorkerGlobalScope & Window)}
 */
const $ = self;

/***
 *
 * @param {MessageEvent<string>} e
 * @returns {Promise<void>}
 * @constructor
 */
function Handler(e) {
    console.debug("[Debug]", "(Web-Worker)", "Example", "Reading in Message Data ...");

    const data = JSON.parse(e.data);

    console.debug("[Debug]", "(Web-Worker)", "Example", { data });

    $.postMessage(JSON.stringify(data, null, 4));
}

(async () => $.onmessage = Handler)();

/// export {};
