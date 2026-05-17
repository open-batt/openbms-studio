import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {
    MockBmsDataProvider,
    TauriBmsDataProvider,
} from "@/contexts/BmsDataContext";
// TODO: Remove mock setup before shipping with a live BMS device
import { setupMocks } from "./mocks";
setupMocks();

const BmsProvider = import.meta.env.DEV
    ? MockBmsDataProvider
    : TauriBmsDataProvider;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <BmsProvider>
            <App />
        </BmsProvider>
    </React.StrictMode>,
);
