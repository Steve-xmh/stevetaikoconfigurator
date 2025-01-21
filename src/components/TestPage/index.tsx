import {
	Box,
	Flex,
	IconButton,
	Separator,
	Switch,
	Text,
	Tooltip,
} from "@radix-ui/themes";
import { TaikoVisualizerForKeyboard } from "../TaikoVisualizer/keyboard.tsx";
import styles from "./index.module.css";
import { ReloadIcon } from "@radix-ui/react-icons";
import { atom, useAtom } from "jotai";
import { useEffect, useMemo, useRef } from "react";
import { TaikoVisualizerForJoystick } from "../TaikoVisualizer/joystick.tsx";
import classNames from "classnames";
import { Trans, useTranslation } from "react-i18next";

const useAtomState = <T,>(value: T) =>
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useAtom(useMemo(() => atom(value), []));

const KeyboardTestEntry = () => {
	const [useFrameSampleMode, setUseFrameSampleMode] = useAtomState(false);
	const { t } = useTranslation();

	const [leftKa, setLeftKa] = useAtomState(0);
	const [leftDon, setLeftDon] = useAtomState(0);
	const [rightDon, setRightDon] = useAtomState(0);
	const [rightKa, setRightKa] = useAtomState(0);

	const [surfaceRendaTimes, setSurfaceRendaTimes] = useAtomState(
		[] as number[],
	);
	const [rimRendaTimes, setRimRendaTimes] = useAtomState([] as number[]);
	const [surfaceRenda, setSurfaceRenda] = useAtomState(0);
	const [rimRenda, setRimRenda] = useAtomState(0);

	const resetRef = useRef(0 as unknown as ReturnType<typeof setTimeout>);

	const resetRenda = () => {
		if (resetRef.current) {
			clearTimeout(resetRef.current);
		}
		resetRef.current = setTimeout(() => {
			setSurfaceRenda(0);
			setRimRenda(0);
		}, 2000);
	};

	return (
		<div className={styles.testEntry}>
			<TaikoVisualizerForKeyboard
				fillColor="transparent"
				outlineColor="var(--gray-10)"
				sampleMethod={useFrameSampleMode ? "frame" : "event"}
				onLeftRimInvoked={() => {
					setLeftKa((v) => v + 1);
					setRimRenda((v) => v + 1);
					setRimRendaTimes((v) =>
						[...v, Date.now()].filter((t) => Date.now() - t < 1000),
					);
					resetRenda();
				}}
				onLeftSurfaceInvoked={() => {
					setLeftDon((v) => v + 1);
					setSurfaceRenda((v) => v + 1);
					setSurfaceRendaTimes((v) =>
						[...v, Date.now()].filter((t) => Date.now() - t < 1000),
					);
					resetRenda();
				}}
				onRightSurfaceInvoked={() => {
					setRightDon((v) => v + 1);
					setSurfaceRenda((v) => v + 1);
					setSurfaceRendaTimes((v) =>
						[...v, Date.now()].filter((t) => Date.now() - t < 1000),
					);
					resetRenda();
				}}
				onRightRimInvoked={() => {
					setRightKa((v) => v + 1);
					setRimRenda((v) => v + 1);
					setRimRendaTimes((v) =>
						[...v, Date.now()].filter((t) => Date.now() - t < 1000),
					);
					resetRenda();
				}}
			/>
			<Flex gap="2" direction="column">
				<Text size="4" weight="bold">
					<Trans i18nKey="page.test.keyboardTestEntry.label">
						键盘（DFJK）
					</Trans>
				</Text>
				<Text size="2">
					<Trans i18nKey="page.test.keyboardTestEntry.frameSampleMode.label">
						逐帧采样模式
					</Trans>
					<Switch
						ml="2"
						checked={useFrameSampleMode}
						onCheckedChange={setUseFrameSampleMode}
					/>
				</Text>
				<div className={styles.hitCounters}>
					<Tooltip
						side="bottom"
						content={t(
							"page.test.leftKaTotalCounter.tooltip",
							"左鼓边敲击总计数",
						)}
					>
						<Box className={styles.rim}>{leftKa}</Box>
					</Tooltip>
					<Tooltip
						side="bottom"
						content={t(
							"page.test.leftDonTotalCounter.tooltip",
							"左鼓面敲击总计数",
						)}
					>
						<Box className={styles.surface}>{leftDon}</Box>
					</Tooltip>
					<Tooltip
						side="bottom"
						content={t(
							"page.test.rightDonTotalCounter.tooltip",
							"右鼓面敲击总计数",
						)}
					>
						<Box className={styles.surface}>{rightDon}</Box>
					</Tooltip>
					<Tooltip
						side="bottom"
						content={t(
							"page.test.rightKaTotalCounter.tooltip",
							"右鼓边敲击总计数",
						)}
					>
						<Box className={styles.rim}>{rightKa}</Box>
					</Tooltip>
					<Tooltip
						side="bottom"
						content={t("page.test.resetCounters.tooltip", "重置计数")}
					>
						<IconButton
							variant="soft"
							onClick={() => {
								setLeftKa(0);
								setLeftDon(0);
								setRightDon(0);
								setRightKa(0);
							}}
						>
							<ReloadIcon />
						</IconButton>
					</Tooltip>
				</div>
			</Flex>

			<div className={styles.rendaCounters}>
				<Flex gap="2" align="center" direction="column">
					<Text size="2" color="red">
						<Trans i18nKey="page.test.donRendaCounter.label">
							鼓面连打计数
						</Trans>
					</Text>
					<Box className={classNames(styles.surface, styles.renda)}>
						{surfaceRenda}
					</Box>
					<Box className={classNames(styles.surface, styles.renda)}>
						{t("page.test.rendaSpeed.label", "{speed} 下/秒", {
							speed: surfaceRendaTimes.length,
						})}
					</Box>
				</Flex>
				<Flex gap="2" align="center" direction="column">
					<Text size="2" color="blue">
						<Trans i18nKey="page.test.kaRendaCounter.label">鼓边连打计数</Trans>
					</Text>
					<Box className={classNames(styles.rim, styles.renda)}>{rimRenda}</Box>
					<Box className={classNames(styles.rim, styles.renda)}>
						{t("page.test.rendaSpeed.label", "{speed} 下/秒", {
							speed: rimRendaTimes.length,
						})}
					</Box>
				</Flex>
			</div>
		</div>
	);
};

