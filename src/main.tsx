import React from "react";
import ReactDOM from "react-dom/client";
import {
    MockBmsDataProvider,
    TauriBmsDataProvider,
} from "@/contexts/BmsDataContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import App from "./App";
// TODO: Remove mock setup before shipping with a live BMS device
import { setupMocks } from "./mocks";

setupMocks();

const BmsProvider = import.meta.env.DEV
    ? MockBmsDataProvider
    : TauriBmsDataProvider;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <SettingsProvider>
            <BmsProvider>
                <App />
            </BmsProvider>
        </SettingsProvider>
    </React.StrictMode>,
);
