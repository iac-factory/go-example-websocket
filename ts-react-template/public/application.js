export const Application = async () => void await (async () => {
    document.addEventListener("readystatechange", async (event) => {
        if (event.target.readyState === "interactive") {
            console.debug("[Debug] (HTML-Document)", "DOM State := Interactive");
        } else if (event.target.readyState === "complete") {
            console.debug("[Debug] (HTML-Document)", "DOM State := Complete");
            void await Initialize();
            console.debug("[Debug] (HTML-Document)", "Successfully Established IO-Application HTML Element");
        }
    });

    console.debug("[Debug] (HTML-Document)", "Establishing IO-Application Callable");

    const Initialize = async () => (async () => {
        /*** Will have compatability issue(s) with Internet Explorer, and *very old* browsers */
        const IO = new Proxy(HTMLElement, Object.create({}));

        // const Shell = new Proxy(HTMLElement, Object.create({}));

        // IO.disabledFeatures = ["shadow", "canvas"];
        // Shell.disabledFeatures = ["shadow", "canvas"];

        window.customElements.define("io-application", IO, {extends: "div"});

        /***
         * @type {HTMLDivElement}
         */
        const element = window.document.getElementsByTagName("io-application").item(0);

        const preference = () => {
            const key = "theme-preference";

            if (localStorage.getItem(key)) {
                console.debug("[Debug] (HTML-Document)", "Found Theme Preference in Local-Storage", key);

                return localStorage.getItem(key)
            }

            console.debug("[Debug] (HTML-Document)", "Theme Preference Not in Local-Storage");

            const theme = (window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";

            console.debug("[Debug] (HTML-Document)", "Theme Preference", theme);

            return theme;
        };

        element.dataset.theme = preference()
    })();

    console.debug("[Debug] (HTML-Document)", "Callable was Initialized. Instantiating Tag Definition");
})();

(async () => Application())();