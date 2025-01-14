/// <reference types="vite/client" />
/// <reference types="@types/w3c-web-hid" />
/// <reference types="vite-plugin-svgr/client" />

declare module "virtual:i18next-loader" {
	type resources = typeof import("../locales/zh-CN/translation.json");
	const languageResources: {
		[langId: string]: resources;
	};
	export default languageResources;
}

interface ImportMetaEnv {
	readonly TAURI_ENV_DEBUG?: string;
	readonly TAURI_ENV_TARGET_TRIPLE?: string;
	readonly TAURI_ENV_ARCH?: string;
	readonly TAURI_ENV_PLATFORM?: string;
	readonly TAURI_ENV_FAMILY?: string;
	// More variables...
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
