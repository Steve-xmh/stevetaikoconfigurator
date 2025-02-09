import { Suspense, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Flex, SegmentedControl, Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import WindowControls from "./components/WindowControls/index.tsx";
import { atom, useAtomValue } from "jotai";
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
import { version } from "@tauri-apps/plugin-os";
import semverLt from "semver/functions/lt";
import { LanguageSelector } from "./components/LanguageSelector/index.tsx";
import { useTranslation } from "react-i18next";
import "$/utils/audio.ts";

window.invoke = invoke;
window.hidApi = HidApi;

const hasBackgroundAtom = atom(
	import.meta.env.TAURI_ENV_PLATFORM
		? () => semverLt(version(), "10.0.22000")
		: () => true,
);

function App() {
	const theme = useAtomValue(isDarkThemeAtom);
	const hasBackground = useAtomValue(hasBackgroundAtom);
	const [page, setPage] = useAtom(pageAtom);
	const { t } = useTranslation();

	if (import.meta.env.TAURI_ENV_PLATFORM) {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		useEffect(() => {
			try {
				const win = getCurrentWindow();

				console.log(version());

				win.show();
			} catch {}
		}, []);
	}

	return (
		<Theme
			appearance={theme ? "dark" : "light"}
			hasBackground={hasBackground}
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
						<SegmentedControl.Item value="config">
							{t("topbar.page.config", "配置")}
						</SegmentedControl.Item>
						<SegmentedControl.Item value="test">
							{t("topbar.page.test", "测试")}
						</SegmentedControl.Item>
						<SegmentedControl.Item value="about">
							{t("topbar.page.about", "关于")}
						</SegmentedControl.Item>
					</SegmentedControl.Root>
				</Flex>
				<Flex flexGrow="1" flexBasis="0" gap="2" direction="row-reverse">
					<SaveConfigButton />
					<LanguageSelector />
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
