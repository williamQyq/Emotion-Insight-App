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
