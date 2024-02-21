import * as THREE from "three";

export default class ParticlesSphere {
  camera;
  scene;
  frameId;
  mountRef;
  clientWidth;
  clientHeight;
  // mouseX = 0;
  // mouseY = 0;
  systemProps = []; //emotion particle system props {color, num, size}[]

  constructor(mountRef, particleCount = 1000, particleColor = "#000000") {
    this.mountRef = mountRef;
    this.particleCount = particleCount; //default particle count
    this.particleColor = particleColor; //default color
    this.clientWidth = this.mountRef.current.parentElement.offsetWidth;
    this.clientHeight = this.mountRef.current.parentElement.offsetHeight;
  }

  init(systemProps = undefined) {
    //update particle system props
    if (systemProps !== undefined && systemProps.length > 0) {
      this.systemProps = systemProps;
      this.particleCount = systemProps.reduce((accum, system) => accum + system.num, 0);
    }

    //Scene setup
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.clientWidth / this.clientHeight,
      0.1,
      1000
    );

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setClearColor(0x000000, 0); //remove background

    this.renderer.setSize(this.clientWidth, this.clientHeight);
    this.mountRef.current.appendChild(this.renderer.domElement);

    this.addListener(); //add event listener : mouse move, resize
    this.initGeometry();
  }

  addListener() {

    // Mouse move event listener
    this.mountRef.current.addEventListener(
      "mousemove",
      (event) => {
        this.mouseX = event.clientX - this.clientWidth / 2;
        this.mouseY = event.clientY - this.clientHeight / 2;
      },
      false
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
      false
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

  initDefaultParticlesSystem() {
    const particleMaterial = new THREE.PointsMaterial({
      color: this.particleColor,
      size: 2,
    });
    const particleSystem = this.initParticleSystem(this.particleCount, particleMaterial);
    //default position
    // particleSystem.position.set(0,0,0)
    return particleSystem;
  }

  initGeometry() {
    // Clearing old scene
    while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }
    // Particle defualt setup
    const particleSystemGroup = new THREE.Group();

    if (this.systemProps.length === 0) {
      console.log("No particle system props found, using default setup");
      const particleSystem = this.initDefaultParticlesSystem();
      particleSystemGroup.add(particleSystem);
    } else {
      this.systemProps.forEach((prop) => {
        const particleMaterial = new THREE.PointsMaterial({
          color: prop.color,
          size: prop.size,
        });
        const particleSystem = this.initParticleSystem(prop.num, particleMaterial);
        particleSystemGroup.add(particleSystem);
      });
    }
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
}