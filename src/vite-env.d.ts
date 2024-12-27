/// <reference types="vite/client" />

import type { env } from "process";

declare module "virtual:i18next-loader" {
	const value: typeof import("../locales/zh-CN/translation.json");
	export default value;
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
