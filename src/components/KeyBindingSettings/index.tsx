import {
	customButton1KeyAtom,
	customButton2KeyAtom,
	customButton3KeyAtom,
	customButton4KeyAtom,
	KeyboardUsage,
	keyInvokeDurationAtom,
	leftDonKeyAtom,
	leftKaKeyAtom,
	rightDonKeyAtom,
	rightKaKeyAtom,
	shouldSaveConfigAtom,
} from "$/states/main.ts";
import { Flex, TextField, Box, Slider, Text, Select } from "@radix-ui/themes";
import { useAtom, useSetAtom } from "jotai";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const SIDE_KEY_ATOMS_MAP = {
	leftKa: leftKaKeyAtom,
	leftDon: leftDonKeyAtom,
	rightDon: rightDonKeyAtom,
	rightKa: rightKaKeyAtom,

	customButton1: customButton1KeyAtom,
	customButton2: customButton2KeyAtom,
	customButton3: customButton3KeyAtom,
	customButton4: customButton4KeyAtom,
} as const;

const useKeyboardUsageText = (usage: KeyboardUsage) => {
	const { t } = useTranslation();

	return useMemo(() => {
		switch (usage) {
			case KeyboardUsage.KeyboardAa:
				return t("common.keyboardUsage.keyboardAa", "字母 A 键");
			case KeyboardUsage.KeyboardBb:
				return t("common.keyboardUsage.keyboardBb", "字母 B 键");
			case KeyboardUsage.KeyboardCc:
				return t("common.keyboardUsage.keyboardCc", "字母 C 键");
			case KeyboardUsage.KeyboardDd:
				return t("common.keyboardUsage.keyboardDd", "字母 D 键");
			case KeyboardUsage.KeyboardEe:
				return t("common.keyboardUsage.keyboardEe", "字母 E 键");
			case KeyboardUsage.KeyboardFf:
				return t("common.keyboardUsage.keyboardFf", "字母 F 键");
			case KeyboardUsage.KeyboardGg:
				return t("common.keyboardUsage.keyboardGg", "字母 G 键");
			case KeyboardUsage.KeyboardHh:
				return t("common.keyboardUsage.keyboardHh", "字母 H 键");
			case KeyboardUsage.KeyboardIi:
				return t("common.keyboardUsage.keyboardIi", "字母 I 键");
			case KeyboardUsage.KeyboardJj:
				return t("common.keyboardUsage.keyboardJj", "字母 J 键");
			case KeyboardUsage.KeyboardKk:
				return t("common.keyboardUsage.keyboardKk", "字母 K 键");
			case KeyboardUsage.KeyboardLl:
				return t("common.keyboardUsage.keyboardLl", "字母 L 键");
			case KeyboardUsage.KeyboardMm:
				return t("common.keyboardUsage.keyboardMm", "字母 M 键");
			case KeyboardUsage.KeyboardNn:
				return t("common.keyboardUsage.keyboardNn", "字母 N 键");
			case KeyboardUsage.KeyboardOo:
				return t("common.keyboardUsage.keyboardOo", "字母 O 键");
			case KeyboardUsage.KeyboardPp:
				return t("common.keyboardUsage.keyboardPp", "字母 P 键");
			case KeyboardUsage.KeyboardQq:
				return t("common.keyboardUsage.keyboardQq", "字母 Q 键");
			case KeyboardUsage.KeyboardRr:
				return t("common.keyboardUsage.keyboardRr", "字母 R 键");
			case KeyboardUsage.KeyboardSs:
				return t("common.keyboardUsage.keyboardSs", "字母 S 键");
			case KeyboardUsage.KeyboardTt:
				return t("common.keyboardUsage.keyboardTt", "字母 T 键");
			case KeyboardUsage.KeyboardUu:
				return t("common.keyboardUsage.keyboardUu", "字母 U 键");
			case KeyboardUsage.KeyboardVv:
				return t("common.keyboardUsage.keyboardVv", "字母 V 键");
			case KeyboardUsage.KeyboardWw:
				return t("common.keyboardUsage.keyboardWw", "字母 W 键");
			case KeyboardUsage.KeyboardXx:
				return t("common.keyboardUsage.keyboardXx", "字母 X 键");
			case KeyboardUsage.KeyboardYy:
				return t("common.keyboardUsage.keyboardYy", "字母 Y 键");
			case KeyboardUsage.KeyboardZz:
				return t("common.keyboardUsage.keyboardZz", "字母 Z 键");

			case KeyboardUsage.Keyboard1Exclamation:
				return t("common.keyboardUsage.keyboard1Exclamation", "数字 1 键");
			case KeyboardUsage.Keyboard2At:
				return t("common.keyboardUsage.keyboard2At", "数字 2 键");
			case KeyboardUsage.Keyboard3Hash:
				return t("common.keyboardUsage.keyboard3Hash", "数字 3 键");
			case KeyboardUsage.Keyboard4Dollar:
				return t("common.keyboardUsage.keyboard4Dollar", "数字 4 键");
			case KeyboardUsage.Keyboard5Percent:
				return t("common.keyboardUsage.keyboard5Percent", "数字 5 键");
			case KeyboardUsage.Keyboard6Caret:
				return t("common.keyboardUsage.keyboard6Caret", "数字 6 键");
			case KeyboardUsage.Keyboard7Ampersand:
				return t("common.keyboardUsage.keyboard7Ampersand", "数字 7 键");
			case KeyboardUsage.Keyboard8Asterisk:
				return t("common.keyboardUsage.keyboard8Asterisk", "数字 8 键");
			case KeyboardUsage.Keyboard9OpenParens:
				return t("common.keyboardUsage.keyboard9OpenParens", "数字 9 键");
			case KeyboardUsage.Keyboard0CloseParens:
				return t("common.keyboardUsage.keyboard0CloseParens", "数字 0 键");
			case KeyboardUsage.KeyboardEnter:
				return t("common.keyboardUsage.keyboardEnter", "回车键");
			case KeyboardUsage.KeyboardEscape:
				return t("common.keyboardUsage.keyboardEscape", "退出键");
			case KeyboardUsage.KeyboardBackspace:
				return t("common.keyboardUsage.keyboardBackspace", "退格键");
			case KeyboardUsage.KeyboardTab:
				return t("common.keyboardUsage.keyboardTab", "制表键");
			case KeyboardUsage.KeyboardSpacebar:
				return t("common.keyboardUsage.keyboardSpacebar", "空格键");
			case KeyboardUsage.KeyboardDashUnderscore:
				return t("common.keyboardUsage.keyboardDashUnderscore", "减号键");
			case KeyboardUsage.KeyboardEqualPlus:
				return t("common.keyboardUsage.keyboardEqualPlus", "等号键");
			case KeyboardUsage.KeyboardOpenBracketBrace:
				return t("common.keyboardUsage.keyboardOpenBracketBrace", "左括号键");
			case KeyboardUsage.KeyboardCloseBracketBrace:
				return t("common.keyboardUsage.keyboardCloseBracketBrace", "右括号键");
			case KeyboardUsage.KeyboardBackslashBar:
				return t("common.keyboardUsage.keyboardBackslashBar", "反斜杠键");
			case KeyboardUsage.KeyboardNonUSHash:
				return t("common.keyboardUsage.keyboardNonUSHash", "非美式井号键");
			case KeyboardUsage.KeyboardSemiColon:
				return t("common.keyboardUsage.keyboardSemiColon", "分号键");
			case KeyboardUsage.KeyboardSingleDoubleQuote:
				return t("common.keyboardUsage.keyboardSingleDoubleQuote", "单引号键");
			case KeyboardUsage.KeyboardBacktickTilde:
				return t("common.keyboardUsage.keyboardBacktickTilde", "反引号键");
			case KeyboardUsage.KeyboardCommaLess:
				return t("common.keyboardUsage.keyboardCommaLess", "逗号键");
			case KeyboardUsage.KeyboardPeriodGreater:
				return t("common.keyboardUsage.keyboardPeriodGreater", "句号键");
			case KeyboardUsage.KeyboardSlashQuestion:
				return t("common.keyboardUsage.keyboardSlashQuestion", "斜杠键");
			case KeyboardUsage.KeyboardCapsLock:
				return t("common.keyboardUsage.keyboardCapsLock", "大写锁定键");
			case KeyboardUsage.KeyboardF1:
				return t("common.keyboardUsage.keyboardF1", "功能键 F1");
			case KeyboardUsage.KeyboardF2:
				return t("common.keyboardUsage.keyboardF2", "功能键 F2");
			case KeyboardUsage.KeyboardF3:
				return t("common.keyboardUsage.keyboardF3", "功能键 F3");
			case KeyboardUsage.KeyboardF4:
				return t("common.keyboardUsage.keyboardF4", "功能键 F4");
			case KeyboardUsage.KeyboardF5:
				return t("common.keyboardUsage.keyboardF5", "功能键 F5");
			case KeyboardUsage.KeyboardF6:
				return t("common.keyboardUsage.keyboardF6", "功能键 F6");
			case KeyboardUsage.KeyboardF7:
				return t("common.keyboardUsage.keyboardF7", "功能键 F7");
			case KeyboardUsage.KeyboardF8:
				return t("common.keyboardUsage.keyboardF8", "功能键 F8");
			case KeyboardUsage.KeyboardF9:
				return t("common.keyboardUsage.keyboardF9", "功能键 F9");
			case KeyboardUsage.KeyboardF10:
				return t("common.keyboardUsage.keyboardF10", "功能键 F10");
			case KeyboardUsage.KeyboardF11:
				return t("common.keyboardUsage.keyboardF11", "功能键 F11");
			case KeyboardUsage.KeyboardF12:
				return t("common.keyboardUsage.keyboardF12", "功能键 F12");

			case KeyboardUsage.KeyboardRightArrow:
				return t("common.keyboardUsage.keyboardRightArrow", "右箭头键");
			case KeyboardUsage.KeyboardLeftArrow:
				return t("common.keyboardUsage.keyboardLeftArrow", "左箭头键");
			case KeyboardUsage.KeyboardDownArrow:
				return t("common.keyboardUsage.keyboardDownArrow", "下箭头键");
			case KeyboardUsage.KeyboardUpArrow:
				return t("common.keyboardUsage.keyboardUpArrow", "上箭头键");

			default:
				return t("common.keyboardUsage.custom", "按键代号 {key}", {
					key: `0x${(usage as KeyboardUsage).toString(16).padStart(2, "0").toUpperCase()}`,
				});
		}
	}, [usage, t]);
};

