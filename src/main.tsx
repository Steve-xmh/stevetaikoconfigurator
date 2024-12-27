import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n.ts";
import DarkThemeDetector from "./components/DarkThemeDetector/index.tsx";
import { Provider } from "jotai";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<Provider>
			<I18nextProvider i18n={i18n}>
				<DarkThemeDetector />
				<App />
			</I18nextProvider>
		</Provider>
	</React.StrictMode>,
);
