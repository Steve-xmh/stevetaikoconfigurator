import { connectedHidDevicesAtom, hidDevicesAtom } from "$/states/main.ts";
import { eqSet } from "$/utils/eq-set.ts";
import { getAllHidDevices, getConnectedHidDevice } from "$/utils/hid.ts";
import {
	Button,
	Dialog,
	Flex,
	RadioCards,
	Spinner,
	Text,
} from "@radix-ui/themes";
import { invoke } from "@tauri-apps/api/core";
import { useAtomValue, useSetAtom, useStore } from "jotai";
import { useEffect, useState } from "react";

export const TaikoControllerSelector = () => {
	const store = useStore();
	const [opened, setOpened] = useState(false);
	const hidDevices = useAtomValue(hidDevicesAtom);
	const setConnectedDevice = useSetAtom(connectedHidDevicesAtom);

	if (!import.meta.env.TAURI_ENV_PLATFORM) {
		useEffect(() => {
			const interval = setInterval(async () => {
				const devices = await getAllHidDevices();
				const curDevicesPaths = new Set(
					store.get(hidDevicesAtom).map((v) => v.path),
				);
				const newDevicesPaths = new Set(devices.map((v) => v.path));
				if (!eqSet(curDevicesPaths, newDevicesPaths)) {
					store.set(hidDevicesAtom, devices);
				}
			}, 1000);

			getConnectedHidDevice().then((device) =>
				store.set(connectedHidDevicesAtom, device),
			);

			return () => clearInterval(interval);
		}, [store]);
	}

	return (
		<Dialog.Root open={opened} onOpenChange={setOpened}>
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
							onClick={async () => {
								setConnectedDevice(null);
								try {
									await invoke("reopen_device", {
										devicePath: d.path,
									});
									setConnectedDevice(d);
									setOpened(false);
								} catch (e) {
									console.error(e);
								}
							}}
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
	);
};
