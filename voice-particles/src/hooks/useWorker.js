import { useState } from "react";

export function useWorker(path, messageEventHandler) {
	const [worker] = useState(() => createWorker(path, messageEventHandler));
	return worker;
}

function createWorker(path, messageEventHandler) {
	const worker = new Worker(path, { type: "module" });
	worker.onmessage = messageEventHandler;
	return worker;
}
