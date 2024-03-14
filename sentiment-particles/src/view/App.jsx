import React, { Component } from "react";
import UserInput from "./UserInput.jsx";
import "./App.css";
import Sphere from "./Sphere.jsx";
import { EmotionTF } from "../models/Tensorflow.js";
import EmotionPrompt from "../models/EmotionPrompt.js";
import PredictList from "./PredictList.jsx";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      predicts: {}, //user sentiment prediction
      prompts: [], //user prompts
    };
    this.tf = null;
    this.emotionClasses = [
      "anger",
      "fear",
      "joy",
      "love",
      "sadness",
      "surprise",
    ];
  }
  componentDidMount() {
    // this.tf = new EmotionTF();
    // this.tf.loadModel(this.tf.modelPath);
  }

  /**
   * Increment the sentiment prediction count
   * @param {string} input //Text input from user
   */
  addSentiPredictFromUser = (input) => {
    //randomly pick a sentiment class
    const pick =
      this.emotionClasses[
        Math.floor(Math.random() * this.emotionClasses.length)
      ];

    let prompt = new EmotionPrompt(pick, input);

    //update predict based on user input
    const updatedPredicts = { ...this.state.predicts };
    updatedPredicts[pick] = updatedPredicts[pick]
      ? updatedPredicts[pick] + 1
      : 1;

    this.setState({
      predicts: updatedPredicts,
      prompts: [...this.state.prompts, prompt],
    });
    alert(`Sentiment Prediction is ${pick}`);

    /**
     * browser worker does not support stemmer and tokenizer, need backend server to handle this
     */
    // this.tf
    //   .predict(input)
    //   .then((predictRaw) => this.tf.getPredictionClassIndex(predictRaw))
    //   .then((classIndex) => this.tf.getPredictClass(classIndex))
    //   .then((predictionClass) => {
    //     console.log("Prediction class: ", predictionClass);
    //     let predictCnt = this.state.predicts[predictionClass] || 0;
    //     this.setState({
    //       predicts: {
    //         predictionClass: predictCnt + 1,
    //         ...this.state.predicts,
    //       },
    //     });
    //   });
  };

  render() {
    return (
      <div>
        <div
          className="row sticky-top shadow-lg"
          style={{ paddingTop: "15px" }}
        >
          <h1>🧑🏻‍💻GrrMLP</h1>
        </div>
        <div className="row" style={{ flex: 1, overflow: "auto" }}>
          <div className="col-12 d-flex justify-content-center">
            <UserInput addSentiPredictFromUser={this.addSentiPredictFromUser} />
          </div>
        </div>
        <div className="row" style={{ flex: 1 }}>
          <div className="col-12 d-flex justify-content-center">
            <Sphere
              predicts={this.state.predicts}
              emotionClasses={this.emotionClasses}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-12 d-flex justify-content-center">
            <PredictList prompts={this.state.prompts} />
          </div>
        </div>
      </div>
    );
  }
}
