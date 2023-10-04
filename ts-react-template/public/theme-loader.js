export const Theme = async () => void await (async () => {
    const key = "theme-preference";

    const preference = () => {
        if (localStorage.getItem(key)) {
            return localStorage.getItem(key)
        }

        return (window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
    };

    const theme = {
        value: preference(),
        listener: null,
        catch: 0,
    };

    const setter = () => {
        theme.value = (theme.value) === "dark" ? "light" : "dark";

        localStorage.setItem(key, theme.value);

        reflect();
    };

    const reflect = () => {
        document.firstElementChild.setAttribute("data-theme", theme.value);

        document.querySelector("#theme-toggle")?.setAttribute("aria-label", theme.value)
    };

    window.onload = () => {
        // set on load so screen readers can get the latest value on the button
        reflect();

        function listener() {
            if (theme.listener === 1) {
                clearInterval(theme.listener);
            }

            try {
                if (theme.listener && theme.catch < 3) {
                    theme.catch++;

                    document.querySelector("#theme-toggle").addEventListener("click", setter);

                    clearInterval(theme.listener);
                } else {
                    if (theme.listener) {
                        clearInterval(theme.listener);
                    }
                }
            } catch (exception) {
                // console.warn("Warning", exception);
            }
        }

        theme.listener = setInterval(listener, 1000);
    }
})();

(async () => Theme())();