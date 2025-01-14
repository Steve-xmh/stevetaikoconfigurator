import { languageAtom } from "$/states/main.ts";
import { GlobeIcon } from "@radix-ui/react-icons";
import { DropdownMenu, IconButton } from "@radix-ui/themes";
import { useAtom } from "jotai";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import resources from "virtual:i18next-loader";

export const LanguageSelector = () => {
	const { t, i18n } = useTranslation();
	const [language, setLanguage] = useAtom(languageAtom);

	useEffect(() => {
		i18n.changeLanguage(language);
	}, [language, i18n]);

	const supportedLanguagesMenu = useMemo(() => {
		function collectLocaleKey(
			// biome-ignore lint/suspicious/noExplicitAny: 计算用途，不需要类型安全
			root: any,
			result = new Set<string>(),
			currentKey = "",
		): Set<string> {
			for (const key in root) {
				if (typeof root[key] === "object") {
					collectLocaleKey(
						root[key],
						result,
						currentKey ? `${currentKey}.${key}` : key,
					);
				} else if (typeof root[key] === "string" && root[key]) {
					result.add(currentKey ? `${currentKey}.${key}` : key);
				}
			}
			return result;
		}
		const originalLocaleKeyNum = collectLocaleKey(resources["zh-CN"]).size;
		const menu = Object.keys(resources)
			.map((langId) => {
				return {
					langId,
					keyNum: collectLocaleKey(resources[langId]).size,
				};
			})
			.filter(({ keyNum }) => keyNum)
			.map(({ langId, keyNum }) => {
				const name =
					new Intl.DisplayNames(i18n.language, {
						type: "language",
					}).of(langId) || langId;
				const origName =
					new Intl.DisplayNames(langId, {
						type: "language",
					}).of(langId) || langId;
				return {
					label: `${
						origName === name ? origName : `${origName} (${name})`
					} (${(Math.min(100, (keyNum / originalLocaleKeyNum) * 100)).toFixed(1)}%)`,
					value: langId,
				};
			});
		menu.push({
			label: t("topbar.languageSelector.displayLanguage.cimode", "本地化 ID"),
			value: "cimode",
		});
		return menu;
	}, [t, i18n.language]);

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<IconButton variant="outline">
					<GlobeIcon />
				</IconButton>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				{supportedLanguagesMenu.map((lang) => (
					<DropdownMenu.Item
						key={lang.value}
						onClick={() => {
							setLanguage(lang.value);
						}}
					>
						{lang.label}
					</DropdownMenu.Item>
				))}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	);
};
