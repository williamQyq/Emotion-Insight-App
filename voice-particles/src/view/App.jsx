import React, { useState, useCallback } from "react";
import UserInput from "./UserInput.jsx";
import "./App.css";
import Sphere from "./Sphere.jsx";
// import { EmotionTF } from "../models/Tensorflow.js";
import EmotionPrompt from "../models/Emotion.js";
import PredictList from "./PredictList.jsx";

export default function App() {
	const [prompts, setPrompts] = useState([]); //user prompts
	const [predicts, setPredicts] = useState({}); //predicts for the particle system
	// const tf = new EmotionTF();

	//get the predicts for particle system
	const getPredicts = useCallback(() => {
		const predicts = {};
		prompts.forEach((prompt) => {
			predicts[prompt.predict] = predicts[prompt.predict]
				? predicts[prompt.predict] + 1
				: 1;
		});
		return predicts;
	}, [prompts]);

	//update prompts
	const onUpdatePrompts = (prompt) => {
		setPrompts([...prompts, prompt]);
		setPredicts(getPredicts());
	};

	/**
	 * browser worker does not support stemmer and tokenizer, need backend server to handle this
	 * @param {*} input
	 * @returns
	 */
	// const getPrediction = async (input) => {
	// 	return new Promise((resolve, reject) => {
	// 		tf.predict(input)
	// 			.then((predictRaw) => this.tf.getPredictionClassIndex(predictRaw))
	// 			.then((classIndex) => this.tf.getPredictClass(classIndex))
	// 			.then((prediction) => {
	// 				console.log("Prediction is: ", prediction);
	// 				resolve(prediction);
	// 			});
	// 	});
	// };

	const onReceiveUserInput = async (userInput) => {
		//predict the sentiment
		// const predict = await getPrediction(userInput);
		// let prompt = new EmotionPrompt(userInput, predict);

		//pick a random emotion for the prompt
		let prompt = new EmotionPrompt(userInput);
		onUpdatePrompts(prompt);
		alert(
			`Sentiment Prediction is ${prompt.predict} for the prompt: ${prompt.prompt}`,
		);
	};
	return (
		<div>
			<section className="title">
				<div
					className="row sticky-top shadow-lg pd-top15 "
					style={{ paddingTop: "15px" }}
				>
					<h1>🧅For the Onion</h1>
				</div>
			</section>
			<section className="content">
				<div className="row" style={{ flex: 1, overflow: "auto" }}>
					<div className="col-12 d-flex justify-content-center">
						<UserInput onReceiveUserInput={onReceiveUserInput} />
					</div>
				</div>
				<div className="row" style={{ flex: 1 }}>
					<div className="col-12 d-flex justify-content-center">
						<Sphere predicts={predicts} />
					</div>
				</div>
				<div className="row">
					<div className="col-12 d-flex justify-content-center">
						<PredictList prompts={prompts} />
					</div>
				</div>
			</section>
		</div>
	);
}
