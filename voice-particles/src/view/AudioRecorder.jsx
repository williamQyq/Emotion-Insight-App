import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { webmFixDuration } from "../utils/BlobFix.js";
function getMimeType() {
	const types = [
		"audio/webm",
		"audio/mp4",
		"audio/ogg",
		"audio/wav",
		"audio/aac",
	];
	for (let i = 0; i < types.length; i++) {
		if (MediaRecorder.isTypeSupported(types[i])) {
			return types[i];
		}
	}
	return undefined;
}

export default function AudioRecorder({ onRecordingComplete }) {
	const [recording, setRecording] = useState(false);
	const [duration, setDuration] = useState(0);
	const [recordedBlob, setRecordedBlob] = useState(null);

	const streamRef = useRef(null);
	const mediaRecorderRef = useRef(null);
	const chunksRef = useRef([]);

	const audioRef = useRef(null);

	const startRecording = async () => {
		setRecordedBlob(null);
		let startTime = Date.now();

		try {
			if (!streamRef.current) {
				streamRef.current = await navigator.mediaDevices.getUserMedia({
					audio: true,
				});
			}

			const memeType = getMimeType();
			const mediaRecorder = new MediaRecorder(streamRef.current, {
				mimeType: memeType,
			});
			mediaRecorderRef.current = mediaRecorder;

			mediaRecorder.addEventListener("dataavailable", async (event) => {
				if (event.data.size > 0) {
					chunksRef.current.push(event.data);
				}
				if (mediaRecorder.state === "inactive") {
					const duration = Date.now() - startTime;

					let blob = new Blob(chunksRef.current, { type: memeType });

					if (memeType === "audio/webm") {
						console.log("webm audio detected");
						blob = await webmFixDuration(blob, duration, blob.type);
					}
					setRecordedBlob(blob);
					onRecordingComplete(blob);
					chunksRef.current = [];
				}
			});
			mediaRecorder.start();
			setRecording(true);
		} catch (error) {
			console.error("Error starting recording: ", error);
		}
	};
	const stopRecording = () => {
		if (
			mediaRecorderRef.current &&
			mediaRecorderRef.current.state == "recording"
		) {
			mediaRecorderRef.current.stop();
			// setDuration(0);
			setRecording(false);
		}
	};

	const handleToggleRecording = () => {
		if (recording) {
			stopRecording();
		} else {
			startRecording();
		}
	};
	useEffect(() => {
		let stream = null;
		if (recording) {
			const timer = setInterval(() => {
				setDuration((duration) => duration + 1000);
			}, 1000);
			return () => {
				clearInterval(timer);
			};
		}
		return () => {
			if (stream) {
				stream.getTracks().forEach((track) => track.stop());
			}
		};
	}, [recording]);

	return (
		<div className="flex flex-col items-center justify-center">
			<button
				type="button"
				className={`m-2 inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-all duration-200 ${
					recording
						? "bg-red-500 hover:bg-red-600"
						: "bg-green-500 hover:bg-green-600"
				}`}
				onClick={handleToggleRecording}
			>
				{recording ? `Stop Recording ${duration}` : "Start Recording"}
			</button>
			{recordedBlob && (
				<audio className="w-full" ref={audioRef} controls>
					<source
						src={URL.createObjectURL(recordedBlob)}
						type={recordedBlob.type}
					/>
				</audio>
			)}
		</div>
	);
}

AudioRecorder.propTypes = {
	onRecordingComplete: PropTypes.func.isRequired,
};
