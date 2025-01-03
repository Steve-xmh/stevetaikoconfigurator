import { connectedHidDevicesAtom, hidDevicesAtom } from "$/states/main.ts";
import { eqSet } from "$/utils/eq-set.ts";
import { getAllHidDevices, getConnectedHidDevice } from "$/utils/hid.ts";
import { useStore } from "jotai";
import { useEffect } from "react";

export const HidContext = () => {
	const store = useStore();

	if (import.meta.env.TAURI_ENV_PLATFORM) {
		useEffect(() => {
			const interval = setInterval(async () => {
				const devices = await getAllHidDevices();
				const curDevicesPaths = new Set(
					store.get(hidDevicesAtom).map((v) => v.path),
				);
				const newDevicesPaths = new Set(devices.map((v) => v.path));
				if (!eqSet(curDevicesPaths, newDevicesPaths)) {
					store.set(hidDevicesAtom, devices);
				}
			}, 1000);

			getConnectedHidDevice().then((device) =>
				store.set(connectedHidDevicesAtom, device),
			);

			return () => clearInterval(interval);
		}, [store]);
	}

	return null;
};
