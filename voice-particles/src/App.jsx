import React, { useState } from "react";
import UserInput from "./view/UserInput.jsx";
import Sphere from "./view/Sphere.jsx";
import EmotionPrompt from "./models/Emotion.js";
import PredictList from "./view/PredictList.jsx";
import AudioManager from "./view/AudioManager.jsx";
import Transcript from "./view/Transcript.jsx";
import { useTranscriber } from "./hooks/useTranscriber.js";

export default function App() {
	const [prompts, setPrompts] = useState([]); //user prompts
	const [predicts, setPredicts] = useState({}); //predicts for the particle system

	const transcriber = useTranscriber();
	//get the predicts for particle system
	const getPredicts = () => {
		const predicts = {};
		prompts.forEach((prompt) => {
			predicts[prompt.predict] = predicts[prompt.predict]
				? predicts[prompt.predict] + 1
				: 1;
		});
		return predicts;
	};

	const onReceiveUserInput = async (userInput) => {
		//pick a random emotion for the prompt
		let prompt = new EmotionPrompt(userInput);
		console.log("Prompt and sentiment are: ", prompt);
		setPrompts([...prompts, prompt]);
		setPredicts(getPredicts());
		alert(
			`Sentiment Prediction is ${prompt.predict} for the prompt: ${prompt.prompt}`,
		);
	};
	return (
		<div>
			<div className="header row text-center sticky-top shadow-lg p-15 bg-white">
				<h1>🤫 My Whisper</h1>
			</div>
			<div className="nlp-analysis">
				<div className="row align-items-center">
					<div
						style={{ height: "100vh" }}
						className="col-6 flex justify-content-center align-items-center"
					>
						<Sphere predicts={predicts} />
					</div>
					<div className="col-5 flex justify-content-center align-items-center">
						<UserInput
							transcribedData={transcriber.output}
							onReceiveUserInput={onReceiveUserInput}
						/>
						<AudioManager transcriber={transcriber} />
						{/* <Transcript transcribedData={transcriber.output} /> */}
					</div>
				</div>
				<div className="row">
					<div className="col-12 d-flex justify-content-center align-items-center">
						<PredictList prompts={prompts} />
					</div>
				</div>
			</div>
		</div>
	);
}
