import type {ReportHandler} from "web-vitals";

export const Vitals = async (entry?: ReportHandler) => {
    if (entry && entry instanceof Function) {
        import("web-vitals").then(({getCLS, getFID, getFCP, getLCP, getTTFB}) => {
            getCLS(entry);
            getFID(entry);
            getFCP(entry);
            getLCP(entry);
            getTTFB(entry);
        });
    }
};

export default Vitals;
