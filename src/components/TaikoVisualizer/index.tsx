import { useImperativeHandle, useLayoutEffect, useRef, type Ref } from "react";
import styles from "./index.module.css";

export interface TaikoVisualizerRef {
	invokeLeftRimAnimation: () => void;
	invokeRightRimAnimation: () => void;
	invokeLeftSurfaceAnimation: () => void;
	invokeRightSurfaceAnimation: () => void;
}

const DEFAULT_FILL_COLOR = "#F7EFE0";
const DEFAULT_OUTLINE_COLOR = "black";

export const TaikoVisualizer = (props: {
	size?: number;
	outlineColor?: string;
	fillColor?: string;
	ref?: Ref<TaikoVisualizerRef>;
}) => {
	const fillColor = props.fillColor ?? DEFAULT_FILL_COLOR;
	const outlineColor = props.outlineColor ?? DEFAULT_OUTLINE_COLOR;

	const leftRimRef = useRef<SVGGElement>(null);
	const rightRimRef = useRef<SVGGElement>(null);
	const leftSurfaceRef = useRef<SVGGElement>(null);
	const rightSurfaceRef = useRef<SVGGElement>(null);

	const leftRimAnimationRef = useRef<Animation>(null);
	const rightRimAnimationRef = useRef<Animation>(null);
	const leftSurfaceAnimationRef = useRef<Animation>(null);
	const rightSurfaceAnimationRef = useRef<Animation>(null);

	useLayoutEffect(() => {
		leftRimRef.current?.style.setProperty("opacity", "0");
		rightRimRef.current?.style.setProperty("opacity", "0");
		leftSurfaceRef.current?.style.setProperty("opacity", "0");
		rightSurfaceRef.current?.style.setProperty("opacity", "0");
	}, []);

	useImperativeHandle(
		props.ref,
		() => ({
			invokeLeftRimAnimation: () => {
				const leftRim = leftRimRef.current;
				if (!leftRim) return;
				leftRimAnimationRef.current?.cancel();
				leftRimAnimationRef.current = leftRim.animate(
					[{ opacity: 1 }, { opacity: 0 }],
					{
						duration: 150,
					},
				);
			},
			invokeRightRimAnimation: () => {
				const rightRim = rightRimRef.current;
				if (!rightRim) return;
				rightRimAnimationRef.current?.cancel();
				rightRimAnimationRef.current = rightRim.animate(
					[{ opacity: 1 }, { opacity: 0 }],
					{
						duration: 150,
					},
				);
			},
			invokeLeftSurfaceAnimation: () => {
				const leftSurface = leftSurfaceRef.current;
				if (!leftSurface) return;
				leftSurfaceAnimationRef.current?.cancel();
				leftSurfaceAnimationRef.current = leftSurface.animate(
					[{ opacity: 1 }, { opacity: 0 }],
					{
						duration: 150,
					},
				);
			},
			invokeRightSurfaceAnimation: () => {
				const rightSurface = rightSurfaceRef.current;
				if (!rightSurface) return;
				rightSurfaceAnimationRef.current?.cancel();
				rightSurfaceAnimationRef.current = rightSurface.animate(
					[{ opacity: 1 }, { opacity: 0 }],
					{
						duration: 150,
					},
				);
			},
		}),
		[],
	);
	return (
		// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
		<svg
			width={props.size ?? 180}
			height={props.size ?? 180}
			viewBox="0 0 180 180"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle
				cx="90"
				cy="90"
				r="72"
				fill={fillColor}
				stroke={outlineColor}
				strokeWidth="4"
			/>
			<g opacity="0.2">
				<circle
					cx="90"
					cy="90"
					r="50"
					fill={fillColor}
					stroke={outlineColor}
					strokeWidth="2"
				/>
				<rect x="89" y="40" width="2" height="100" fill={outlineColor} />
			</g>
			<mask
				id="mask0_575_52"
				style={{
					maskType: "alpha",
				}}
				maskUnits="userSpaceOnUse"
				x="-12"
				y="-12"
				width="102"
				height="204"
			>
				<rect x="-12" y="-12" width="102" height="204" fill="#D9D9D9" />
			</mask>
			<g mask="url(#mask0_575_52)" ref={leftRimRef}>
				<circle cx="90" cy="90" r="90" fill="url(#paint0_radial_575_52)" />
			</g>
			<mask
				id="mask1_575_52"
				style={{
					maskType: "alpha",
				}}
				maskUnits="userSpaceOnUse"
				x="90"
				y="-12"
				width="102"
				height="204"
			>
				<rect
					width="102"
					height="204"
					transform="matrix(-1 0 0 1 192 -12)"
					fill="#D9D9D9"
				/>
			</mask>
			<g mask="url(#mask1_575_52)" ref={rightRimRef}>
				<circle
					cx="90"
					cy="90"
					r="90"
					transform="matrix(-1 0 0 1 180 0)"
					fill="url(#paint1_radial_575_52)"
				/>
			</g>
			<mask
				id="mask2_575_52"
				style={{
					maskType: "alpha",
				}}
				maskUnits="userSpaceOnUse"
				x="-12"
				y="-12"
				width="102"
				height="204"
			>
				<rect x="-12" y="-12" width="102" height="204" fill="#D9D9D9" />
			</mask>
			<g mask="url(#mask2_575_52)" ref={leftSurfaceRef}>
				<circle cx="90" cy="90" r="60" fill="url(#paint2_radial_575_52)" />
			</g>
			<mask
				id="mask3_575_52"
				style={{
					maskType: "alpha",
				}}
				maskUnits="userSpaceOnUse"
				x="90"
				y="-12"
				width="102"
				height="204"
			>
				<rect
					width="102"
					height="204"
					transform="matrix(-1 0 0 1 192 -12)"
					fill="#D9D9D9"
				/>
			</mask>
			<g mask="url(#mask3_575_52)" ref={rightSurfaceRef}>
				<circle
					cx="60"
					cy="60"
					r="60"
					transform="matrix(-1 0 0 1 150 30)"
					fill="url(#paint3_radial_575_52)"
				/>
			</g>
			<defs>
				<radialGradient
					id="paint0_radial_575_52"
					cx="0"
					cy="0"
					r="1"
					gradientUnits="userSpaceOnUse"
					gradientTransform="translate(90 90) rotate(90) scale(90)"
				>
					<stop offset="0.55555" stopColor="#0BEDED" stopOpacity="0" />
					<stop offset="0.56" stopColor="#0BEDED" />
					<stop offset="0.82" stopColor="#0BEDED" />
					<stop offset="1" stopColor="#068787" stopOpacity="0" />
				</radialGradient>
				<radialGradient
					id="paint1_radial_575_52"
					cx="0"
					cy="0"
					r="1"
					gradientUnits="userSpaceOnUse"
					gradientTransform="translate(90 90) rotate(90) scale(90)"
				>
					<stop offset="0.55555" stopColor="#0BEDED" stopOpacity="0" />
					<stop offset="0.56" stopColor="#0BEDED" />
					<stop offset="0.82" stopColor="#0BEDED" />
					<stop offset="1" stopColor="#068787" stopOpacity="0" />
				</radialGradient>
				<radialGradient
					id="paint2_radial_575_52"
					cx="0"
					cy="0"
					r="1"
					gradientUnits="userSpaceOnUse"
					gradientTransform="translate(90 90) rotate(90) scale(60)"
				>
					<stop offset="0.82" stopColor="#F84828" />
					<stop offset="1" stopColor="#F84828" stopOpacity="0" />
				</radialGradient>
				<radialGradient
					id="paint3_radial_575_52"
					cx="0"
					cy="0"
					r="1"
					gradientUnits="userSpaceOnUse"
					gradientTransform="translate(60 60) rotate(90) scale(60)"
				>
					<stop offset="0.82" stopColor="#F84828" />
					<stop offset="1" stopColor="#F84828" stopOpacity="0" />
				</radialGradient>
			</defs>
		</svg>
	);
};
