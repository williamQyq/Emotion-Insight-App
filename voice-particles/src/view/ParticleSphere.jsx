import React, { useRef, useEffect, useState } from "react";
import ParticleSystem from "../models/ParticleSphere.js";
import PropTypes from "prop-types";

export default function ParticleSphere({ sentiment }) {
	const canvasRef = useRef(null);
	const [particleSystem, setParticleSystem] = useState(null);

	// Initialization of the ParticleSystem instance
	useEffect(() => {
		if (!canvasRef.current) return; // Ensure the ref is attached
		console.log("Initializing ParticleSystem...");
		const colorBlack = "#000000";
		const system = new ParticleSystem(canvasRef, 1000, colorBlack);
		system.init(); //scene setup
		setParticleSystem(system);

		// Ensure you return a cleanup function that checks if the system was initialized
		return () => {
			console.log("Cleaning up ParticleSystem...");
			system.dispose(); // Assuming there's a dispose method to clean up resources
		};
	}, []);

	// Initial different geometry depends on sentiment
	useEffect(() => {
		if (!particleSystem) return;
		console.log("Initializing geometry...");

		const colors = {
			positive: "#00FF00",
			negative: "#FF0000",
			neutral: "#808080",
		};

		const color = sentiment
			? colors[String(sentiment.label).toLocaleLowerCase()]
			: "#000000";
		particleSystem.initGeometry({
			color,
			num: 1000,
		});
	}, [particleSystem, sentiment]);
	return <div className="particle-system" ref={canvasRef} />;
}

ParticleSphere.propTypes = {
	sentiment: PropTypes.shape({
		label: PropTypes.string,
		score: PropTypes.number,
	}),
};
