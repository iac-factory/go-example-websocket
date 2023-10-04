import React, {Suspense} from "react";

import {Route} from "react-router-dom";
import {Routes} from "react-router-dom";

import CXS from "classnames";
import Styles from "./index.module.scss";

const CX = CXS.bind(Styles);

export const Application = () => {
    const Home = () => {
        const classes = {
            default: CX({}, Styles.default)
        };

        const $ = React.lazy(async () => {
            await new Promise<void>((resolve) => {
                setTimeout(() => {
                    resolve();
                }, 1000);
            });

            return import("./pages/home");
        });

        return (
            <Suspense fallback={<p className={classes.default}>Loading</p>}>
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
