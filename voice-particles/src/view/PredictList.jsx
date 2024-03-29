import React from "react";
import PropTypes from "prop-types";

export default function PredictList({ prompts }) {
	return (
		prompts && (
			<ul className="list-group">
				{prompts.map((prompt, index) => (
					<li key={index} className="list-group-item">
						Sentiment: {prompt.predict}, Text: {prompt.prompt}
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
			predict: PropTypes.string,
		}),
	),
};
