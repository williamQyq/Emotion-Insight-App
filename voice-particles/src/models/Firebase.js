// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

function MyFireBase() {
	// TODO: Add SDKs for Firebase products that you want to use
	// https://firebase.google.com/docs/web/setup#available-libraries

	// Your web app's Firebase configuration
	// For Firebase JS SDK v7.20.0 and later, measurementId is optional
	const firebaseConfig = {
		apiKey: "AIzaSyBoF-bvdfEXC6vegA_PgATtpqNWTZWoPXI",
		authDomain: "voice-prompt-store.firebaseapp.com",
		projectId: "voice-prompt-store",
		storageBucket: "voice-prompt-store.appspot.com",
		messagingSenderId: "1005566368143",
		appId: "1:1005566368143:web:3ccd0588529692013553fa",
	};

	// Initialize Firebase
	const app = initializeApp(firebaseConfig);
	// const analytics = getAnalytics(app);
	const firestore = getFirestore(app);

	return firestore;
}

const myFirestore = MyFireBase();

export default myFirestore;
