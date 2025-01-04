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
import { ReloadIcon, ResetIcon } from "@radix-ui/react-icons";
import { atom, useAtom } from "jotai";
import { useEffect, useMemo, useRef } from "react";
import { TaikoVisualizerForJoystick } from "../TaikoVisualizer/joystick.tsx";
import classNames from "classnames";

const useAtomState = <T,>(value: T) =>
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useAtom(useMemo(() => atom(value), []));

const KeyboardTestEntry = () => {
	const [useFrameSampleMode, setUseFrameSampleMode] = useAtomState(false);

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
			setLeftKa(0);
			setLeftDon(0);
			setRightDon(0);
			setRightKa(0);
			setSurfaceRenda(0);
			setRimRenda(0);
		}, 2000);
	};

	return (
		<Flex align="center" gap="4">
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
					键盘（DFJK）
				</Text>
				<Text size="2">
					逐帧采样模式
					<Switch
						ml="2"
						checked={useFrameSampleMode}
						onCheckedChange={setUseFrameSampleMode}
					/>
				</Text>
				<Flex gap="2">
					<Tooltip content="左鼓边敲击总计数">
						<Box className={styles.rim}>{leftKa}</Box>
					</Tooltip>
					<Tooltip content="左鼓面敲击总计数">
						<Box className={styles.surface}>{leftDon}</Box>
					</Tooltip>
					<Tooltip content="右鼓面敲击总计数">
						<Box className={styles.surface}>{rightDon}</Box>
					</Tooltip>
					<Tooltip content="右鼓边敲击总计数">
						<Box className={styles.rim}>{rightKa}</Box>
					</Tooltip>
					<Tooltip content="重置计数">
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
				</Flex>
			</Flex>

			<Flex gap="2" align="center" direction="column">
				<Text size="2" color="red">
					鼓面连打计数
				</Text>
				<Box className={classNames(styles.surface, styles.renda)}>
					{surfaceRenda}
				</Box>
				<Box className={classNames(styles.surface, styles.renda)}>
					{surfaceRendaTimes.length} 下/秒
				</Box>
			</Flex>
			<Flex gap="2" align="center" direction="column">
				<Text size="2" color="blue">
					鼓边连打计数
				</Text>
				<Box className={classNames(styles.rim, styles.renda)}>{rimRenda}</Box>
				<Box className={classNames(styles.rim, styles.renda)}>
					{rimRendaTimes.length} 下/秒
				</Box>
			</Flex>
		</Flex>
	);
};

const JoystickTestEntry = ({
	playerIndex,
}: {
	playerIndex: number;
}) => {
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
			setLeftKa(0);
			setLeftDon(0);
			setRightDon(0);
			setRightKa(0);
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
		<Flex
			align="center"
			gap="4"
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
					{gamepadName || `手柄 ${playerIndex + 1} 未连接`}
				</Text>
				<Flex gap="2">
					<Tooltip content="左鼓边敲击总计数">
						<Box className={styles.rim}>{leftKa}</Box>
					</Tooltip>
					<Tooltip content="左鼓面敲击总计数">
						<Box className={styles.surface}>{leftDon}</Box>
					</Tooltip>
					<Tooltip content="右鼓面敲击总计数">
						<Box className={styles.surface}>{rightDon}</Box>
					</Tooltip>
					<Tooltip content="右鼓边敲击总计数">
						<Box className={styles.rim}>{rightKa}</Box>
					</Tooltip>
					<Tooltip content="重置计数">
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
				</Flex>
			</Flex>
			<Flex gap="2" align="center" direction="column">
				<Text size="2" color="red">
					鼓面连打计数
				</Text>
				<Box className={classNames(styles.surface, styles.renda)}>
					{surfaceRenda}
				</Box>
				<Box className={classNames(styles.surface, styles.renda)}>
					{surfaceRendaTimes.length} 下/秒
				</Box>
			</Flex>
			<Flex gap="2" align="center" direction="column">
				<Text size="2" color="blue">
					鼓边连打计数
				</Text>
				<Box className={classNames(styles.rim, styles.renda)}>{rimRenda}</Box>
				<Box className={classNames(styles.rim, styles.renda)}>
					{rimRendaTimes.length} 下/秒
				</Box>
			</Flex>
		</Flex>
	);
};

export const TestPage = () => {
	return (
		<Flex direction="column" align="center" minWidth="100%">
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
