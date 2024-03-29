import React, { useRef, useEffect, useState } from "react";
import ParticlesSphere from "../models/ParticlesSphere.js";
import { Emotion } from "../models/Emotion.js";
import PropTypes from "prop-types";

export default function Sphere({ predicts }) {
	const canvasRef = useRef(null);
	const [particleSystem, setParticleSystem] = useState(null);

	useEffect(() => {
		const particleSystem = new ParticlesSphere(canvasRef, 1000, "#000000");
		particleSystem.init();
		setParticleSystem(particleSystem);
		//clean up
		return () => {
			const { frameId } = particleSystem;
			if (frameId) {
				cancelAnimationFrame(frameId);
			}
			canvasRef.current.removeChild(particleSystem.renderer.domElement);
			window.removeEventListener("resize", particleSystem.handleResize);
		};
	}, []);

	useEffect(() => {
		//update the particle system on predicts change
		const reCreateParticleSystem = (predicts) => {
			if (canvasRef.current == null || particleSystem == null) return;
			//remove the old particle system
			canvasRef.current.removeChild(particleSystem.renderer.domElement);
			const totalNumEmotions = Object.values(predicts).reduce(
				(accum, value) => accum + value,
			);
			const emotionManager = new Emotion();
			//create a new particle system
			const systemProps = Object.keys(predicts).map((emo) => {
				const color = emotionManager.getEmotionColor(emo);
				const emoCount = predicts[emo];
				const emoParticleProps = {
					color,
					num: Math.round((emoCount / totalNumEmotions) * 1000),
					size: 2,
				};

				return emoParticleProps;
			});

			particleSystem.init(systemProps);
		};

		//update the particle system
		reCreateParticleSystem(predicts);
	}, [predicts]);

	return <div style={{ height: "70vh" }} ref={canvasRef} />;
}

Sphere.propTypes = {
	predicts: PropTypes.object.isRequired,
};
