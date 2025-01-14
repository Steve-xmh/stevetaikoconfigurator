import { Button, Flex, Heading, Text } from "@radix-ui/themes";
import LogoIcon from "$/assets/logo.svg?react";
import { Trans } from "react-i18next";

export const AboutPage = () => {
	return (
		<>
			<Flex align="center" justify="center" direction="column" gap="4">
				<LogoIcon height="10em" />
				<Heading>Steve Taiko Configurator</Heading>
				<Text color="gray" size="2">
					by SteveXMH
				</Text>
				<Text color="gray" size="2">
					<Trans i18nKey="page.about.appDesc">
						用于配置萧鼓太鼓控制器以及测试太鼓控制器的工具
					</Trans>
				</Text>
				<Text color="gray" size="2">
					<Trans i18nKey="page.about.freewareTip">
						此工具为免费开源的自由软件
					</Trans>
				</Text>
				<Flex gap="2" justify="center">
					<Button asChild>
						<a
							href="https://github.com/Steve-xmh/stevetaikoconfigurator"
							target="_blank"
							rel="noreferrer"
						>
							Github
						</a>
					</Button>

					<Button asChild>
						<a
							href="https://space.bilibili.com/20875230"
							target="_blank"
							rel="noreferrer"
						>
							Bilibili
						</a>
					</Button>

					<Button asChild>
						<a
							href="https://afdian.com/a/SteveXMH"
							target="_blank"
							rel="noreferrer"
						>
							Afdian
						</a>
					</Button>
				</Flex>
				{!import.meta.env.TAURI_ENV_PLATFORM && (
					<Flex gap="2" justify="center">
						<Button asChild>
							<a
								href="https://github.com/Steve-xmh/stevetaikoconfigurator/releases"
								target="_blank"
								rel="noreferrer"
							>
								<Trans i18nKey="page.about.downloadDesktopVersion">
									下载 Tauri 桌面版本
								</Trans>
							</a>
						</Button>
					</Flex>
				)}
			</Flex>
		</>
	);
};
