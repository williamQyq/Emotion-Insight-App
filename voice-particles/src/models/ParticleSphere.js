import * as THREE from "three";

export default class ParticleSphere {
	camera;
	scene;
	frameId;
	mountRef;
	clientWidth;
	clientHeight;
	mouseX = 0;
	mouseY = 0;

	constructor(mountRef, particleCount, particleColor = "#000000") {
		this.mountRef = mountRef;
		this.particleCount = particleCount; //default particle count
		this.particleColor = particleColor; //default color
		this.clientWidth = this.mountRef.current.parentElement.offsetWidth;
		this.clientHeight = this.mountRef.current.parentElement.offsetHeight;
	}

	init() {
		//Scene setup
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(
			75,
			this.clientWidth / this.clientHeight,
			0.1,
			1000,
		);

		this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
		this.renderer.setClearColor(0x000000, 0); //remove background

		this.renderer.setSize(this.clientWidth, this.clientHeight);
		this.mountRef.current.appendChild(this.renderer.domElement);

		this.addListener(); //add event listener : mouse move, resize
		this.initGeometry(); //init particle system
	}

	addListener() {
		// Mouse move event listener
		this.mountRef.current.addEventListener(
			"mousemove",
			(event) => {
				this.mouseX = event.clientX - this.clientWidth / 2;
				this.mouseY = event.clientY - this.clientHeight / 2;
			},
			false,
		);

		//resize event listener
		window.addEventListener(
			"resize",
			() => {
				this.clientWidth = this.mountRef.current.parentElement.offsetWidth;
				this.clientHeight = this.mountRef.current.parentElement.offsetHeight;

				console.log("window resize", this.clientWidth, this.clientHeight);
				this.camera.aspect = this.clientWidth / this.clientHeight;
				this.camera.updateProjectionMatrix();
				this.renderer.setSize(this.clientWidth, this.clientHeight);
				this.initGeometry();
			},
			false,
		);
	}

	initParticleSystem(particleCount, particleMaterial) {
		const particles = new THREE.BufferGeometry();
		const distance = Math.min(300, this.clientWidth / 7);
		const positions = new Float32Array(particleCount * 3);

		//particle sephere setup
		for (let i = 0; i < particleCount; i++) {
			const index = i * 3;
			let theta = THREE.MathUtils.randFloatSpread(360);
			let phi = THREE.MathUtils.randFloatSpread(360);

			positions[index] = distance * Math.sin(theta) * Math.cos(phi); // x
			positions[index + 1] = distance * Math.sin(theta) * Math.sin(phi); // y
			positions[index + 2] = distance * Math.cos(theta); // z
		}

		particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
		const particleSystem = new THREE.Points(particles, particleMaterial);
		return particleSystem;
	}

	initGeometry({ color = this.particleColor, num = this.particleCount } = {}) {
		// Clearing old scene
		while (this.scene.children.length > 0) {
			this.scene.remove(this.scene.children[0]);
		}
		// default particle material
		const particleMaterial = new THREE.PointsMaterial({
			color,
			size: 2,
		});
		const particleSystem = this.initParticleSystem(num, particleMaterial);

		// Particle defualt setup
		const particleSystemGroup = new THREE.Group();
		particleSystemGroup.add(particleSystem);

		this.scene.add(particleSystemGroup);
		// Camera position
		this.camera.position.z = 400;

		const renderingParent = new THREE.Group();
		const resizeContainer = new THREE.Group();

		renderingParent.add(particleSystemGroup);
		resizeContainer.add(renderingParent);
		this.scene.add(resizeContainer);

		//animation
		const animate = () => {
			this.frameId = requestAnimationFrame(animate);
			particleSystemGroup.children.forEach((particleSystem) => {
				particleSystem.rotation.x += 0.001;
				particleSystem.rotation.y += 0.001;
			});
			this.renderer.render(this.scene, this.camera);
		};
		animate();
	}
	dispose() {
		if (this.frameId) {
			cancelAnimationFrame(this.frameId);
		}
		if (this.renderer.domElement) {
			this.mountRef.current.removeChild(this.renderer.domElement);
		}
		window.removeEventListener("resize", this.handleResize);
		this.mountRef.current.removeEventListener("mousemove", this.onMouseMove);
	}
}
