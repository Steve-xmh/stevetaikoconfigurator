import { connectedHidDevicesAtom } from "$/states/main.ts";
import { recvFeatureReportFromHid } from "$/utils/hid.ts";
import { Flex, Text } from "@radix-ui/themes";
import { Progress } from "@radix-ui/themes/src/index.js";
import { atom, useAtom, useAtomValue } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const MAX_SENSOR_VALUE = 5000;

const DATA_OFFSET = {
	leftKa: 1,
	leftDon: 1 + 4,
	rightDon: 1 + 4 * 2,
	rightKa: 1 + 4 * 3,
} as const;

const SIDE_COLOR = {
	leftKa: "blue",
	leftDon: "red",
	rightDon: "red",
	rightKa: "blue",
} as const;

export const SingleSensorVisualizer = (props: {
	side: keyof typeof DATA_OFFSET;
}) => {
	const hidDevice = useAtomValue(connectedHidDevicesAtom);
	const sensorValueAtom = useMemo(() => atom(0), []);
	const [sensorValue, setSensorValue] = useAtom(sensorValueAtom);

	useEffect(() => {
		if (!hidDevice) return;
		let canceled = false;

		const onFrame = async () => {
			if (canceled) return;
			const data = await recvFeatureReportFromHid(0x10);
			if (canceled) return;
			if (data) {
				const view = new DataView(data.buffer);

				const value = view.getUint32(DATA_OFFSET[props.side], true);
				setSensorValue(Math.max(0, Math.min(value, MAX_SENSOR_VALUE)));
			}
			if (canceled) return;
			requestAnimationFrame(onFrame);
		};

		onFrame();

		return () => {
			canceled = true;
		};
	}, [hidDevice, props.side]);

	return (
		<Progress
			max={MAX_SENSOR_VALUE}
			value={sensorValue}
			color={SIDE_COLOR[props.side]}
			className="sensor-visualizer"
		/>
	);
};

export const SingleLabeledSensorVisualizer = (props: {
	side: keyof typeof DATA_OFFSET;
}) => {
	const { t } = useTranslation();
	const labelText = useMemo(() => {
		if (props.side === "leftKa") return t("common.drumSide.leftKa", "左鼓边");
		if (props.side === "leftDon") return t("common.drumSide.leftDon", "左鼓面");
		if (props.side === "rightDon")
			return t("common.drumSide.rightDon", "右鼓面");
		if (props.side === "rightKa") return t("common.drumSide.rightKa", "右鼓边");
		return props.side;
	}, [t, props.side]);

	const hidDevice = useAtomValue(connectedHidDevicesAtom);
	const sensorValueAtom = useMemo(() => atom(0), []);
	const [sensorValue, setSensorValue] = useAtom(sensorValueAtom);

	useEffect(() => {
		if (!hidDevice) return;
		let canceled = false;

		const onFrame = async () => {
			if (canceled) return;
			const data = await recvFeatureReportFromHid(0x10);
			if (canceled) return;
			if (data) {
				const view = new DataView(data.buffer);

				const value = view.getUint32(DATA_OFFSET[props.side], true);
				setSensorValue(Math.max(0, Math.min(value, MAX_SENSOR_VALUE)));
			}
			if (canceled) return;
			requestAnimationFrame(onFrame);
		};

		onFrame();

		return () => {
			canceled = true;
		};
	}, [hidDevice, props.side]);

	return (
		<Flex direction="column" align="center" gap="2">
			<Text size="1" color={SIDE_COLOR[props.side]}>
				{sensorValue}
			</Text>
			<Progress
				max={MAX_SENSOR_VALUE}
				value={sensorValue}
				color={SIDE_COLOR[props.side]}
				className="sensor-visualizer"
			/>
			<Text size="1" color={SIDE_COLOR[props.side]}>
				{labelText}
			</Text>
		</Flex>
	);
};

export const SensorVisualizer = () => {
	return (
		<Flex direction="row" height="20em" gap="2">
			<SingleSensorVisualizer side="leftKa" />
			<SingleSensorVisualizer side="leftDon" />
			<SingleSensorVisualizer side="rightDon" />
			<SingleSensorVisualizer side="rightKa" />
		</Flex>
	);
};
