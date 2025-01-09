import {
	doubleSideHitDetectionAtom,
	ledHitIndicatorAtom,
	leftDonSensorMultiplierAtom,
	leftKaSensorMultiplierAtom,
	rightDonSensorMultiplierAtom,
	rightKaSensorMultiplierAtom,
	shouldSaveConfigAtom,
	triggerThresholdAtom,
} from "$/states/main.ts";
import { Flex, TextField, Box, Slider, Text, Switch } from "@radix-ui/themes";
import { useAtom, useSetAtom } from "jotai";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export const SENSOR_MULTIPLIER_ATOM_MAPS = {
	leftKa: leftKaSensorMultiplierAtom,
	leftDon: leftDonSensorMultiplierAtom,
	rightDon: rightDonSensorMultiplierAtom,
	rightKa: rightKaSensorMultiplierAtom,
} as const;

const SensorMultiplierSetting = (props: {
	side: keyof typeof SENSOR_MULTIPLIER_ATOM_MAPS;
}) => {
	const sensorMultiplierAtom = SENSOR_MULTIPLIER_ATOM_MAPS[props.side];
	const [sensorMultiplier, setSensorMultiplier] = useAtom(sensorMultiplierAtom);
	const setShouldSaveConfig = useSetAtom(shouldSaveConfigAtom);

	const { t } = useTranslation();
	const labelText = useMemo(() => {
		if (props.side === "leftKa") return t("common.drumSide.leftKa", "左鼓边");
		if (props.side === "leftDon") return t("common.drumSide.leftDon", "左鼓面");
		if (props.side === "rightDon")
			return t("common.drumSide.rightDon", "右鼓面");
		if (props.side === "rightKa") return t("common.drumSide.rightKa", "右鼓边");
		return props.side;
	}, [t, props.side]);

	return (
		<>
			<Flex
				direction="row"
				width="100%"
				justify="between"
				align="center"
				gap="4"
			>
				<Flex direction="column" flexShrink="1" flexGrow="1" flexBasis="10em">
					<Text size="2">{labelText}传感器数值倍率</Text>
					<Text size="1" color="gray">
						会对该侧信号值做缩放处理，默认为 100%
					</Text>
				</Flex>
				<TextField.Root
					style={{
						width: "5em",
					}}
					type="number"
					min={0}
					max={10}
					step={0.01}
					value={sensorMultiplier}
					onChange={(e) => {
						setSensorMultiplier(e.currentTarget.valueAsNumber);
						setShouldSaveConfig(true);
					}}
				/>
			</Flex>
			<Box width="100%">
				<Slider
					value={[sensorMultiplier]}
					min={0}
					max={10}
					step={0.01}
					onValueChange={(e) => {
						setSensorMultiplier(e[0]);
						setShouldSaveConfig(true);
					}}
				/>
			</Box>
		</>
	);
};

const TriggerThresholdSetting = () => {
	const [triggerThreshold, setTriggerThreshold] = useAtom(triggerThresholdAtom);
	const setShouldSaveConfig = useSetAtom(shouldSaveConfigAtom);

	return (
		<>
			<Flex
				direction="row"
				width="100%"
				justify="between"
				align="center"
				gap="4"
			>
				<Flex direction="column" flexShrink="1" flexGrow="1" flexBasis="10em">
					<Text size="2">判定阈值</Text>
					<Text size="1" color="gray">
						任意传感器数值超过这个数字则进入判定阶段，单位可以当作电压值（mV）理解。
						<br />
						过低的值容易导致串音，过高的值会需要用更大的力气敲击，甚至可能导致吃音。
						<br />
						可以在调节设置后在测试页面中确认敲击效果。
					</Text>
				</Flex>
				<TextField.Root
					style={{
						width: "5em",
					}}
					type="number"
					min={0}
					max={5000}
					value={triggerThreshold}
					onChange={(e) => {
						setTriggerThreshold(e.currentTarget.valueAsNumber);
						setShouldSaveConfig(true);
					}}
				/>
			</Flex>
			<Box width="100%">
				<Slider
					value={[triggerThreshold]}
					min={0}
					max={5000}
					onValueChange={(e) => {
						setTriggerThreshold(e[0]);
						setShouldSaveConfig(true);
					}}
				/>
			</Box>
		</>
	);
};

const LedHitIndicatorSetting = () => {
	const [ledHitIndicator, setLedHitIndicator] = useAtom(ledHitIndicatorAtom);
	const setShouldSaveConfig = useSetAtom(shouldSaveConfigAtom);

	return (
		<>
			<Flex
				direction="row"
				width="100%"
				justify="between"
				align="center"
				gap="4"
			>
				<Flex direction="column" flexShrink="1" flexGrow="1" flexBasis="10em">
					<Text size="2">启用 LED 敲击指示灯</Text>
					<Text size="1" color="gray">
						在判定的时候可以通过亮起 LED
						灯指示当前敲击的结果，红色代表鼓面，蓝色代表鼓边。
						<br />
						可以借助此功能来确认与电脑之间的延迟情况（此指示灯可以被认为是零延迟的）
					</Text>
				</Flex>
				<Switch
					checked={ledHitIndicator}
					onCheckedChange={(v) => {
						setLedHitIndicator(v);
						setShouldSaveConfig(true);
					}}
				/>
			</Flex>
		</>
	);
};

const DoubleSideHitDetectionSetting = () => {
	const [doubleSideHitDetection, setDoubleSideHitDetection] = useAtom(
		doubleSideHitDetectionAtom,
	);
	const setShouldSaveConfig = useSetAtom(shouldSaveConfigAtom);

	return (
		<>
			<Flex
				direction="row"
				width="100%"
				justify="between"
				align="center"
				gap="4"
			>
				<Flex direction="column" flexShrink="1" flexGrow="1" flexBasis="10em">
					<Text size="2">启用双押判定（实验性）</Text>
					<Text size="1" color="gray">
						在鼓面两侧或鼓边两侧同时敲击时，是否判定为双押，并同时按下两个按键。
						<br />
					</Text>
				</Flex>
				<Switch
					checked={doubleSideHitDetection}
					onCheckedChange={(v) => {
						setDoubleSideHitDetection(v);
						setShouldSaveConfig(true);
					}}
				/>
			</Flex>
		</>
	);
};

export const SensorSettings = () => {
	return (
		<Flex direction="column" gap="4" my="6">
			<TriggerThresholdSetting />
			<LedHitIndicatorSetting />
			<DoubleSideHitDetectionSetting />
			<SensorMultiplierSetting side="leftKa" />
			<SensorMultiplierSetting side="leftDon" />
			<SensorMultiplierSetting side="rightDon" />
			<SensorMultiplierSetting side="rightKa" />
		</Flex>
	);
};
