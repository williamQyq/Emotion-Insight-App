import { pipeline, env } from "@xenova/transformers";

env.allowLocalModels = false;

self.addEventListener("message", async (event) => {
	const message = event.data;
	console.log("Worker received message: ", message);

	const model = await pipeline("sentiment-analysis");

	// array of sentiment prediction {label, score}
	let out = await model(message.prompt);
	if (out.length > 0) {
		out = out[0];
	}

	self.postMessage({
		status: "complete",
		task: "sentiment-analysis",
		data: { ...out, promtp: message.prompt },
	});
});