const SideKeyBindingSettingItem = (props: {
	usage: KeyboardUsage;
}) => {
	const usageText = useKeyboardUsageText(props.usage);
	return <Select.Item value={`${props.usage}`}>{usageText}</Select.Item>;
};

const KEYBOARD_USAGES = Object.values(KeyboardUsage).filter(
	(v) => typeof v === "string",
) as (keyof KeyboardUsage)[];

KEYBOARD_USAGES.sort((a, b) => KeyboardUsage[a] - KeyboardUsage[b]);

export const SideKeyBindingSettings = (props: {
	side: keyof typeof SIDE_KEY_ATOMS_MAP;
}) => {
	const sideKeyBindingAtom = SIDE_KEY_ATOMS_MAP[props.side];
	const [keyBinding, setKeyBinding] = useAtom(sideKeyBindingAtom);
	const setShouldSaveConfig = useSetAtom(shouldSaveConfigAtom);

	const { t } = useTranslation();
	const labelText = useMemo(() => {
		if (props.side === "leftKa") return t("common.drumSide.leftKa", "左鼓边");
		if (props.side === "leftDon") return t("common.drumSide.leftDon", "左鼓面");
		if (props.side === "rightDon")
			return t("common.drumSide.rightDon", "右鼓面");
		if (props.side === "rightKa") return t("common.drumSide.rightKa", "右鼓边");
		if (props.side === "customButton1")
			return t("common.drumSide.customButton1", "自定义按钮 1");
		if (props.side === "customButton2")
			return t("common.drumSide.customButton2", "自定义按钮 2");
		if (props.side === "customButton3")
			return t("common.drumSide.customButton3", "自定义按钮 3");
		if (props.side === "customButton4")
			return t("common.drumSide.customButton4", "自定义按钮 4");
		return props.side;
	}, [t, props.side]);

	return (
		<Flex direction="row" width="100%" justify="between" align="center" gap="4">
			<Flex direction="column" flexShrink="1" flexGrow="1" flexBasis="10em">
				<Text size="2">{labelText} 模拟按键</Text>
				<Text size="1" color="gray">
					当 此侧/按钮 被 敲击判定/按下 时，电控将会模拟按下的按键
				</Text>
			</Flex>
			<Select.Root
				value={`${keyBinding}`}
				onValueChange={(v) => {
					setKeyBinding(Number.parseInt(v) as KeyboardUsage);
					setShouldSaveConfig(true);
				}}
			>
				<Select.Trigger
					style={{
						width: "10em",
					}}
				/>
				<Select.Content>
					{KEYBOARD_USAGES.map((usage) => (
						<SideKeyBindingSettingItem
							key={usage}
							usage={KeyboardUsage[usage as any]}
						/>
					))}
				</Select.Content>
			</Select.Root>
		</Flex>
	);
};

