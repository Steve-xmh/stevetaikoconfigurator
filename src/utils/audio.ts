import donAudio from "$/assets/don.mp3?inline";
import kaAudio from "$/assets/ka.mp3?inline";

const ctx = new AudioContext({
	latencyHint: "interactive",
});

const donAudioData = new Uint8Array(
	atob(donAudio.split(",")[1])
		.split("")
		.map((c) => c.charCodeAt(0)),
);
const kaAudioData = new Uint8Array(
	atob(kaAudio.split(",")[1])
		.split("")
		.map((c) => c.charCodeAt(0)),
);
const volumeNode = ctx.createGain();
volumeNode.gain.value = 0.5;
volumeNode.connect(ctx.destination);

const donAudioBuffer = ctx.decodeAudioData(donAudioData.buffer);

const kaAudioBuffer = ctx.decodeAudioData(kaAudioData.buffer);

export async function playDonAudio() {
	await ctx.resume();
	const source = ctx.createBufferSource();
	source.buffer = await donAudioBuffer;
	source.onended = () => {
		source.disconnect();
	};
	source.connect(volumeNode);
	source.start();
}

export async function playKaAudio() {
	await ctx.resume();
	const source = ctx.createBufferSource();
	source.buffer = await kaAudioBuffer;
	source.onended = () => {
		source.disconnect();
	};
	source.connect(volumeNode);
	source.start();
}
