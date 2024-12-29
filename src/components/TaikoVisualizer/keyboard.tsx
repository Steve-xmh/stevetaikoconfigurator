import {
	useEffect,
	useRef,
	type ComponentProps,
	type PropsWithoutRef,
} from "react";
import { TaikoVisualizer, type TaikoVisualizerRef } from "./index.tsx";

export const TaikoVisualizerForKeyboard = (
	props: PropsWithoutRef<ComponentProps<typeof TaikoVisualizer>> & {
		sampleMethod: "event" | "frame";
	},
) => {
	const taikoRef = useRef<TaikoVisualizerRef>(null);

	useEffect(() => {
		// 事件采样 - 适合模拟器软件
		if (props.sampleMethod === "event") {
			const keydownListener = (e: KeyboardEvent) => {
				if (e.key === "d") {
					taikoRef.current?.invokeLeftRimAnimation();
				} else if (e.key === "k") {
					taikoRef.current?.invokeRightRimAnimation();
				} else if (e.key === "f") {
					taikoRef.current?.invokeLeftSurfaceAnimation();
				} else if (e.key === "j") {
					taikoRef.current?.invokeRightSurfaceAnimation();
				}
			};
			window.addEventListener("keydown", keydownListener);

			return () => {
				window.removeEventListener("keydown", keydownListener);
			};
		}
		// 逐帧采样 - 符合大部分官方游戏的实现方式
		if (props.sampleMethod === "frame") {
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
		}
	}, [props.sampleMethod]);

	return <TaikoVisualizer {...props} ref={taikoRef} />;
};
