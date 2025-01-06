import { Suspense, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Flex, SegmentedControl, Theme, Button } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import WindowControls from "./components/WindowControls/index.tsx";
import { t } from "i18next";
import { useAtomValue } from "jotai";
import { isDarkThemeAtom } from "./states/theme.ts";
import { HidContext } from "./components/HidContext/index.tsx";
import { TaikoControllerSelector } from "./components/TaikoControllerSelector/index.tsx";
import { WebHIDCheckDialog } from "./components/WebHIDCheckDialog/index.tsx";
import { ConfigurePage } from "./components/ConfigurePage/index.tsx";
import { useAtom } from "jotai";
import { pageAtom } from "./states/main.ts";
import { AboutPage } from "./components/AboutPage/index.tsx";
import { TestPage } from "./components/TestPage/index.tsx";
import { SaveConfigButton } from "./components/SaveConfigButton/index.tsx";
import * as HidApi from "./utils/hid.ts";

window.invoke = invoke;
window.hidApi = HidApi;

function App() {
	const theme = useAtomValue(isDarkThemeAtom);
	const [page, setPage] = useAtom(pageAtom);

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
				overflow: "hidden",
				height: "100vh",
			}}
		>
			<HidContext />
			{import.meta.env.TAURI_ENV_PLATFORM && (
				<WindowControls
					titleChildren={t("window.title", "Steve Taiko Configurator")}
				/>
			)}
			<Flex
				gap="2"
				width="100%"
				px="3"
				py="3"
				style={{
					borderBottom: "1px solid var(--gray-a5)",
				}}
			>
				<Flex flexGrow="1" flexBasis="0">
					<TaikoControllerSelector />
				</Flex>
				<Flex flexGrow="0" flexBasis="0">
					<SegmentedControl.Root
						value={page}
						onValueChange={(v) => setPage(v as typeof page)}
					>
						<SegmentedControl.Item value="config">配置</SegmentedControl.Item>
						<SegmentedControl.Item value="test">测试</SegmentedControl.Item>
						<SegmentedControl.Item value="about">关于</SegmentedControl.Item>
					</SegmentedControl.Root>
				</Flex>
				<Flex flexGrow="1" flexBasis="0" direction="row-reverse">
					<SaveConfigButton />
				</Flex>
			</Flex>
			<div
				style={{
					flexGrow: 1,
					overflow: "auto",
					padding: "var(--space-3)",
					flexDirection: "column",
				}}
			>
				{page === "config" && <ConfigurePage />}
				{page === "test" && <TestPage />}
				{page === "about" && <AboutPage />}
			</div>
			<Suspense>
				<WebHIDCheckDialog />
			</Suspense>
		</Theme>
	);
}

export default App;
