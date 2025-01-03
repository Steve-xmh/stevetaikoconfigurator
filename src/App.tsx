import { Suspense, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import {
	Flex,
	SegmentedControl,
	Separator,
	Text,
	Heading,
	Theme,
	TextField,
	Slider,
	Box,
	Tabs,
	Button,
} from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import WindowControls from "./components/WindowControls/index.tsx";
import { t } from "i18next";
import { useAtomValue } from "jotai";
import { isDarkThemeAtom } from "./states/theme.ts";
import { hidDevicesAtom } from "./states/main.ts";
import { TaikoVisualizerForKeyboard } from "./components/TaikoVisualizer/keyboard.tsx";
import { HidContext } from "./components/HidContext/index.tsx";
import { TaikoControllerSelector } from "./components/TaikoControllerSelector/index.tsx";
import {
	SensorVisualizer,
	SingleLabeledSensorVisualizer,
	SingleSensorVisualizer,
} from "./components/SensorVisualizer/index.tsx";
import { WebHIDCheckDialog } from "./components/WebHIDCheckDialog/index.tsx";
import { SensorSettings } from "./components/SensorSettings/index.tsx";
import { KeyBindingSettings } from "./components/KeyBindingSettings/index.tsx";

window.invoke = invoke;

function App() {
	const theme = useAtomValue(isDarkThemeAtom);
	const hidDevices = useAtomValue(hidDevicesAtom);
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
					<SegmentedControl.Root defaultValue="config">
						<SegmentedControl.Item value="config">配置</SegmentedControl.Item>
						<SegmentedControl.Item value="test">测试</SegmentedControl.Item>
					</SegmentedControl.Root>
				</Flex>
				<Flex flexGrow="1" flexBasis="0" direction="row-reverse">
					<Button variant="surface">保存设置</Button>
				</Flex>
			</Flex>
			<div
				style={{
					display: "flex",
					justifyContent: "flex-start",
					alignItems: "center",
					flexGrow: 1,
					overflow: "auto",
					padding: "var(--space-3)",
					flexDirection: "column",
				}}
			>
				<Flex
					direction="column"
					align="start"
					justify="center"
					py="5"
					gap="4"
					flexGrow="1"
				>
					<Flex direction="row" align="center" justify="center" width="100%">
						<Flex gap="4" height="15em">
							<SingleLabeledSensorVisualizer side="leftKa" />
							<SingleLabeledSensorVisualizer side="leftDon" />
						</Flex>
						<TaikoVisualizerForKeyboard
							size={256}
							sampleMethod="frame"
							fillColor="transparent"
							outlineColor="var(--gray-10)"
						/>
						<Flex gap="4" height="15em">
							<SingleLabeledSensorVisualizer side="rightDon" />
							<SingleLabeledSensorVisualizer side="rightKa" />
						</Flex>
					</Flex>

					<Tabs.Root
						defaultValue="sensor"
						style={{
							width: "30em",
						}}
					>
						<Tabs.List>
							<Tabs.Trigger value="sensor">传感设置</Tabs.Trigger>
							<Tabs.Trigger value="keybinding">按键设置</Tabs.Trigger>
						</Tabs.List>
						<Tabs.Content value="sensor">
							<SensorSettings />
						</Tabs.Content>
						<Tabs.Content value="keybinding">
							<KeyBindingSettings />
						</Tabs.Content>
					</Tabs.Root>
				</Flex>
			</div>
			<Suspense>
				<WebHIDCheckDialog />
			</Suspense>
		</Theme>
	);
}

export default App;