const JoystickTestEntry = ({
	playerIndex,
}: {
	playerIndex: number;
}) => {
	const { t } = useTranslation();
	const [gamepadName, setGamepadName] = useAtomState("");

	const [leftKa, setLeftKa] = useAtomState(0);
	const [leftDon, setLeftDon] = useAtomState(0);
	const [rightDon, setRightDon] = useAtomState(0);
	const [rightKa, setRightKa] = useAtomState(0);

	const [surfaceRendaTimes, setSurfaceRendaTimes] = useAtomState(
		[] as number[],
	);
	const [rimRendaTimes, setRimRendaTimes] = useAtomState([] as number[]);
	const [surfaceRenda, setSurfaceRenda] = useAtomState(0);
	const [rimRenda, setRimRenda] = useAtomState(0);

	const resetRef = useRef(0 as unknown as ReturnType<typeof setTimeout>);

	const resetRenda = () => {
		if (resetRef.current) {
			clearTimeout(resetRef.current);
		}
		resetRef.current = setTimeout(() => {
			setSurfaceRenda(0);
			setRimRenda(0);
		}, 2000);
	};

	useEffect(() => {
		const onGamepadConnected = (e: GamepadEvent) => {
			if (e.gamepad.index === playerIndex) {
				setGamepadName(e.gamepad.id);
				setLeftKa(0);
				setLeftDon(0);
				setRightDon(0);
				setRightKa(0);
			}
		};
		const onGamepadDisconnected = (e: GamepadEvent) => {
			if (e.gamepad.index === playerIndex) {
				setGamepadName("");
				setLeftKa(0);
				setLeftDon(0);
				setRightDon(0);
				setRightKa(0);
			}
		};
		window.addEventListener("gamepadconnected", onGamepadConnected);
		window.addEventListener("gamepaddisconnected", onGamepadDisconnected);
		return () => {
			window.removeEventListener("gamepadconnected", onGamepadConnected);
			window.removeEventListener("gamepaddisconnected", onGamepadDisconnected);
		};
	}, [playerIndex]);

	return (
		<div
			className={styles.testEntry}
			style={{
				opacity: gamepadName ? 1 : 0.5,
				pointerEvents: gamepadName ? "auto" : "none",
				userSelect: gamepadName ? "auto" : "none",
			}}
		>
			<TaikoVisualizerForJoystick
				fillColor="transparent"
				outlineColor="var(--gray-10)"
				playerIndex={playerIndex}
				onLeftRimInvoked={() => {
					setLeftKa((v) => v + 1);
					setRimRenda((v) => v + 1);
					setRimRendaTimes((v) =>
						[...v, Date.now()].filter((t) => Date.now() - t < 1000),
					);
					resetRenda();
				}}
				onLeftSurfaceInvoked={() => {
					setLeftDon((v) => v + 1);
					setSurfaceRenda((v) => v + 1);
					setSurfaceRendaTimes((v) =>
						[...v, Date.now()].filter((t) => Date.now() - t < 1000),
					);
					resetRenda();
				}}
				onRightSurfaceInvoked={() => {
					setRightDon((v) => v + 1);
					setSurfaceRenda((v) => v + 1);
					setSurfaceRendaTimes((v) =>
						[...v, Date.now()].filter((t) => Date.now() - t < 1000),
					);
					resetRenda();
				}}
				onRightRimInvoked={() => {
					setRightKa((v) => v + 1);
					setRimRenda((v) => v + 1);
					setRimRendaTimes((v) =>
						[...v, Date.now()].filter((t) => Date.now() - t < 1000),
					);
					resetRenda();
				}}
			/>
			<Flex gap="2" direction="column">
				<Text size="4" weight="bold">
					{gamepadName ||
						t(
							"page.test.joystickTestEntry.noConnectedLabel",
							"手柄 {playerIndex} 未连接",
							{ playerIndex: playerIndex + 1 },
						)}
				</Text>
				<div className={styles.hitCounters}>
					<Tooltip
						side="bottom"
						content={t(
							"page.test.leftKaTotalCounter.tooltip",
							"左鼓边敲击总计数",
						)}
					>
						<Box className={styles.rim}>{leftKa}</Box>
					</Tooltip>
					<Tooltip
						side="bottom"
						content={t(
							"page.test.leftDonTotalCounter.tooltip",
							"左鼓面敲击总计数",
						)}
					>
						<Box className={styles.surface}>{leftDon}</Box>
					</Tooltip>
					<Tooltip
						side="bottom"
						content={t(
							"page.test.rightDonTotalCounter.tooltip",
							"右鼓面敲击总计数",
						)}
					>
						<Box className={styles.surface}>{rightDon}</Box>
					</Tooltip>
					<Tooltip
						side="bottom"
						content={t(
							"page.test.rightKaTotalCounter.tooltip",
							"右鼓边敲击总计数",
						)}
					>
						<Box className={styles.rim}>{rightKa}</Box>
					</Tooltip>
					<Tooltip
						side="bottom"
						content={t("page.test.resetCounters.tooltip", "重置计数")}
					>
						<IconButton
							variant="soft"
							onClick={() => {
								setLeftKa(0);
								setLeftDon(0);
								setRightDon(0);
								setRightKa(0);
							}}
						>
							<ReloadIcon />
						</IconButton>
					</Tooltip>
				</div>
			</Flex>
			<div className={styles.rendaCounters}>
				<Flex gap="2" align="center" direction="column">
					<Text size="2" color="red">
						<Trans i18nKey="page.test.donRendaCounter.label">
							鼓面连打计数
						</Trans>
					</Text>
					<Box className={classNames(styles.surface, styles.renda)}>
						{surfaceRenda}
					</Box>
					<Box className={classNames(styles.surface, styles.renda)}>
						{t("page.test.rendaSpeed.label", "{speed} 下/秒", {
							speed: surfaceRendaTimes.length,
						})}
					</Box>
				</Flex>
				<Flex gap="2" align="center" direction="column">
					<Text size="2" color="blue">
						<Trans i18nKey="page.test.kaRendaCounter.label">鼓边连打计数</Trans>
					</Text>
					<Box className={classNames(styles.rim, styles.renda)}>{rimRenda}</Box>
					<Box className={classNames(styles.rim, styles.renda)}>
						{t("page.test.rendaSpeed.label", "{speed} 下/秒", {
							speed: rimRendaTimes.length,
						})}
					</Box>
				</Flex>
			</div>
		</div>
	);
};

export const TestPage = () => {
	return (
		<Flex direction="column" justify="center" align="center">
			<KeyboardTestEntry />
			<Separator size="4" />
			<JoystickTestEntry playerIndex={0} />
			<Separator size="4" />
			<JoystickTestEntry playerIndex={1} />
			<Separator size="4" />
			<JoystickTestEntry playerIndex={2} />
			<Separator size="4" />
			<JoystickTestEntry playerIndex={3} />
		</Flex>
	);
};
