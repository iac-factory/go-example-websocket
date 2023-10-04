import React from "react";

import {createRoot} from "react-dom/client";

import {BrowserRouter as Router} from "react-router-dom";
import {Vitals} from "./vitals";

import "./index.scss";

const Application = React.lazy(() => import("./application"));

const Frontend = () => {
    const $ = () => (
        <Router basename={"/"}>
            <Application/>
        </Router>
    );

    if (process.env["REACT_APP_STRICT_MODE"] === "true") {
        return (
            <React.StrictMode>
                <$/>
            </React.StrictMode>
        );
    } else {
        return (<$/>);
    }
};

const Client = (identifier: string = "Application") => {
    const element = document.getElementById(identifier);

    return createRoot(element!).render(<Frontend/>);
};

Client("Application");

void Vitals(console.debug);
