import { atom } from "jotai";

export enum DarkMode {
	Auto = "auto",
	Light = "light",
	Dark = "dark",
}
export const darkModeAtom = atom(DarkMode.Auto);
export const isDarkThemeAtom = atom((get) => {
	if (get(darkModeAtom) === DarkMode.Auto) return get(autoDarkModeAtom);
	return get(darkModeAtom) === DarkMode.Dark;
});
export const autoDarkModeAtom = atom(true);
