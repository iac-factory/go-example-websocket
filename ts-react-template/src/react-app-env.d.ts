declare namespace NodeJS {
    interface ProcessEnv {
        readonly NODE_ENV: "development" | "staging" | "qa" | "uat" | "pre-production" | "production" | "test";
        readonly PUBLIC_URL: string;
        readonly PORT: string;
        readonly HTTPS: string;
        readonly HOST: string;
        readonly FAST_REFRESH: string;
        readonly SKIP_PREFLIGHT_CHECK: string;
        readonly SCROLL_TRACKING: string;
        readonly GENERATE_SOURCEMAP: string;
        readonly ESLINT_NO_DEV_ERRORS: string;
        readonly DISABLE_ESLINT_PLUGIN: string;
        readonly DISABLE_NEW_JSX_TRANSFORM: string;
        readonly INLINE_RUNTIME_CHUNK: string;
        readonly SSL_CRT_FILE: string;
        readonly SSL_KEY_FILE: string;
        readonly CHOKIDAR_USEPOLLING: string;
        readonly REACT_EDITOR: string;

        readonly REACT_APP_STRICT_MODE: "true" | "";
    }
}

declare module "*.avif" {
    const src: string;
    export default src;
}

declare module "*.bmp" {
    const src: string;
    export default src;
}

declare module "*.gif" {
    const src: string;
    export default src;
}

declare module "*.jpg" {
    const src: string;
    export default src;
}

declare module "*.jpeg" {
    const src: string;
    export default src;
}

declare module "*.png" {
    const src: string;
    export default src;
}

declare module "*.webp" {
    const src: string;
    export default src;
}

declare module "*.svg" {
    import * as React from "react";

    export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;

    const src: string;
    export default src;
}

declare module "*.module.css" {
    const classes: { readonly [key: string]: string };
    export default classes;
}

declare module "*.module.scss" {
    const classes: { readonly [key: string]: string };
    export default classes;
}

declare module "*.module.sass" {
    const classes: { readonly [key: string]: string };
    export default classes;
}
