import { useState } from "react";

export function useWorker(messageEventHandler) {
	const [worker] = useState(() => createWorker(messageEventHandler));
	return worker;
}

function createWorker(messageEventHandler) {
	const worker = new Worker(new URL("../worker.js", import.meta.url), {
		type: "module",
	});
	worker.addEventListener("message",messageEventHandler);
	return worker;
}
