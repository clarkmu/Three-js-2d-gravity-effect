import React from "react";
import "./styles.css";
import * as THREE from "three";
import { useState, useRef, useEffect } from "react";

const randomHex = () =>
  "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0");

const init = (
  container,
  scene,
  renderer,
  camera,
  speed,
  gravityCount,
  particleCount
) => {
  renderer.setSize(window.innerWidth, window.innerHeight);

  let gravities = [];

  for (let i = 0; i < gravityCount; i++) {
    const gravity = new THREE.Mesh(
      new THREE.CircleGeometry(5, 32),
      new THREE.MeshBasicMaterial({ color: randomHex() })
    );

    const x = Math.random() * 30 - 15;
    const y = Math.random() * 30 - 15;

    gravity.position.set(x, y);

    scene.add(gravity);

    gravities.push({
      gravity,
      position: {
        x,
        y,
      },
    });
  }

  let particles = [];

  for (let i = 0; i < particleCount; i++) {
    const particle = new THREE.Mesh(
      new THREE.CircleGeometry(Math.random() + 0.5, 32),
      new THREE.MeshBasicMaterial({
        color: randomHex(),
      })
    );

    particle.position.set(Math.random() + 0.2, Math.random() + 0.2);

    scene.add(particle);

    particles.push({
      particle,
      velocity: {
        x: Math.floor(Math.random() * 4 - 4),
        y: Math.floor(Math.random() * 4 - 4),
      },
    });
  }

  const animate = () => {
    setTimeout(() => requestAnimationFrame(animate), speed);

    gravities.forEach((gravity) => {
      particles.forEach(({ particle, velocity }) => {
        const f =
          1 /
          Math.sqrt(
            Math.pow(particle.position.x - gravity.position.x, 2) +
              Math.pow(particle.position.y - gravity.position.y, 2)
          );

        velocity.x += (particle.position.x - gravity.position.x) * f;
        velocity.y += (particle.position.y - gravity.position.y) * f;

        particle.position.x -= velocity.x;
        particle.position.y -= velocity.y;
      });
    });

    renderer.render(scene, camera);
  };
  animate();
};

export default function App() {
  const ref = useRef(null);
  const [gravity, setGravity] = useState(2);
  const [particles, setParticles] = useState(5);
  const [scene] = useState(new THREE.Scene());
  const [renderer] = useState(new THREE.WebGLRenderer());
  const [camera, setCamera] = useState(
    new THREE.PerspectiveCamera(
      2000,
      window.innerWidth / window.innerHeight,
      1,
      2000
    )
  );
  const [speed, setSpeed] = useState(50);
  const [zoom, setZoom] = useState(5);

  const doInit = () => {
    if (scene.children.length) {
      //scene has been set, reset it
      while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
      }
    } else {
      //first go
      container.appendChild(renderer.domElement);
    }
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.position.z = zoom;
    init(ref?.current, scene, renderer, camera, speed, gravity, particles);
  };

  useEffect(doInit, [gravity, particles, speed, zoom]);

  useEffect(() => {
    window.addEventListener("resize", doInit);
    return () => window.removeEventListener("resize", doInit);
  }, []);

  return (
    <div className="App">
      <div id="container" style={{ position: "relative" }} ref={ref}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignItems: "end",
            margin: "1rem",
            background: "rgba(255,255,255,0.3)",
            borderRadius: "10px",
            padding: "1rem",
          }}
        >
          <div>
            <label
              htmlFor="sources"
              style={{ color: "white", marginRight: "1rem" }}
            >
              # of Gravity Sources
            </label>
            <input
              min="1"
              type="number"
              id="sources"
              style={{ width: "5ch" }}
              value={gravity}
              onChange={(e) => setGravity(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="particles"
              style={{ color: "white", marginRight: "1rem" }}
            >
              # of Particles
            </label>
            <input
              min="1"
              type="number"
              id="particles"
              style={{ width: "5ch" }}
              value={particles}
              onChange={(e) => setParticles(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="speed"
              style={{ color: "white", marginRight: "1rem" }}
            >
              Speed (ms)
            </label>
            <input
              min="1"
              type="number"
              id="speed"
              style={{ width: "5ch" }}
              value={speed}
              onChange={(e) => setSpeed(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="zoom"
              style={{ color: "white", marginRight: "1rem" }}
            >
              Zoom In/Out
            </label>
            <input
              min="1"
              type="number"
              id="zoom"
              style={{ width: "5ch" }}
              value={zoom}
              onChange={(e) => setZoom(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
