import {
	doubleSideHitDetectionAtom,
	ledHitIndicatorAtom,
	leftKaSensorSubtrahendAtom,
	leftDonSensorSubtrahendAtom,
	rightDonSensorSubtrahendAtom,
	rightKaSensorSubtrahendAtom,
	shouldSaveConfigAtom,
	triggerThresholdAtom,
} from "$/states/main.ts";
import { Flex, TextField, Box, Slider, Text, Switch } from "@radix-ui/themes";
import { useAtom, useSetAtom } from "jotai";
import { useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";

const SENSOR_MULTIPLIER_ATOM_MAPS = {
	leftKa: leftKaSensorSubtrahendAtom,
	leftDon: leftDonSensorSubtrahendAtom,
	rightDon: rightDonSensorSubtrahendAtom,
	rightKa: rightKaSensorSubtrahendAtom,
} as const;

const SensorSubtrahendSetting = (props: {
	side: keyof typeof SENSOR_MULTIPLIER_ATOM_MAPS;
}) => {
	const sensorSubtrahendAtom = SENSOR_MULTIPLIER_ATOM_MAPS[props.side];
	const [sensorSubtrahend, setSensorSubtrahend] = useAtom(sensorSubtrahendAtom);
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
					<Text size="2">
						{t(
							"page.config.sensorSettings.sensorSubtrahend.label",
							"{sensorSide} 传感器数值减数",
							{
								sensorSide: labelText,
							},
						)}
					</Text>
					<Text size="1" color="gray">
						<Trans i18nKey="page.config.sensorSettings.sensorSubtrahend.description">
							会将该侧信号值减去指定数值以增加需要将其触发的力度，默认为 0
						</Trans>
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
					value={sensorSubtrahend}
					onChange={(e) => {
						setSensorSubtrahend(e.currentTarget.valueAsNumber);
						setShouldSaveConfig(true);
					}}
				/>
			</Flex>
			<Box width="100%">
				<Slider
					value={[sensorSubtrahend]}
					min={0}
					max={10}
					step={0.01}
					onValueChange={(e) => {
						setSensorSubtrahend(e[0]);
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
					<Text size="2">
						<Trans i18nKey="page.config.sensorSettings.triggerThreshold.label">
							判定阈值
						</Trans>
					</Text>
					<Text size="1" color="gray">
						<Trans i18nKey="page.config.sensorSettings.triggerThreshold.description">
							任意传感器数值超过这个数字则进入判定阶段，单位可以当作电压值（mV）理解。
							<br />
							过低的值容易导致串音，过高的值会需要用更大的力气敲击，甚至可能导致吃音。
							<br />
							可以在调节设置后在测试页面中确认敲击效果。
						</Trans>
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
					<Text size="2">
						<Trans i18nKey="page.config.sensorSettings.ledHitIndicator.label">
							启用 LED 敲击指示灯
						</Trans>
					</Text>
					<Text size="1" color="gray">
						<Trans i18nKey="page.config.sensorSettings.ledHitIndicator.description">
							在判定的时候可以通过亮起 LED
							灯指示当前敲击的结果，红色代表鼓面，蓝色代表鼓边。
							<br />
							可以借助此功能来确认与电脑之间的延迟情况（此指示灯可以被认为是零延迟的）
						</Trans>
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
					<Text size="2">
						<Trans i18nKey="page.config.sensorSettings.doubleSideHitDetection.label">
							启用双押判定（实验性）
						</Trans>
					</Text>
					<Text size="1" color="gray">
						<Trans i18nKey="page.config.sensorSettings.doubleSideHitDetection.description">
							在鼓面两侧或鼓边两侧同时敲击时，是否判定为双押，并同时按下两个按键。
						</Trans>
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
			<SensorSubtrahendSetting side="leftKa" />
			<SensorSubtrahendSetting side="leftDon" />
			<SensorSubtrahendSetting side="rightDon" />
			<SensorSubtrahendSetting side="rightKa" />
		</Flex>
	);
};
