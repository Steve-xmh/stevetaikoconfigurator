import { Flex, Tabs, Text } from "@radix-ui/themes";
import { KeyBindingSettings } from "../KeyBindingSettings/index.tsx";
import { SensorSettings } from "../SensorSettings/index.tsx";
import { SingleLabeledSensorVisualizer } from "../SensorVisualizer/index.tsx";
import { TaikoVisualizerForKeyboard } from "../TaikoVisualizer/keyboard.tsx";
import { atom, useAtomValue } from "jotai";
import { isHIDSupported } from "$/utils/hid.ts";
import { connectedHidDevicesAtom } from "$/states/main.ts";

const isHIDSupportedAtom = atom(() => isHIDSupported());

export const ConfigurePage = () => {
	const isHidSupported = useAtomValue(isHIDSupportedAtom);
	const hidDevice = useAtomValue(connectedHidDevicesAtom);

	const isEnabled = !!(isHidSupported && hidDevice);

	return (
		<Flex
			direction="column"
			align="center"
			py="5"
			gap="4"
			height="fit-content"
			style={{
				opacity: isEnabled ? 1 : 0.5,
				pointerEvents: isEnabled ? "auto" : "none",
				userSelect: isEnabled ? "auto" : "none",
			}}
		>
			{!isHidSupported && (
				<Text color="yellow" align="center" size="2">
					因浏览器不支持 WebHID API ，配置页面无法使用
				</Text>
			)}
			{isHidSupported && !hidDevice && (
				<Text color="yellow" align="center" size="2">
					请点击左上角的按钮连接太鼓控制器
				</Text>
			)}
			<Flex
				direction="row"
				align="center"
				justify="center"
				width="100%"
				height="fit-content"
			>
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
