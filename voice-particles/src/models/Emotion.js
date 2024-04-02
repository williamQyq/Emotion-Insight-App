export default class EmotionPrompt {
	constructor(prompt, predict = null) {
		this.prompt = prompt;

		//if no emotion is provided, randomly pick one
		if (predict === null) {
			this.predict = this.getRandomPrediction();
		} else {
			this.label = predict.lable;
			this.score = predict.score;
		}
	}
	//randomly pick a sentiment class
	getRandomPrediction() {
		return emotions[Math.floor(Math.random() * 10) % emotions.length];
	}
}

export const emotions = ["anger", "fear", "joy", "love", "sadness", "surprise"];
export const colors = {
	anger: "#FF0000",
	fear: "#0000FF",
	joy: "#FFFF00",
	love: "#FF00FF",
	sadness: "#00FFFF",
	surprise: "#00FF00",
};
