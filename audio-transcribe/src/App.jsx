import React, { useEffect, useState } from "react";
import UserInput from "./view/UserInput.jsx";
import ParticleSphere from "./view/ParticleSphere.jsx";
import EmotionPrompt from "./models/Emotion.js";
import PredictList from "./view/PredictList.jsx";
import AudioManager from "./view/AudioManager.jsx";
// import Transcript from "./view/Transcript.jsx";	//for debugging
import { useTranscriber } from "./hooks/useTranscriber.js";
import { useSentiment } from "./hooks/useSentiment.js";

export default function App() {
	const [prompts, setPrompts] = useState([]); //user prompts
	const [sentiment, setSentiment] = useState(null);
	const [prompt, setPrompt] = useState(null);

	const sentimenter = useSentiment();
	const transcriber = useTranscriber();

	const onReceiveUserInput = async (prompt) => {
		sentimenter.onInputChange();
		await sentimenter.start(prompt); //submit a worker task, unknonw finished time
		setPrompt(prompt);
	};

	//on receive sentiment result, update sentiment state
	useEffect(() => {
		if (sentimenter.sentiment) {
			console.log("sentiment: ", sentimenter.sentiment);
			const newPrompt = new EmotionPrompt(prompt, sentimenter.sentiment);
			setPrompts((prev) => [...prev, newPrompt]);
			setSentiment(sentimenter.sentiment);
		}
	}, [sentimenter.sentiment]);

	return (
		<div>
			<div className="nlp-analysis flex justify-content-center align-items-center">
				{prompts.length === 0 && <h1 className="text-center">🤫 My Whisper</h1>}
				<div className="row align-items-center">
					<div
						style={{ height: "100vh" }}
						className="col-6 flex justify-content-center align-items-center"
					>
						<ParticleSphere sentiment={sentiment} />
					</div>
					<div className="col-5 flex justify-content-center align-items-center">
						<UserInput
							transcribedData={transcriber.output}
							onReceiveUserInput={onReceiveUserInput}
						/>
						<AudioManager transcriber={transcriber} />
						{/* <Transcript transcribedData={transcriber.output} /> */}
						<PredictList prompts={prompts} />
					</div>
				</div>
			</div>
		</div>
	);
}
