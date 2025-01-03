import {
	leftDonKeyAtom,
	leftKaKeyAtom,
	rightDonKeyAtom,
	rightKaKeyAtom,
	type KeyboardUsage,
} from "$/states/main.ts";
import { Flex, TextField, Box, Slider, Text, Select } from "@radix-ui/themes";
import { useAtom } from "jotai";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SENSOR_MULTIPLIER_ATOM_MAPS } from "../SensorSettings/index.tsx";

const SIDE_KEY_ATOMS_MAP = {
	leftKa: leftKaKeyAtom,
	leftDon: leftDonKeyAtom,
	rightDon: rightDonKeyAtom,
	rightKa: rightKaKeyAtom,
} as const;

export const SideKeyBindingSettings = (props: {
	side: keyof typeof SIDE_KEY_ATOMS_MAP;
}) => {
	const sideKeyBindingAtom = SENSOR_MULTIPLIER_ATOM_MAPS[props.side];
	const [keyBinding, setKeyBinding] = useAtom(sideKeyBindingAtom);

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
		<Flex direction="row" width="100%" justify="between" align="center" gap="4">
			<Flex direction="column" flexShrink="1" flexGrow="1" flexBasis="10em">
				<Text size="2">{labelText}模拟按键</Text>
				<Text size="1" color="gray">
					当此侧被敲击判定时，电控将会模拟按下的按键
				</Text>
			</Flex>
			<Select.Root
				value={`${keyBinding}`}
				onValueChange={(v) =>
					setKeyBinding(Number.parseInt(v) as KeyboardUsage)
				}
			>
				<Select.Trigger
					style={{
						width: "5em",
					}}
				/>
				<Select.Content></Select.Content>
			</Select.Root>
		</Flex>
	);
};

export const KeyBindingSettings = () => {
	return (
		<Flex direction="column" gap="4" my="6">
			<Flex
				direction="row"
				width="100%"
				justify="between"
				align="center"
				gap="4"
			>
				<Flex direction="column" flexShrink="1" flexGrow="1" flexBasis="10em">
					<Text size="2">按键模拟时长</Text>
					<Text size="1" color="gray">
						即按下按键后多久后松开，单位为毫秒，推荐根据自己实际游戏帧率调节
						<br />
						如果模拟时长过长，会导致一定的延迟。如果模拟时长过短，会导致游戏无法及时识别到输入。
						<br />
						如果不清楚如何调整的话，可以使用默认的 16ms 以适用于大多数游戏情况
					</Text>
				</Flex>
				<TextField.Root
					style={{
						width: "5em",
					}}
					type="number"
					min={0}
					max={5000}
					value={16}
				/>
			</Flex>
			<Box width="100%">
				<Slider value={[16]} min={0} max={255} />
			</Box>

			<SideKeyBindingSettings side="leftKa" />
			<SideKeyBindingSettings side="leftDon" />
			<SideKeyBindingSettings side="rightDon" />
			<SideKeyBindingSettings side="rightKa" />
		</Flex>
	);
};
