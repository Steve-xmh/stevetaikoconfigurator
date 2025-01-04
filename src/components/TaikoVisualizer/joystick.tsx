import {
	useEffect,
	useRef,
	useState,
	type ComponentProps,
	type PropsWithoutRef,
} from "react";
import { TaikoVisualizer, type TaikoVisualizerRef } from "./index.tsx";

export const TaikoVisualizerForJoystick = ({
	playerIndex,
	...props
}: PropsWithoutRef<ComponentProps<typeof TaikoVisualizer>> & {
	playerIndex: number;
}) => {
	const taikoRef = useRef<TaikoVisualizerRef>(null);
	const [joystickConnected, setJoystickConnected] = useState(false);

	useEffect(() => {
		const onGamepadConnected = (e: GamepadEvent) => {
			if (e.gamepad.index === playerIndex) {
				setJoystickConnected(true);
			}
		};
		const onGamepadDisconnected = (e: GamepadEvent) => {
			if (e.gamepad.index === playerIndex) {
				setJoystickConnected(false);
			}
		};
		window.addEventListener("gamepadconnected", onGamepadConnected);
		window.addEventListener("gamepaddisconnected", onGamepadDisconnected);
		return () => {
			window.removeEventListener("gamepadconnected", onGamepadConnected);
			window.removeEventListener("gamepaddisconnected", onGamepadDisconnected);
		};
	}, [playerIndex]);

	useEffect(() => {
		if (!joystickConnected) return;
		let canceled = false;

		let leftRim = false;
		let rightRim = false;
		let leftSurface = false;
		let rightSurface = false;

		const frame = () => {
			if (canceled) return;
			const joystick = navigator.getGamepads()[playerIndex];

			if (joystick) {
				if (joystick.buttons[6].pressed && !leftRim) {
					taikoRef.current?.invokeLeftRimAnimation();
					leftRim = true;
				} else if (!joystick.buttons[6].pressed) {
					leftRim = false;
				}

				if (joystick.buttons[7].pressed && !rightRim) {
					taikoRef.current?.invokeRightRimAnimation();
					rightRim = true;
				} else if (!joystick.buttons[7].pressed) {
					rightRim = false;
				}

				if (joystick.buttons[10].pressed && !leftSurface) {
					taikoRef.current?.invokeLeftSurfaceAnimation();
					leftSurface = true;
				} else if (!joystick.buttons[10].pressed) {
					leftSurface = false;
				}

				if (joystick.buttons[11].pressed && !rightSurface) {
					taikoRef.current?.invokeRightSurfaceAnimation();
					rightSurface = true;
				} else if (!joystick.buttons[11].pressed) {
					rightSurface = false;
				}
			}

			requestAnimationFrame(frame);
		};
		frame();

		return () => {
			canceled = true;
		};
	}, [playerIndex, joystickConnected]);

	return <TaikoVisualizer {...props} ref={taikoRef} />;
};
