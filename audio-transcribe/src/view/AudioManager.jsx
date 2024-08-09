import React, { useEffect } from "react";
import AudioRecorder from "./AudioRecorder";
import PropTypes from "prop-types";
import useAudioManager from "../hooks/useAudioManager.js";

export default function AudioManager({ transcriber }) {
	const audioManager = useAudioManager();

	useEffect(() => {
		if (audioManager.isAudioLoading) {
			console.log("audio is loading: ", audioManager.progress, "%");
		}
	}, [audioManager.isAudioLoading, audioManager.progress]);

	return (
		<section className="audio-manager">
			<div className="row">
				<div className="record-tile col-6">
					{navigator.mediaDevices && (
						<RecordTile
							audioManager={audioManager}
							clearTranscript={() => transcriber.onInputChange()}
						/>
					)}
				</div>
				<div className="trans-btn col-6">
					{audioManager.audioData && (
						<TranscribeButton
							onClick={() => {
								console.log("start transcribing audio...");
								transcriber.start(audioManager.audioData.buffer);
							}}
							isModelLoading={transcriber.isModelLoading}
							isTranscribing={transcriber.isBusy}
						/>
					)}
				</div>
			</div>
			<div className="row">
				<AudioRecorder audioManager={audioManager} />
			</div>
			{transcriber.progressItems.length > 0 && <label> Loading model...</label>}
		</section>
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

function RecordTile({ audioManager, clearTranscript }) {
	const { isRecording } = audioManager;

	const toggleRecording = () => {
		if (isRecording) {
			audioManager.stopRecording();
		} else {
			clearTranscript();
			audioManager.startRecording();
		}
	};

	return (
		<button
			type="button"
			className={`btn ${isRecording ? "btn-danger" : "btn-success"}`}
			onClick={toggleRecording}
		>
			<Tile icon={<MicrophoneIcon />} text={isRecording ? "Stop" : "Record"} />
		</button>
	);
}
RecordTile.propTypes = {
	audioManager: PropTypes.object.isRequired,
	clearTranscript: PropTypes.func,
};

function Tile({ icon, text }) {
	return (
		<div className="row">
			<div className="col-4 justify-content-center">
				<div style={{ width: 28, height: 28 }}>{icon}</div>
			</div>
			{text && (
				<div className="col-8 flex justify-content-center align-items-center">
					<div className="text-center mg-auto">{text}</div>
				</div>
			)}
		</div>
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
