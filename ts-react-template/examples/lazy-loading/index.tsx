import React, {Suspense} from "react";

import {Route} from "react-router-dom";
import {Routes} from "react-router-dom";

export const Application = () => {
    const Home = () => {
        const $ = React.lazy(async () => {
            await new Promise<void>((resolve) => {
                setTimeout(() => {
                    resolve();
                }, 5000);
            });

            return import("./pages/home");
        });

        return (
            <Suspense fallback={<p>Loading</p>}>
                <$/>
            </Suspense>
        );
    };


    return (
        <Routes>
            <Route element={<Home/>} index/>
        </Routes>
    );
};

export default Application;
