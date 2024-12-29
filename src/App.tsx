import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import { show } from "@tauri-apps/api/app";
import { getCurrentWindow } from "@tauri-apps/api/window";
import {
	Button,
	Dialog,
	DropdownMenu,
	Flex,
	RadioCards,
	SegmentedControl,
	Select,
	Spinner,
	Text,
	Theme,
} from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import WindowControls from "./components/WindowControls/index.tsx";
import { Trans } from "react-i18next";
import { t } from "i18next";
import { useAtomValue, useStore } from "jotai";
import { isDarkThemeAtom } from "./states/theme.ts";
import { hidDevicesAtom, type HidDevice } from "./states/main.ts";
import { eqSet } from "./utils/eq-set.ts";
import { TaikoVisualizer } from "./components/TaikoVisualizer/index.tsx";
import { TaikoVisualizerForKeyboard } from "./components/TaikoVisualizer/keyboard.tsx";

function App() {
	const theme = useAtomValue(isDarkThemeAtom);
	const store = useStore();
	const hidDevices = useAtomValue(hidDevicesAtom);
	if (import.meta.env.TAURI_ENV_PLATFORM) {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		useEffect(() => {
			try {
				const win = getCurrentWindow();

				win.show();
			} catch {}
		}, []);

		useEffect(() => {
			const interval = setInterval(async () => {
				const devices = await invoke<HidDevice[]>("get_all_hids");
				const curDevicesPaths = new Set(
					store.get(hidDevicesAtom).map((v) => v.path),
				);
				const newDevicesPaths = new Set(devices.map((v) => v.path));
				if (!eqSet(curDevicesPaths, newDevicesPaths)) {
					store.set(hidDevicesAtom, devices);
				}
			}, 1000);

			return () => clearInterval(interval);
		}, [store]);
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
				titleChildren={t("window.title", "Steve Taiko Configurator")}
			/>
			<div
				style={{
					display: "flex",
					justifyContent: "flex-start",
					alignItems: "flex-start",
					flexGrow: 1,
					padding: "var(--space-3)",
					flexDirection: "column",
				}}
			>
				<Flex gap="2" width="100%">
					<Flex flexGrow="1" flexBasis="0">
						<Dialog.Root>
							<Dialog.Trigger>
								<Button variant="surface">连接太鼓控制器</Button>
							</Dialog.Trigger>
							<Dialog.Content>
								<Dialog.Title>检测到的太鼓控制器</Dialog.Title>
								<RadioCards.Root>
									{hidDevices.map((d) => (
										<RadioCards.Item
											style={{
												justifyContent: "flex-start",
											}}
											key={d.path}
											value={d.path}
										>
											<Flex direction="column" flexGrow="1">
												<Text>{d.product}</Text>
												<Text size="1" color="gray">
													序列号：{d.serialNumber}
												</Text>
											</Flex>
											<Spinner />
										</RadioCards.Item>
									))}
								</RadioCards.Root>
							</Dialog.Content>
						</Dialog.Root>
					</Flex>
					<Flex flexGrow="0" flexBasis="0">
						<SegmentedControl.Root defaultValue="config">
							<SegmentedControl.Item value="config">配置</SegmentedControl.Item>
							<SegmentedControl.Item value="test">测试</SegmentedControl.Item>
						</SegmentedControl.Root>
					</Flex>
					<Flex flexGrow="1" flexBasis="0" />
				</Flex>
				<Flex align="center" justify="center" width="100%" flexGrow="1">
					<TaikoVisualizerForKeyboard
						size={256}
						sampleMethod="frame"
						fillColor="transparent"
						outlineColor="var(--gray-10)"
					/>
				</Flex>
			</div>
		</Theme>
	);
}

export default App;
