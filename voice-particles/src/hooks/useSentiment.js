import { useState, useMemo, useCallback } from "react";
import { useWorker } from "./useWorker";

export function useSentiment() {
	const [sentiment, setSentiment] = useState(null);
	const webWorker = useWorker("src/sentiment.worker.js", (event) => {
		const message = event.data;
		switch (message.status) {
			case "complete":
				console.log("message from useSentiment: ", message);
				setSentiment(message.data);
				break;
			case "error":
				console.error("error", message);
				break;
		}
	});

	const postRequest = useCallback(
		async (prompt) => {
			webWorker.postMessage({
				prompt,
			});
		},
		[webWorker],
	);

	const onInputChange = useCallback(() => {
		setSentiment(null);
	}, []);

	return useMemo(() => {
		return {
			sentiment,
			start: postRequest,
			onInputChange,
		};
	}, [sentiment, postRequest, useWorker, onInputChange]);
}
