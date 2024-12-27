import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import { show } from "@tauri-apps/api/app";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Button, Text, Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import WindowControls from "./components/WindowControls/index.tsx";
import { Trans } from "react-i18next";
import { t } from "i18next";
import { useAtomValue } from "jotai";
import { isDarkThemeAtom } from "./states/theme.ts";

function App() {
	const theme = useAtomValue(isDarkThemeAtom);
	if (import.meta.env.TAURI_ENV_PLATFORM) {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		useEffect(() => {
			try {
				const win = getCurrentWindow();

				win.show();
			} catch {}
		}, []);
	}

	return (
		<Theme
			appearance={theme ? "dark" : "light"}
			hasBackground={false}
			style={{
				display: "flex",
				flexDirection: "column",
			}}
		>
			<WindowControls
				titleChildren={t(
					"template.title",
					"Tauri + React + RadixUI Desktop App Template",
				)}
			/>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					flexGrow: 1,
					flexDirection: "column",
				}}
			>
				<Text>
					{t(
						"template.welcome",
						"Welcome to {tauri} + {react} + {radix} Desktop App template!",
						{
							tauri: (
								<Button key="tauri" asChild variant="ghost" size="3">
									<a href="https://tauri.app/" target="_blank" rel="noreferrer">
										Tauri
									</a>
								</Button>
							),
							react: (
								<Button key="react" asChild variant="ghost" size="3">
									<a href="https://react.dev/" target="_blank" rel="noreferrer">
										React
									</a>
								</Button>
							),
							radix: (
								<Button key="radix" asChild variant="ghost" size="3">
									<a
										href="https://www.radix-ui.com/"
										target="_blank"
										rel="noreferrer"
									>
										RadixUI
									</a>
								</Button>
							),
						},
					)}
				</Text>
			</div>
		</Theme>
	);
}

export default App;
