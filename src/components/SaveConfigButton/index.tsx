import {
	connectedHidDevicesAtom,
	customButton1KeyAtom,
	customButton2KeyAtom,
	customButton3KeyAtom,
	customButton4KeyAtom,
	doubleSideHitDetectionAtom,
	keyInvokeDurationAtom,
	ledHitIndicatorAtom,
	leftDonKeyAtom,
	leftKaSensorSubtrahendAtom,
	leftKaKeyAtom,
	leftDonSensorSubtrahendAtom,
	rightDonKeyAtom,
	rightDonSensorSubtrahendAtom,
	rightKaKeyAtom,
	rightKaSensorSubtrahendAtom,
	shouldSaveConfigAtom,
	triggerThresholdAtom,
} from "$/states/main.ts";
import { sendFeatureReportToHid } from "$/utils/hid.ts";
import { Button } from "@radix-ui/themes";
import { atom, useAtomValue, useStore } from "jotai";
import { useCallback } from "react";
import { Trans } from "react-i18next";

const savingConfigAtom = atom(false);

export const SaveConfigButton = () => {
	const shouldSaveConfig = useAtomValue(shouldSaveConfigAtom);
	const savingConfig = useAtomValue(savingConfigAtom);
	const hidDevice = useAtomValue(connectedHidDevicesAtom);
	const store = useStore();

	const saveConfig = useCallback(async () => {
		store.set(savingConfigAtom, true);
		try {
			const commonConfigReport = new DataView(new ArrayBuffer(15));
			commonConfigReport.setUint8(0, 0x11);
			commonConfigReport.setUint8(1, 0x00);
			let boolFlags = 0;
			boolFlags |= store.get(ledHitIndicatorAtom) ? 0b01 : 0;
			boolFlags |= store.get(doubleSideHitDetectionAtom) ? 0b10 : 0;
			commonConfigReport.setUint8(2, boolFlags);
			commonConfigReport.setUint16(3, store.get(keyInvokeDurationAtom), true);
			commonConfigReport.setUint16(5, store.get(triggerThresholdAtom), true);
			commonConfigReport.setUint16(
				7,
				store.get(leftKaSensorSubtrahendAtom),
				true,
			);
			commonConfigReport.setUint16(
				9,
				store.get(leftDonSensorSubtrahendAtom),
				true,
			);
			commonConfigReport.setUint16(
				11,
				store.get(rightDonSensorSubtrahendAtom),
				true,
			);
			commonConfigReport.setUint16(
				13,
				store.get(rightKaSensorSubtrahendAtom),
				true,
			);

			const pcConfigReport = new DataView(new ArrayBuffer(9));
			pcConfigReport.setUint8(0, 0x12);
			pcConfigReport.setUint8(1, store.get(leftKaKeyAtom));
			pcConfigReport.setUint8(2, store.get(leftDonKeyAtom));
			pcConfigReport.setUint8(3, store.get(rightDonKeyAtom));
			pcConfigReport.setUint8(4, store.get(rightKaKeyAtom));
			pcConfigReport.setUint8(5, store.get(customButton1KeyAtom));
			pcConfigReport.setUint8(6, store.get(customButton2KeyAtom));
			pcConfigReport.setUint8(7, store.get(customButton3KeyAtom));
			pcConfigReport.setUint8(8, store.get(customButton4KeyAtom));
			console.log("saving hid configuration", {
				commonConfigReport,
				pcConfigReport,
			});
			await sendFeatureReportToHid(commonConfigReport);
			await sendFeatureReportToHid(pcConfigReport);

			store.set(shouldSaveConfigAtom, false);
		} catch (e) {
			console.error(e);
		} finally {
			store.set(savingConfigAtom, false);
		}
	}, [store]);

	return (
		<Button
			loading={savingConfig}
			disabled={!shouldSaveConfig || !hidDevice}
			variant={shouldSaveConfig ? "solid" : "surface"}
			onClick={saveConfig}
		>
			<Trans i18nKey="topbar.saveConfigButton.label">保存设置</Trans>
		</Button>
	);
};
