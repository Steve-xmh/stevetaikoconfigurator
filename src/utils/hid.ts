import { invoke } from "@tauri-apps/api/core";

export interface HidDevice {
	manufacturer: string;
	product: string;
	serialNumber: string;
	vendorId: number;
	productId: number;
	path: string;
}

abstract class BaseHIDDevice {}

class TauriHIDDevice extends BaseHIDDevice implements HidDevice {}

class WebHIDDevice extends BaseHIDDevice implements HidDevice {}

export function isHIDSupported() {
	if (import.meta.env.TAURI_ENV_PLATFORM) return true;
	return "hid" in navigator;
}

export async function getAllHidDevices(): Promise<HidDevice[]> {
	if (import.meta.env.TAURI_ENV_PLATFORM)
		return invoke<HidDevice[]>("get_all_hids");

	const devices = await navigator.hid.getDevices();
	return devices.map((device) => {
		return {
			manufacturer: "",
			product: device.productName,
			serialNumber: "",
			vendorId: device.vendorId,
			productId: device.productId,
			path: "",
		};
	});
}

export async function reopenHidDevice(devicePath: string) {
	if (import.meta.env.TAURI_ENV_PLATFORM)
		await invoke<HidDevice[]>("reopen_device", {
			devicePath,
		});
}

export async function sendFeatureReportToHid(value: ArrayBufferLike) {
	if (import.meta.env.TAURI_ENV_PLATFORM)
		await invoke<void>("send_feature_report_to_hid", {
			value,
		});
}

export async function recvFeatureReportFromHid(reportId: number) {
	if (import.meta.env.TAURI_ENV_PLATFORM)
		return new Uint8Array(
			await invoke<number[]>("recv_feature_report_from_hid", {
				reportId,
			}),
		);
}

export async function getConnectedHidDevice() {
	if (import.meta.env.TAURI_ENV_PLATFORM)
		return await invoke<HidDevice | null>("get_connected_hid");
	return null;
}
