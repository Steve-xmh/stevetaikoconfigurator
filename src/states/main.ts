import type { HidDevice } from "$/utils/hid.ts";
import { atom } from "jotai";

export enum KeyboardUsage {
	KeyboardAa = 0x04,
	KeyboardBb = 0x05,
	KeyboardCc = 0x06,
	KeyboardDd = 0x07,
	KeyboardEe = 0x08,
	KeyboardFf = 0x09,
	KeyboardGg = 0x0a,
	KeyboardHh = 0x0b,
	KeyboardIi = 0x0c,
	KeyboardJj = 0x0d,
	KeyboardKk = 0x0e,
	KeyboardLl = 0x0f,
	KeyboardMm = 0x10,
	KeyboardNn = 0x11,
	KeyboardOo = 0x12,
	KeyboardPp = 0x13,
	KeyboardQq = 0x14,
	KeyboardRr = 0x15,
	KeyboardSs = 0x16,
	KeyboardTt = 0x17,
	KeyboardUu = 0x18,
	KeyboardVv = 0x19,
	KeyboardWw = 0x1a,
	KeyboardXx = 0x1b,
	KeyboardYy = 0x1c,
	KeyboardZz = 0x1d,
	Keyboard1Exclamation = 0x1e,
	Keyboard2At = 0x1f,
	Keyboard3Hash = 0x20,
	Keyboard4Dollar = 0x21,
	Keyboard5Percent = 0x22,
	Keyboard6Caret = 0x23,
	Keyboard7Ampersand = 0x24,
	Keyboard8Asterisk = 0x25,
	Keyboard9OpenParens = 0x26,
	Keyboard0CloseParens = 0x27,
	KeyboardEnter = 0x28,
	KeyboardEscape = 0x29,
	KeyboardBackspace = 0x2a,
	KeyboardTab = 0x2b,
	KeyboardSpacebar = 0x2c,
	KeyboardDashUnderscore = 0x2d,
	KeyboardEqualPlus = 0x2e,
	KeyboardOpenBracketBrace = 0x2f,
	KeyboardCloseBracketBrace = 0x30,
	KeyboardBackslashBar = 0x31,
	KeyboardNonUSHash = 0x32,
	KeyboardSemiColon = 0x33,
	KeyboardSingleDoubleQuote = 0x34,
	KeyboardBacktickTilde = 0x35,
	KeyboardCommaLess = 0x36,
	KeyboardPeriodGreater = 0x37,
	KeyboardSlashQuestion = 0x38,
	KeyboardCapsLock = 0x39,
	KeyboardF1 = 0x3a,
	KeyboardF2 = 0x3b,
	KeyboardF3 = 0x3c,
	KeyboardF4 = 0x3d,
	KeyboardF5 = 0x3e,
	KeyboardF6 = 0x3f,
	KeyboardF7 = 0x40,
	KeyboardF8 = 0x41,
	KeyboardF9 = 0x42,
	KeyboardF10 = 0x43,
	KeyboardF11 = 0x44,
	KeyboardF12 = 0x45,
}

export const hidDevicesAtom = atom<HidDevice[]>([]);
export const connectedHidDevicesAtom = atom<HidDevice | null>(null);

// 传感器设置
export const triggerThresholdAtom = atom(1);
export const leftKaSensorMultiplierAtom = atom(1);
export const leftDonSensorMultiplierAtom = atom(1);
export const rightDonSensorMultiplierAtom = atom(1);
export const rightKaSensorMultiplierAtom = atom(1);

// 按键设置
export const keyInvokeDurationAtom = atom(16);
export const leftKaKeyAtom = atom(KeyboardUsage.KeyboardDd);
export const leftDonKeyAtom = atom(KeyboardUsage.KeyboardFf);
export const rightDonKeyAtom = atom(KeyboardUsage.KeyboardJj);
export const rightKaKeyAtom = atom(KeyboardUsage.KeyboardKk);

export const pageAtom = atom<"config" | "test" | "about">("config");
