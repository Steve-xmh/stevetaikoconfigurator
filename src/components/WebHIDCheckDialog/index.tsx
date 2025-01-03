import { atom, useAtomValue } from "jotai";
import { isHIDSupported } from "$/utils/hid.ts";
import { Button, Dialog, Flex, Text } from "@radix-ui/themes";

const isHIDSupportedAtom = atom(() => isHIDSupported());

export const WebHIDCheckDialog = () => {
	const isHIDSupported = useAtomValue(isHIDSupportedAtom);
	return (
		<Dialog.Root defaultOpen={!isHIDSupported}>
			<Dialog.Content>
				<Dialog.Title>你的浏览器不支持 WebHID API</Dialog.Title>
				<div>
					<Text>
						本网页需要支持 WebHID API 的浏览器才能正常工作。请使用最新版的
						Chrome/Chromuim 或 Microsoft Edge 浏览器。
						<br />
						详情请参考：
						<Button variant="ghost" asChild size="3">
							<a
								href="https://caniuse.com/webhid"
								referrerPolicy="no-referrer"
								target="_blank"
								rel="noreferrer"
							>
								{" "}
								WebHID API 兼容性清单
							</a>
						</Button>
					</Text>
				</div>
				<Flex direction="row-reverse">
					<Dialog.Close>
						<Button variant="soft">仅浏览</Button>
					</Dialog.Close>
				</Flex>
			</Dialog.Content>
		</Dialog.Root>
	);
};