const KeyInvokeDurationSetting = () => {
	const [keyInvokeDuration, setKeyInvokeDuration] = useAtom(
		keyInvokeDurationAtom,
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
					min={1}
					max={255}
					value={keyInvokeDuration}
					onChange={(v) => {
						setKeyInvokeDuration(v.currentTarget.valueAsNumber);
						setShouldSaveConfig(true);
					}}
				/>
			</Flex>
			<Box width="100%">
				<Slider
					value={[keyInvokeDuration]}
					min={1}
					max={255}
					onValueChange={(v) => {
						setKeyInvokeDuration(v[0]);
						setShouldSaveConfig(true);
					}}
				/>
			</Box>
		</>
	);
};

export const KeyBindingSettings = () => {
	return (
		<Flex direction="column" gap="4" my="6">
			<KeyInvokeDurationSetting />

			<SideKeyBindingSettings side="leftKa" />
			<SideKeyBindingSettings side="leftDon" />
			<SideKeyBindingSettings side="rightDon" />
			<SideKeyBindingSettings side="rightKa" />

			<SideKeyBindingSettings side="customButton1" />
			<SideKeyBindingSettings side="customButton2" />
			<SideKeyBindingSettings side="customButton3" />
			<SideKeyBindingSettings side="customButton4" />
		</Flex>
	);
};
