import {
	useEffect,
	useRef,
	type ComponentProps,
	type PropsWithoutRef,
} from "react";
import { TaikoVisualizer, type TaikoVisualizerRef } from "./index.tsx";

export const TaikoVisualizerForJoystick = (
	props: PropsWithoutRef<ComponentProps<typeof TaikoVisualizer>> & {
        playerIndex: number;
	},
) => {
	const taikoRef = useRef<TaikoVisualizerRef>(null);

	useEffect(() => {
			const keySet = new Set<string>();
			let canceled = false;

			const onBlurred = () => {
				keySet.clear();
			};

			const onKeydown = (e: KeyboardEvent) => {
				keySet.add(e.key);
			};

			const onKeyup = (e: KeyboardEvent) => {
				keySet.delete(e.key);
			};

			window.addEventListener("blur", onBlurred);
			window.addEventListener("keydown", onKeydown);
			window.addEventListener("keyup", onKeyup);

			let leftRim = false;
			let rightRim = false;
			let leftSurface = false;
			let rightSurface = false;

			const frame = () => {
				if (canceled) return;
                const joystick = navigator.getGamepads()[props.playerIndex];

				if (keySet.has("d") && !leftRim) {
					taikoRef.current?.invokeLeftRimAnimation();
					leftRim = true;
				} else if (!keySet.has("d")) {
					leftRim = false;
				}

				if (keySet.has("k") && !rightRim) {
					taikoRef.current?.invokeRightRimAnimation();
					rightRim = true;
				} else if (!keySet.has("k")) {
					rightRim = false;
				}

				if (keySet.has("f") && !leftSurface) {
					taikoRef.current?.invokeLeftSurfaceAnimation();
					leftSurface = true;
				} else if (!keySet.has("f")) {
					leftSurface = false;
				}

				if (keySet.has("j") && !rightSurface) {
					taikoRef.current?.invokeRightSurfaceAnimation();
					rightSurface = true;
				} else if (!keySet.has("j")) {
					rightSurface = false;
				}

				requestAnimationFrame(frame);
			};
			frame();

			return () => {
				canceled = true;
				window.removeEventListener("blur", onBlurred);
				window.removeEventListener("keydown", onKeydown);
				window.removeEventListener("keyup", onKeyup);
			};
	}, [props.playerIndex]);

	return <TaikoVisualizer {...props} ref={taikoRef} />;
};
    useEffect,
useRef,
	type ComponentProps,
	type PropsWithoutRef,
	TaikoVisualizer, type TaikoVisualizerRef, 