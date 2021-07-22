import React from "react";
import "./styles.css";
import * as THREE from "three";

const SPEED = 10;

const randomHex = () =>
  "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0");

const init = () => {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    2000,
    window.innerWidth / window.innerHeight,
    1,
    2000
  );
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("container").appendChild(renderer.domElement);

  let gravity = new THREE.Mesh(
    new THREE.CircleGeometry(5, 32),
    new THREE.MeshBasicMaterial({ color: randomHex() })
  );

  scene.add(gravity);

  let particles = [];

  for (let i = 0; i < 5; i++) {
    const particle = new THREE.Mesh(
      new THREE.CircleGeometry(Math.random() + 0.5, 32),
      new THREE.MeshBasicMaterial({
        color: randomHex()
      })
    );

    particle.position.set(Math.random() + 0.5, Math.random() + 0.5);

    scene.add(particle);

    particles.push({
      particle,
      velocity: {
        x: Math.floor(Math.random() * 4 - 4),
        y: Math.floor(Math.random() * 4 - 4)
      }
    });
  }

  const animate = () => {
    requestAnimationFrame(animate);

    particles.forEach(({ particle, velocity }) => {
      const f =
        1 /
        Math.sqrt(
          Math.pow(particle.position.x - gravity.position.x, 2) +
            Math.pow(particle.position.y - gravity.position.y, 2)
        );

      velocity.x += ((particle.position.x - gravity.position.x) * f) / SPEED;
      velocity.y += ((particle.position.y - gravity.position.y) * f) / SPEED;

      particle.position.x -= velocity.x;
      particle.position.y -= velocity.y;
    });
    renderer.render(scene, camera);
  };
  animate();
};

export default function App() {
  React.useEffect(init, []);
  return (
    <div className="App">
      <div id="container"></div>
    </div>
  );
}
