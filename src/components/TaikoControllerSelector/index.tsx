import { connectedHidDevicesAtom, hidDevicesAtom } from "$/states/main.ts";
import { eqSet } from "$/utils/eq-set.ts";
import {
	type HidDevice,
	getAllHidDevices,
	getConnectedHidDevice,
	reopenHidDevice,
} from "$/utils/hid.ts";
import {
	Button,
	Dialog,
	Flex,
	RadioCards,
	Spinner,
	Text,
} from "@radix-ui/themes";
import { atom, useAtom, useAtomValue, useSetAtom, useStore } from "jotai";
import { useEffect, useState } from "react";

const taikoControllerSelectorOpenedAtom = atom(false);
const isOpeningAtom = atom(false);

const TaikoControllerSelectorItem = (props: {
	hidDevice: HidDevice;
}) => {
	const setOpened = useSetAtom(taikoControllerSelectorOpenedAtom);
	const setConnectedDevice = useSetAtom(connectedHidDevicesAtom);
	const [opening, setOpening] = useState(false);

	return (
		<RadioCards.Item
			style={{
				justifyContent: "flex-start",
			}}
			value={props.hidDevice.path}
			onClick={async () => {
				setConnectedDevice(null);
				setOpening(true);
				try {
					await reopenHidDevice(props.hidDevice.path);
					setConnectedDevice(props.hidDevice);
					setOpened(false);
				} catch (e) {
					console.error(e);
				} finally {
					setOpening(false);
				}
			}}
		>
			<Flex direction="column" flexGrow="1">
				<Text>{props.hidDevice.product}</Text>
				<Text size="1" color="gray">
					序列号：{props.hidDevice.serialNumber}
				</Text>
			</Flex>
			{opening && <Spinner />}
		</RadioCards.Item>
	);
};

export const TaikoControllerSelector = () => {
	const store = useStore();
	const [opened, setOpened] = useAtom(taikoControllerSelectorOpenedAtom);
	const isOpening = useAtomValue(isOpeningAtom);
	const hidDevices = useAtomValue(hidDevicesAtom);
	const [connectedDevice, setConnectedDevice] = useAtom(
		connectedHidDevicesAtom,
	);

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
		<Dialog.Root
			open={opened}
			onOpenChange={(v) => {
				if (isOpening) return;
				setOpened(v);
			}}
		>
			<Dialog.Trigger>
				<Button variant="surface">
					{connectedDevice ? connectedDevice.product : "选择太鼓控制器"}
				</Button>
			</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Title>检测到的太鼓控制器</Dialog.Title>
				<RadioCards.Root>
					{hidDevices.map((d) => (
						<TaikoControllerSelectorItem key={d.path} hidDevice={d} />
					))}
					{hidDevices.length === 0 && (
						<Text align="center" wrap="wrap" color="gray">
							未检测到太鼓控制器
							<br />
							请检查你的电脑是否正确连接到了太鼓控制器
							<br />
							且太鼓控制器已切换到键盘模式
						</Text>
					)}
				</RadioCards.Root>
			</Dialog.Content>
		</Dialog.Root>
	);
};
