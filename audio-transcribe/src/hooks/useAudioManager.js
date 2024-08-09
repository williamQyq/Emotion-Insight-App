import { useCallback, useMemo, useRef, useState } from "react";
import Constants from "../utils/Constants.js";
import { webmFixDuration } from "../utils/BlobFix.js";

export default function useAudioManager() {
	const [audioData, setAudioData] = useState(undefined);
	const [progress, setProgress] = useState(undefined);
	const [isRecording, setIsRecording] = useState(false);
	const [recordedBlob, setRecordedBlob] = useState(null); //audio download blob
    
	const streamRef = useRef(null);
	const mediaRecorderRef = useRef(null);
	const chunksRef = useRef([]);

	//check for supported mime type
	const getMimeType=()=> {
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
	};

	//reset audio data
	const resetAudio = () => {
		setAudioData(undefined);
	};
    
	//check if audio is not silence
	const isSampledAudio = useCallback((buffer) => {
		for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
			const samples = buffer.getChannelData(channel);
			for (let i = 0; i < samples.length; i++) {
				if (samples[i] !== 0) return true;
			}
		}
		return false;
	}, []);
    
	//decode audio and set audio data
	const setAudioFromRecording = useCallback(async (data) => {
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

			setProgress(undefined);

			// Check if audio is complete silence
			const audioIsSilence = !isSampledAudio(decoded);
			if (audioIsSilence) {
				console.log("Audio is complete silence.");
				return;
			}
			setAudioData({
				buffer: decoded,
				url: blobUrl,
				source: "RECORDING",
				mimeType: data.type,
			});
		};
		fileReader.readAsArrayBuffer(data);
	}, [isSampledAudio]);
    
	//on recording complete
	const onRecordingComplete = useCallback((blob) => {
		console.log("Recording complete: ", !!blob);
		setAudioFromRecording(blob);
		setIsRecording(false);
	}, [setAudioData, setIsRecording]);

	//start recording
	const startRecording = useCallback(async () => {
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
			setIsRecording(true);
		} catch (error) {
			console.error("Error starting recording: ", error);
		}
	}, [onRecordingComplete, setIsRecording, setRecordedBlob]);

	const stopRecording = useCallback(() => {
		if (
			mediaRecorderRef.current &&
			mediaRecorderRef.current.state == "recording"
		) {
			mediaRecorderRef.current.stop();
			// setDuration(0);
			setIsRecording(false);
		}
	}, [setIsRecording, mediaRecorderRef.current]);
    
    	

	const formatAudioTimestamp = useCallback((time) => {
		const padTime = (time) => {
			return String(time).padStart(2, "0");
		};
		const hours = (time / (60 * 60)) | 0;
		time -= hours * (60 * 60);
		const minutes = (time / 60) | 0;
		time -= minutes * 60;
		const seconds = time | 0;
		return `${hours ? padTime(hours) + ":" : ""}${padTime(minutes)}:${padTime(
			seconds,
		)}`;
	},[]);

	const manager = useMemo(() => {
		return {
			audioData,
			progress,
			isAudioLoading: progress !== undefined,
			isRecording,
			recordedBlob,
			resetAudio,
			setAudioData,
			setIsRecording,
			setAudioFromRecording,
			startRecording,
			stopRecording,
			formatAudioTimestamp
		};
	}, [
		audioData,
		progress,
		isRecording,
		recordedBlob,
		resetAudio,
		setAudioData,
		setIsRecording,
		setAudioFromRecording,
		startRecording,
		stopRecording]);
	return manager;
}
