import { atom, useAtomValue } from "jotai";
import { isHIDSupported } from "$/utils/hid.ts";
import { Button, Dialog, Flex, Text } from "@radix-ui/themes";
import { Trans } from "react-i18next";

const isHIDSupportedAtom = atom(() => isHIDSupported());

export const WebHIDCheckDialog = () => {
	const isHIDSupported = useAtomValue(isHIDSupportedAtom);
	return (
		<Dialog.Root defaultOpen={!isHIDSupported}>
			<Dialog.Content>
				<Dialog.Title>
					<Trans i18nKey="dialogs.webHidCheck.title">
						你的浏览器不支持 WebHID API
					</Trans>
				</Dialog.Title>
				<div>
					<Text>
						<Trans i18nKey="dialogs.webHidCheck.desc">
							本网页需要支持 WebHID API 的浏览器才能正常工作。请使用最新版的
							Chrome/Chromuim 或 Microsoft Edge 浏览器。
						</Trans>
						<br />
						<Trans i18nKey="dialogs.webHidCheck.refer">
							详情请参考：
							<Button variant="ghost" asChild size="3">
								<a
									href="https://caniuse.com/webhid"
									referrerPolicy="no-referrer"
									target="_blank"
									rel="noreferrer"
								>
									<Trans i18nKey="dialogs.webHidCheck.referLink">
										WebHID API 兼容性清单
									</Trans>
								</a>
							</Button>
						</Trans>
					</Text>
				</div>
				<Flex direction="row-reverse">
					<Dialog.Close>
						<Button variant="soft">
							<Trans i18nKey="dialogs.webHidCheck.browseOnly">仅浏览</Trans>
						</Button>
					</Dialog.Close>
				</Flex>
			</Dialog.Content>
		</Dialog.Root>
	);
};
