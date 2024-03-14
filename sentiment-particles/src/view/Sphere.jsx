import React, { Component } from "react";
import ParticlesSphere from "../models/ParticlesSphere.js";

export default class Sphere extends Component {
  constructor(props) {
    super(props);
    this.mountRef = React.createRef();
    this.state = {};
    this.emoColors = {
      anger: "#FF0000",
      fear: "#0000FF",
      joy: "#FFFF00",
      love: "#FF00FF",
      sadness: "#00FFFF",
      surprise: "#00FF00",
    };
  }

  componentDidMount() {
    this.particleSystem = new ParticlesSphere(this.mountRef, 1000, "#000000");
    this.particleSystem.init();
  }

  componentDidUpdate(prevProps) {
    // Check if particleCount or particleColor props have changed
    if (prevProps.predicts !== this.props.predicts) {
      this.mountRef.current.removeChild(
        this.particleSystem.renderer.domElement
      );
      const { predicts } = this.props;

      const totalNumEmotions = Object.values(predicts).reduce(
        (accum, value) => accum + value
      );

      //recolor the particles based on the new prediction
      const systemProps = Object.keys(predicts).map((emo) => ({
        color: this.emoColors[emo],
        num: Math.round((predicts[emo] / totalNumEmotions) * 1000),
        size: 2,
      }));
      //Update the particle system
      this.particleSystem.init(systemProps);
    }
  }

  componentWillUnmount() {
    // Stop the animation frame and remove the renderer
    const { frameId } = this.particleSystem;
    if (frameId) {
      cancelAnimationFrame(frameId);
    }
    this.mountRef.current.removeChild(this.particleSystem.renderer.domElement);
    window.removeEventListener("resize", this.particleSystem.handleResize);
  }

  render() {
    return <div style={{ height: "70vh" }} ref={this.mountRef} />;
  }
}
