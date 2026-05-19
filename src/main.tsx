import React from "react";
import ReactDOM from "react-dom/client";
import { MockBmsDataProvider } from "@/contexts/BmsDataContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import App from "./App";
// TODO: Remove mock setup before shipping with a live BMS device
import { setupMocks } from "./mocks";

setupMocks();

const BmsProvider = MockBmsDataProvider; // Use TauriBmsDataProvider in production;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <SettingsProvider>
            <BmsProvider>
                <App />
            </BmsProvider>
        </SettingsProvider>
    </React.StrictMode>,
);
