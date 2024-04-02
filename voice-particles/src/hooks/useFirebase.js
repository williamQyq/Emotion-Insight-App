import { getDocs, collection, addDoc } from "firebase/firestore";
import { useState, useCallback, useMemo } from "react";
import myFirestore from "../models/Firebase";

export function useFirebase() {
	const [voiceCollection, setVoiceCollection] = useState(
		collection(myFirestore, "Prompt"),
	);
	const getPrompts = useCallback(async () => {
		const querySnapshot = await getDocs(voiceCollection);
		const data = querySnapshot.docs.map((doc) => ({
			...doc.data(),
			id: doc.id,
		}));
		console.log("getPrompts: ", data);
		return data;
	}, [voiceCollection]);

	const addPrompt = useCallback(
		async (prompt) => {
			const docRef = await addDoc(voiceCollection, prompt);
			console.log("Document written with ID: ", docRef.id);
			return docRef.id;
		},
		[voiceCollection],
	);

	const storeManager = useMemo(
		() => ({
			collection,
			addPrompt,
			setVoiceCollection,
			getPrompts,
		}),
		[getPrompts, addPrompt, voiceCollection],
	);
	return storeManager;
}
