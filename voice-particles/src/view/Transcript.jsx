import React from "react";
import PropTypes from "prop-types";

export default function Transcript({ transcribedData }) {
	return (
		<>
			{transcribedData?.chunks &&
				transcribedData.chunks.map((chunk, index) => {
					return (
						<div key={`${index}-${chunk.text}`}>
							<p>{chunk.text}</p>
						</div>
					);
				})}
		</>
	);
}

Transcript.propTypes = {
	transcribedData: PropTypes.shape({
		chunks: PropTypes.arrayOf(
			PropTypes.shape({
				text: PropTypes.string,
			}),
		),
	}),
};
