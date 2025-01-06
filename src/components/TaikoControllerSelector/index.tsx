import {
	connectedHidDevicesAtom,
	customButton1KeyAtom,
	customButton2KeyAtom,
	customButton3KeyAtom,
	customButton4KeyAtom,
	hidDevicesAtom,
	keyInvokeDurationAtom,
	leftDonKeyAtom,
	leftDonSensorMultiplierAtom,
	leftKaKeyAtom,
	leftKaSensorMultiplierAtom,
	rightDonKeyAtom,
	rightDonSensorMultiplierAtom,
	rightKaKeyAtom,
	rightKaSensorMultiplierAtom,
	triggerThresholdAtom,
	type KeyboardUsage,
} from "$/states/main.ts";
import { eqSet } from "$/utils/eq-set.ts";
import {
	type HidDevice,
	getAllHidDevices,
	getConnectedHidDevice,
	recvFeatureReportFromHid,
	reopenHidDevice,
} from "$/utils/hid.ts";
import { ReloadIcon } from "@radix-ui/react-icons";
import {
	Button,
	Dialog,
	Flex,
	IconButton,
	RadioCards,
	Spinner,
	Text,
} from "@radix-ui/themes";
import { atom, useAtom, useAtomValue, useSetAtom, useStore } from "jotai";
import { useCallback, useEffect, useState } from "react";

const taikoControllerSelectorOpenedAtom = atom(false);
const isOpeningAtom = atom(false);

const TaikoControllerSelectorItem = (props: {
	hidDevice: HidDevice;
	onSelected?: () => void;
}) => {
	const setOpened = useSetAtom(taikoControllerSelectorOpenedAtom);
	const setConnectedDevice = useSetAtom(connectedHidDevicesAtom);
	const [opening, setOpening] = useState(false);
	const connectedDevice = useAtomValue(connectedHidDevicesAtom);

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
					props.onSelected?.();
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
			{connectedDevice?.path === props.hidDevice.path && (
				<Text color="grass">已连接</Text>
			)}
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

	const reloadConfigurations = useCallback(async () => {
		const commonConfigReport = await recvFeatureReportFromHid(0x11);
		if (!commonConfigReport) return;
		const pcConfigReport = await recvFeatureReportFromHid(0x12);
		if (!pcConfigReport) return;
		// const nsConfigReport = await recvFeatureReportFromHid(0x13); // TODO
		// if (!nsConfigReport) return;

		console.log("reloading hid configuration", {
			commonConfigReport,
			pcConfigReport,
		});

		// const emulationMode = commonConfigReport.getUint8(1);
		store.set(keyInvokeDurationAtom, commonConfigReport.getUint16(2, true));
		store.set(triggerThresholdAtom, commonConfigReport.getUint16(4, true));

		store.set(
			leftKaSensorMultiplierAtom,
			commonConfigReport.getFloat32(6, true),
		);
		store.set(
			leftDonSensorMultiplierAtom,
			commonConfigReport.getFloat32(10, true),
		);
		store.set(
			rightDonSensorMultiplierAtom,
			commonConfigReport.getFloat32(14, true),
		);
		store.set(
			rightKaSensorMultiplierAtom,
			commonConfigReport.getFloat32(18, true),
		);

		store.set(leftKaKeyAtom, pcConfigReport.getUint8(1) as KeyboardUsage);
		store.set(leftDonKeyAtom, pcConfigReport.getUint8(2) as KeyboardUsage);
		store.set(rightDonKeyAtom, pcConfigReport.getUint8(3) as KeyboardUsage);
		store.set(rightKaKeyAtom, pcConfigReport.getUint8(4) as KeyboardUsage);
		store.set(
			customButton1KeyAtom,
			pcConfigReport.getUint8(5) as KeyboardUsage,
		);
		store.set(
			customButton2KeyAtom,
			pcConfigReport.getUint8(6) as KeyboardUsage,
		);
		store.set(
			customButton3KeyAtom,
			pcConfigReport.getUint8(7) as KeyboardUsage,
		);
		store.set(
			customButton4KeyAtom,
			pcConfigReport.getUint8(8) as KeyboardUsage,
		);
	}, [store]);

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

			getConnectedHidDevice().then((device) => {
				store.set(connectedHidDevicesAtom, device);
				reloadConfigurations();
			});

			return () => clearInterval(interval);
		}, [store, reloadConfigurations]);
	}

	return (
		<>
			<Dialog.Root
				open={opened}
				onOpenChange={(v) => {
					if (isOpening) return;
					setOpened(v);
				}}
			>
				<Dialog.Trigger>
					<Button variant="surface">
						{connectedDevice ? "已连接" : "选择太鼓控制器"}
					</Button>
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Title>检测到的太鼓控制器</Dialog.Title>
					<RadioCards.Root>
						{hidDevices.map((d) => (
							<TaikoControllerSelectorItem
								key={d.path}
								hidDevice={d}
								onSelected={reloadConfigurations}
							/>
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
			<IconButton
				ml="2"
				variant="soft"
				disabled={!connectedDevice}
				onClick={reloadConfigurations}
			>
				<ReloadIcon />
			</IconButton>
		</>
	);
};
