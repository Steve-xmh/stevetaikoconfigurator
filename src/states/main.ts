import { atom } from "jotai";
import type path from "path";

export interface HidDevice {
	manufacturer: string;
	product: string;
	serialNumber: string;
	vendorId: number;
	productId: number;
	path: string;
}

export const hidDevicesAtom = atom<HidDevice[]>([]);
