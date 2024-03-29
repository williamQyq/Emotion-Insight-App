import React from "react";
import PropTypes from "prop-types";

export default function Transcript({ transcribedData }) {
	return (
		<div>
			{transcribedData &&
				transcribedData.chunks &&
				transcribedData.chunks.map((chunk, index) => {
					console.log("transcribed Text: ", chunk.text);
					return (
						<div key={`${index}-${chunk.text}`}>
							<p>{chunk.text}</p>
						</div>
					);
				})}
		</div>
	);
}

Transcript.propTypes = {
	transcribedData: PropTypes.object,
};
