export default class EmotionPrompt {
	constructor(prompt, predict = null) {
		this.emo = new Emotion();
		this.prompt = prompt;

		//if no emotion is provided, randomly pick one
		if (predict === null) {
			this.predict = this.getRandomPrediction();
		} else {
			this.predict = predict;
		}
	}
	//randomly pick a sentiment class
	getRandomPrediction() {
		return this.emo.emotions[
			Math.floor(Math.random() * 10) % this.emo.emotions.length
		];
	}
}
export class Emotion {
	constructor() {
		this.emotions = [
			"anger",
			"fear",
			"joy",
			"love",
			"sadness",
			"surprise",
		];
		this.colors = {
			anger: "#FF0000",
			fear: "#0000FF",
			joy: "#FFFF00",
			love: "#FF00FF",
			sadness: "#00FFFF",
			surprise: "#00FF00",
		};
	}
	getEmotionColor(emo) {
		return this.colors[emo];
	}
}