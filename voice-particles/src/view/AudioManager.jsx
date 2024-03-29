import React, { useState } from "react";
import AudioRecorder from "./AudioRecorder";
import PropTypes from "prop-types";
import Constants from "../utils/Constants";

export default function AudioManager({ transcriber }) {
	const [audioData, setAudioData] = useState(undefined);
	const [progress, setProgress] = useState(undefined);

	const resetAudio = () => {
		setAudioData(undefined);
	};

	const setAudioFromRecording = async (data) => {
		resetAudio();
		setProgress(0);
		const blobUrl = URL.createObjectURL(data);
		const fileReader = new FileReader();

		fileReader.onprogress = (e) => {
			setProgress((e.loaded / e.total) * 100 || 0);
		};

		fileReader.onloadend = async () => {
			const audioCTX = new AudioContext({
				sampleRate: Constants.SAMPLING_RATE,
			});

			const arrayBuffer = fileReader.result;
			const decoded = await audioCTX.decodeAudioData(arrayBuffer);
			// setProgress(undefined);
			setAudioData({
				buffer: decoded,
				url: blobUrl,
				source: "Recording",
				mimeType: data.type,
			});
		};
		fileReader.readAsArrayBuffer(data);
	};

	return (
		<div>
			<div>
				{navigator.mediaDevices && (
					<RecordTile
						icon={<MicrophoneIcon />}
						text={"Record"}
						setAudioData={(e) => {
							transcriber.onInputChange();
							setAudioFromRecording(e);
						}}
					/>
				)}
			</div>

			<div>Progress: {progress}</div>
			{audioData && (
				<TranscribeButton
					onClick={() => {
						console.log("transcribe audio");
						transcriber.start(audioData.buffer);
					}}
					isModelLoading={transcriber.isModelLoading}
					isTranscribing={transcriber.isBusy}
				/>
			)}
			{transcriber.progressItems.length > 0 && <label> Loading model</label>}
		</div>
	);
}

AudioManager.propTypes = {
	transcriber: PropTypes.shape({
		start: PropTypes.func.isRequired,
		onInputChange: PropTypes.func.isRequired,
		progressItems: PropTypes.array.isRequired,
		isModelLoading: PropTypes.bool.isRequired,
		isBusy: PropTypes.bool.isRequired,
	}).isRequired,
};

function TranscribeButton(props) {
	const { isModelLoading, isTranscribing, onClick } = props;
	return (
		<button
			className="transcribe-btn btn btn-primary"
			onClick={(event) => {
				if (onClick && !isTranscribing && !isModelLoading) {
					onClick(event);
				}
			}}
			disabled={isTranscribing || isModelLoading}
		>
			Transcribe
		</button>
	);
}

TranscribeButton.propTypes = {
	isModelLoading: PropTypes.bool.isRequired,
	isTranscribing: PropTypes.bool.isRequired,
	onClick: PropTypes.func.isRequired,
};

function RecordTile({ icon, text, setAudioData }) {
	const [audioBlob, setAudioBlob] = useState(null);

	const onRecordingComplete = (blob) => {
		setAudioBlob(blob);
	};

	const onSubmit = () => {
		setAudioData(audioBlob);
		//reset audio blob
		setAudioBlob(undefined);
	};
	return (
		<div>
			<Tile icon={icon} text={text} />
			<AudioRecorder onRecordingComplete={onRecordingComplete} />
			<button onClick={onSubmit}>Submit</button>
		</div>
	);
}
RecordTile.propTypes = {
	icon: PropTypes.element.isRequired,
	text: PropTypes.string,
	setAudioData: PropTypes.func.isRequired,
};

function Tile({ icon, text }) {
	return (
		<button className="flex items-center justify-center btn btn-secondary">
			<div className="w-7 h-7">{icon}</div>
			{text && <div className="text-sm text-center">{text}</div>}
		</button>
	);
}
Tile.propTypes = {
	icon: PropTypes.element.isRequired,
	text: PropTypes.string,
};

function MicrophoneIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			stroke="currentColor"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
			/>
		</svg>
	);
}
