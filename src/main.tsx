import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// TODO: Remove mock data before shipping with a live BMS device
import { setupMocks } from "./mocks";
setupMocks();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
