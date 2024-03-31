import { useState } from "react";

export function useWorker(messageEventHandler) {
	const [worker] = useState(() => createWorker(messageEventHandler));
	return worker;
}

function createWorker(messageEventHandler) {
	const worker = new Worker("./src/worker.js",{type:"module"});
	worker.onmessage=messageEventHandler;
	return worker;
}
