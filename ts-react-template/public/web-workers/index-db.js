(async () => onmessage = function (event) {
    window.indexedDB.databases().then((data) => {
        postMessage(data);
    });

    postMessage("Getting Data ...");
})();


