import { invoke } from "@tauri-apps/api/core";

export interface HidDevice {
	manufacturer: string;
	product: string;
	serialNumber: string;
	vendorId: number;
	productId: number;
	path: string;
}

export function isHIDSupported() {
	if (import.meta.env.TAURI_ENV_PLATFORM) return true;
	return "hid" in navigator;
}

let webHidConnectedDevice: HIDDevice | null = null;

export async function getAllHidDevices(): Promise<HidDevice[]> {
	if (import.meta.env.TAURI_ENV_PLATFORM)
		return invoke<HidDevice[]>("get_all_hids");
	await navigator.hid.requestDevice({
		filters: [
			{
				vendorId: 0x303a,
				productId: 0x456d,
			},
		],
	});
	const devices = await navigator.hid.getDevices();
	return devices.map((device, i) => {
		return {
			manufacturer: "",
			product: device.productName,
			serialNumber: `WebHID Index ${i}`,
			vendorId: device.vendorId,
			productId: device.productId,
			path: `${i}`,
		};
	});
}

export async function reopenHidDevice(devicePath: string) {
	if (import.meta.env.TAURI_ENV_PLATFORM)
		await invoke<HidDevice[]>("reopen_device", {
			devicePath,
		});
	const deviceIndex = Number.parseInt(devicePath);
	const devices = await navigator.hid.getDevices();
	for (const device of devices) {
		if (device.opened) await device.close();
	}
	const device = devices[deviceIndex];
	if (!device.opened) await device.open();
	webHidConnectedDevice = device;
}

export async function sendFeatureReportToHid(
	value: ArrayBuffer | ArrayBufferView,
) {
	if (import.meta.env.TAURI_ENV_PLATFORM)
		await invoke<void>("send_feature_report_to_hid", {
			value: Array.from(
				new Uint8Array(value instanceof ArrayBuffer ? value : value.buffer),
			),
		});
	else if (webHidConnectedDevice) {
		const data = new Uint8Array(
			value instanceof ArrayBuffer ? value : value.buffer,
		);
		await webHidConnectedDevice.sendFeatureReport(data[0], data.slice(1));
	}
}

export async function recvFeatureReportFromHid(reportId: number) {
	if (import.meta.env.TAURI_ENV_PLATFORM)
		return new DataView(
			new Uint8Array(
				await invoke<number[]>("recv_feature_report_from_hid", {
					reportId,
				}),
			).buffer,
		);
	if (webHidConnectedDevice)
		return await webHidConnectedDevice.receiveFeatureReport(reportId);
	return null;
}

export async function getConnectedHidDevice(): Promise<HidDevice | null> {
	if (import.meta.env.TAURI_ENV_PLATFORM)
		return await invoke<HidDevice | null>("get_connected_hid");
	const devices = await navigator.hid.getDevices();
	const deviceIndex = devices.findIndex((device) => device.opened);
	return webHidConnectedDevice
		? {
				manufacturer: "",
				product: webHidConnectedDevice.productName,
				serialNumber: "",
				vendorId: webHidConnectedDevice.vendorId,
				productId: webHidConnectedDevice.productId,
				path: `${deviceIndex}`,
			}
		: null;
}
