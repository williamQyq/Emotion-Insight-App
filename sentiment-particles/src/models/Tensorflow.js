import * as tf from "@tensorflow/tfjs";

export class TF {
  constructor() {
    this.model = null;
    this.nlpWorker=new Worker(new URL("/src/models/nlpWorker.js",import.meta.url),{type:'module'});
  }
  async loadModel(modelPath) {
    if(modelPath === "") {
      console.log("Model path not set.");
      return;
    }
    this.model = await tf.loadGraphModel(modelPath);
  }

  /**
   * use the model to predict the input data, need to be converted to class index
   * @param {*} inputData
   * @returns
   */
  async predict(inputData) {
    if (!this.model) {
      console.log("Model not loaded.");
      return;
    }
    if (!this.nlpWorker) {
      alert("Web worker not supported.");
      return;
    }
    // Use worker to clean text
    return new Promise((resolve, reject) => {
      const preprocessHandler = (event) => {
        try{
        const cleanedInput = event.data.cleanedText; // Use cleaned text for prediction

        console.log("Cleaned text: ", cleanedInput);

        const prediction = this.model.predict(cleanedInput); 
        console.log("Prediction: ", prediction);
        resolve(prediction);
      }catch(error){
        console.error("Error in prediction: ", error);
        reject(error);
      }
    };
      this.nlpWorker.onmessage = preprocessHandler;
      this.nlpWorker.onerror = (event)=>reject(new Error(`Error in worker: ${event.message}`));
      this.nlpWorker.postMessage({ type: "cleanText", text: inputData });
    });
  }
}

export class EmotionTF extends TF {
  modelPath = "/src/assets/tfjs_classifier/model.json";
  constructor() {
    super();
    this.labels = ["anger", "fear", "joy", "love", "sadness", "surprise"];
  }

  /**
   * convert the prediction data to class index
   * @param {*} predictData
   * @returns
   */
  getPredictionClassIndex(predictData) {
    return predictData.argMax(1).dataSync();
  }
  /**
   * convert the class index to class name
   */
  getPredictClass(classIndex) {
    return this.labels[classIndex];
  }
}
