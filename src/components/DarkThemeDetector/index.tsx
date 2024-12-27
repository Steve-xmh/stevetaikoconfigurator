import { DarkMode, autoDarkModeAtom, darkModeAtom } from "$/states/theme.ts";
import { useAtomValue, useSetAtom } from "jotai";
import { type FC, useEffect } from "react";

const darkMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

export const DarkThemeDetector: FC = () => {
	const setDarkMode = useSetAtom(autoDarkModeAtom);
	const darkMode = useAtomValue(darkModeAtom);
	useEffect(() => {
		if (darkMode !== DarkMode.Auto) return;
		const onDarkModeChange = (e: MediaQueryListEvent) => {
			setDarkMode(e.matches);
		};
		setDarkMode(darkMediaQuery.matches);
		darkMediaQuery.addEventListener("change", onDarkModeChange);
		return () => {
			darkMediaQuery.removeEventListener("change", onDarkModeChange);
		};
	}, [darkMode, setDarkMode]);
	return null;
};

export default DarkThemeDetector;
