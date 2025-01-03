import {
	leftDonSensorMultiplierAtom,
	leftKaSensorMultiplierAtom,
	rightDonSensorMultiplierAtom,
	rightKaSensorMultiplierAtom,
	triggerThresholdAtom,
} from "$/states/main.ts";
import { Flex, TextField, Box, Slider, Text } from "@radix-ui/themes";
import { useAtom } from "jotai";
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
					onChange={(e) => setSensorMultiplier(e.currentTarget.valueAsNumber)}
				/>
			</Flex>
			<Box width="100%">
				<Slider
					value={[sensorMultiplier]}
					min={0}
					max={10}
					step={0.01}
					onValueChange={(e) => setSensorMultiplier(e[0])}
				/>
			</Box>
		</>
	);
};

const TriggerThresholdSetting = () => {
	const [triggerThreshold, setTriggerThreshold] = useAtom(triggerThresholdAtom);

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
						任意传感器数值超过这个数字则进入判定阶段，单位可以当作电压值（mV）理解
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
					onChange={(e) => setTriggerThreshold(e.currentTarget.valueAsNumber)}
				/>
			</Flex>
			<Box width="100%">
				<Slider
					value={[triggerThreshold]}
					min={0}
					max={5000}
					onValueChange={(e) => setTriggerThreshold(e[0])}
				/>
			</Box>
		</>
	);
};

export const SensorSettings = () => {
	return (
		<Flex direction="column" gap="4" my="6">
			<TriggerThresholdSetting />
			<SensorMultiplierSetting side="leftKa" />
			<SensorMultiplierSetting side="leftDon" />
			<SensorMultiplierSetting side="rightDon" />
			<SensorMultiplierSetting side="rightKa" />
		</Flex>
	);
};
