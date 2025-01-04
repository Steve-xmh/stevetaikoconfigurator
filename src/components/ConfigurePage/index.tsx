import { Flex, Tabs, Text } from "@radix-ui/themes";
import { KeyBindingSettings } from "../KeyBindingSettings/index.tsx";
import { SensorSettings } from "../SensorSettings/index.tsx";
import { SingleLabeledSensorVisualizer } from "../SensorVisualizer/index.tsx";
import { TaikoVisualizerForKeyboard } from "../TaikoVisualizer/keyboard.tsx";
import { atom, useAtomValue } from "jotai";
import { isHIDSupported } from "$/utils/hid.ts";

const isHIDSupportedAtom = atom(() => isHIDSupported());

export const ConfigurePage = () => {
	const isHidSupported = useAtomValue(isHIDSupportedAtom);
	return (
		<Flex
			direction="column"
			align="center"
			justify="center"
			py="5"
			gap="4"
			flexGrow="1"
			style={{
				opacity: isHidSupported ? 1 : 0.5,
				pointerEvents: isHidSupported ? "auto" : "none",
				userSelect: isHidSupported ? "auto" : "none",
			}}
		>
			{!isHidSupported && (
				<Text color="yellow" align="center" size="2">
					因浏览器不支持 WebHID API ，配置页面无法使用
				</Text>
			)}
			<Flex direction="row" align="center" justify="center" width="100%">
				<Flex gap="4" height="15em">
					<SingleLabeledSensorVisualizer side="leftKa" />
					<SingleLabeledSensorVisualizer side="leftDon" />
				</Flex>
				<TaikoVisualizerForKeyboard
					size={256}
					sampleMethod="frame"
					fillColor="transparent"
					outlineColor="var(--gray-10)"
				/>
				<Flex gap="4" height="15em">
					<SingleLabeledSensorVisualizer side="rightDon" />
					<SingleLabeledSensorVisualizer side="rightKa" />
				</Flex>
			</Flex>

			<Tabs.Root
				defaultValue="sensor"
				style={{
					width: "30em",
				}}
			>
				<Tabs.List>
					<Tabs.Trigger value="sensor">传感设置</Tabs.Trigger>
					<Tabs.Trigger value="keybinding">按键设置</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value="sensor">
					<SensorSettings />
				</Tabs.Content>
				<Tabs.Content value="keybinding">
					<KeyBindingSettings />
				</Tabs.Content>
			</Tabs.Root>
		</Flex>
	);
};
