import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import EmotionPrompt from "../models/Emotion.js";
import { useFirebase } from "../hooks/useFirebase.js";

export default function PredictList({ prompts }) {
	const [voicePrompts, setPrompts] = useState(prompts);
	const db = useFirebase();

	const refreshPrompts = async () => {
		const voicePrompts = await db.getPrompts();
		setPrompts([...voicePrompts, ...prompts]);
	};

	useEffect(() => {
		refreshPrompts();
	}, [prompts]);

	// useEffect(() => {
	// 	if (sentiment && prompt) {
	// 		// Create a new EmotionPrompt for comparison
	// 		const newPrompt = new EmotionPrompt(prompt, sentiment);

	// 		// Check if the new prompt is different from the last prompt added
	// 		if (
	// 			prompts.length === 0 ||
	// 			!arePromptsEqual(prompts[prompts.length - 1], newPrompt)
	// 		) {
	// 			setPrompts((prev) => [...prev, newPrompt]);
	// 		}
	// 	}
	// }, [sentiment, prompt]);

	// const arePromptsEqual = (lastPrompt, newPrompt) => {
	// 	return (
	// 		lastPrompt.prompt === newPrompt.prompt &&
	// 		lastPrompt.label === newPrompt.label
	// 	);
	// };

	return (
		voicePrompts.length > 0 && (
			<ul className="list-group">
				{voicePrompts.map((prompt, index) => (
					<li key={index} className="list-group-item">
						<div>
							<p className="fw-bold mr-4">Sentiment: {prompt.label}</p>
							<p className="score">Score: {prompt.score}</p>
						</div>
						{prompt.prompt}
					</li>
				))}
			</ul>
		)
	);
}

PredictList.propTypes = {
	prompts: PropTypes.arrayOf(
		PropTypes.shape({
			prompt: PropTypes.string,
			predict: PropTypes.shape({
				label: PropTypes.string,
				score: PropTypes.number,
			}),
		}),
	),
};
