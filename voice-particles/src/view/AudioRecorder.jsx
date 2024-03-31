import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

export default function AudioRecorder({ audioManager }) {
	const [duration, setDuration] = useState(0);

	// const streamRef = useRef(null);
	// const mediaRecorderRef = useRef(null);
	// const chunksRef = useRef([]);

	const audioRef = useRef(null);
	const { recordedBlob, isRecording } = audioManager;

	useEffect(() => {
		let stream = null;
		if (isRecording) {
			const timer = setInterval(() => {
				setDuration((duration) => duration + 1);
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
	}, [isRecording]);

	return (
		<div className="d-flex align-items-center justify-content-center">
			<div className="rec-duration">duration: {duration}</div>
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
	audioManager: PropTypes.shape({
		recordedBlob: PropTypes.object,
		isRecording: PropTypes.bool,
	}).isRequired,
};
