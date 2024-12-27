import { defineConfig } from "vite";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import i18next from "vite-plugin-i18next-loader";
import svgLoader from "vite-svg-loader";
import topLevelAwait from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";
import jotaiDebugLabel from "jotai/babel/plugin-debug-label";
import jotaiReactRefresh from "jotai/babel/plugin-react-refresh";

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react({
			babel: {
				plugins: [jotaiDebugLabel, jotaiReactRefresh],
			},
		}),
		i18next({
			paths: ["locales"],
			namespaceResolution: "basename",
		}),
		svgLoader(),
		wasm(),
		topLevelAwait(),
	],
	envPrefix: ["VITE_", "TAURI_"],

	// Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
	//
	// 1. prevent vite from obscuring rust errors
	clearScreen: false,
	// 2. tauri expects a fixed port, fail if that port is not available
	server: {
		port: 1420,
		strictPort: true,
		host: host || false,
		hmr: host
			? {
					protocol: "ws",
					host,
					port: 1421,
				}
			: undefined,
		watch: {
			// 3. tell vite to ignore watching `src-tauri`
			ignored: ["**/src-tauri/**"],
		},
	},
	resolve: {
		alias: {
			$: resolve(__dirname, "src"),
		},
	},
	worker: {
		format: "es",
	},
});
