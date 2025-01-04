import { Button, Flex, Heading, IconButton, Text } from "@radix-ui/themes";
import LogoIcon from "$/assets/logo.svg?react";

export const AboutPage = () => {
	return (
		<>
			<Flex align="center" justify="center" direction="column" gap="4">
				<LogoIcon width="10em" height="auto" />
				<Heading>Steve Taiko Configurator</Heading>
				<Text color="gray" size="2">
					by SteveXMH
				</Text>
				<Text color="gray" size="2">
					用于配置萧鼓太鼓控制器以及测试太鼓控制器的工具
				</Text>
				<Text color="gray" size="2">
					此工具为免费开源的自由软件
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
			</Flex>
		</>
	);
};
