// Options
let numParticles = 2000;

// Setup canvas + WebGL
const canvas = document.getElementById("simCanvas");
const gl = canvas.getContext("webgl", {
  alpha: true,
  antialias: false,
  premultipliedAlpha: false
});

if (!gl) {
  throw new Error("WebGL not supported in this browser.");
}

function resizeCanvasToDisplaySize() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
}

resizeCanvasToDisplaySize();

// Setup simulation
let simulator = new Simulator(window.innerWidth, window.innerHeight, numParticles);
simulator.running = true;

const fpsMonitor = new FPSMonitor();
const renderer = new MetaballsRenderer(gl, canvas);

// GPU buffers for particle data
let positionBuffer = gl.createBuffer();
let materialBuffer = gl.createBuffer();

// Optional external background texture hook
// Leave null for solid black fallback inside MetaballsRenderer
let externalBackgroundTexture = null;

function hexToRgb01(hex) {
  const clean = hex.replace("#", "");
  const value = parseInt(clean, 16);

  return new Float32Array([
    ((value >> 16) & 255) / 255,
    ((value >> 8) & 255) / 255,
    (value & 255) / 255
  ]);
}

function getMaterialColors() {
  const colors = [];

  for (let i = 0; i < 4; i++) {
    const mat = simulator.materials[i];
    colors.push(hexToRgb01(mat ? mat.color : "#ffffff"));
  }

  return colors;
}

function uploadParticleBuffers() {
  const count = simulator.particles.length;
  const positions = new Float32Array(count * 2);
  const materials = new Uint8Array(count);

  for (let i = 0; i < count; i++) {
    const p = simulator.particles[i];
    positions[i * 2] = p.posX;
    positions[i * 2 + 1] = p.posY;
    materials[i] = p.materialId;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, materialBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, materials, gl.DYNAMIC_DRAW);
}

function applyAllControlsToSimulator() {
  const sliderIds = [
    "restDensity",
    "stiffness",
    "nearStiffness",
    "springStiffness",
    "plasticity",
    "yieldRatio",
    "minDistRatio",
    "linViscosity",
    "quadViscosity",
    "kernelRadius",
    "pointSize",
    "gravX",
    "gravY",
    "dt",
    "attractSame",
    "attractDifferent",
    "stepsPerFrame"
  ];

  for (let id of sliderIds) {
    const el = document.getElementById(id);
    if (!el) {
      continue;
    }

    const value = parseFloat(el.value);

    if (id === "attractSame") {
      simulator.attractSame = value;
    } else if (id === "attractDifferent") {
      simulator.attractDifferent = value;
    } else if (id === "stepsPerFrame") {
      simulator.stepsPerFrame = Math.max(1, Math.round(value));
    } else {
      simulator.material[id] = value;
    }
  }

  const emitMaterial = document.getElementById("emitMaterial");
  if (emitMaterial) {
    simulator.emitMaterialId = parseInt(emitMaterial.value, 10) || 0;
  }

  const colorIds = ["color0", "color1", "color2", "color3"];
  for (let i = 0; i < colorIds.length; i++) {
    const el = document.getElementById(colorIds[i]);
    if (el && simulator.materials[i]) {
      simulator.materials[i].color = el.value;
    }
  }

  const massIds = ["mass0", "mass1", "mass2", "mass3"];
  for (let i = 0; i < massIds.length; i++) {
    const el = document.getElementById(massIds[i]);
    if (el && simulator.materials[i]) {
      simulator.materials[i].mass = parseFloat(el.value);
    }
  }
}

function stepSimulation() {
  const steps = Math.max(1, simulator.stepsPerFrame || 1);

  for (let i = 0; i < steps; i++) {
    simulator.update();
  }
}

function renderFrame() {
  uploadParticleBuffers();

  const colors = getMaterialColors();

  // Visual blob size only
  const metaballPointSize = simulator.material.pointSize * 8.0;

  renderer.beginMetaballsRender(metaballPointSize);
  renderer.renderMetaballsBatch(positionBuffer, materialBuffer, simulator.particles.length);
  renderer.endMetaballsRender();

  renderer.applyBlur();

  renderer.render({
    colors,
    backgroundTexture: externalBackgroundTexture,
    threshold: 0.22,
    refractionStrength: 0.028,
    chromaticAberration: 0.0025,
    lightIntensity: 2.0,
    absorption: 0.8,
    materialMode: "water"
  });
}

function loop() {
  stepSimulation();
  fpsMonitor.update();
  renderFrame();
  requestAnimationFrame(loop);
}

applyAllControlsToSimulator();
loop();

const materialSliders = [
  "restDensity",
  "stiffness",
  "nearStiffness",
  "springStiffness",
  "plasticity",
  "yieldRatio",
  "minDistRatio",
  "linViscosity",
  "quadViscosity",
  "kernelRadius",
  "pointSize",
  "gravX",
  "gravY",
  "dt",
  "attractSame",
  "attractDifferent",
  "stepsPerFrame"
];

for (let sliderId of materialSliders) {
  const slider = document.getElementById(sliderId);

  if (!slider) {
    continue;
  }

  slider.addEventListener("input", (e) => {
    const value = parseFloat(e.target.value);

    if (sliderId === "attractSame") {
      simulator.attractSame = value;
    } else if (sliderId === "attractDifferent") {
      simulator.attractDifferent = value;
    } else if (sliderId === "stepsPerFrame") {
      simulator.stepsPerFrame = Math.max(1, Math.round(value));
    } else {
      simulator.material[sliderId] = value;
    }
  });
}

document.getElementById("startButton").addEventListener("click", () => {
  applyAllControlsToSimulator();
  simulator.start();
});

document.getElementById("pauseButton").addEventListener("click", () => {
  simulator.pause();
});

document.getElementById("stepButton").addEventListener("click", () => {
  applyAllControlsToSimulator();
  simulator.running = true;
  stepSimulation();
  simulator.running = false;
  renderFrame();
});

document.getElementById("resetButton").addEventListener("click", () => {
  simulator = new Simulator(window.innerWidth, window.innerHeight, numParticles);
  applyAllControlsToSimulator();
});

const collapseButton = document.getElementById("collapseButton");

if (collapseButton) {
  collapseButton.addEventListener("click", () => {
    const controls = document.getElementById("controls");

    if (controls.style.display === "none") {
      controls.style.display = "block";
      collapseButton.innerText = "Collapse";
    } else {
      controls.style.display = "none";
      collapseButton.innerText = "Expand";
    }
  });
}

document.getElementById("numParticles").addEventListener("input", (e) => {
  const newCount = parseInt(e.target.value, 10);

  if (newCount === numParticles) {
    return;
  }

  numParticles = newCount;
  simulator = new Simulator(window.innerWidth, window.innerHeight, numParticles);
  applyAllControlsToSimulator();
});

const emitMaterial = document.getElementById("emitMaterial");
if (emitMaterial) {
  emitMaterial.addEventListener("input", (e) => {
    simulator.emitMaterialId = parseInt(e.target.value, 10) || 0;
  });
}

const colorIds = ["color0", "color1", "color2", "color3"];
for (let i = 0; i < colorIds.length; i++) {
  const el = document.getElementById(colorIds[i]);
  if (!el) {
    continue;
  }

  el.addEventListener("input", (e) => {
    if (simulator.materials[i]) {
      simulator.materials[i].color = e.target.value;
    }
  });
}

const massIds = ["mass0", "mass1", "mass2", "mass3"];
for (let i = 0; i < massIds.length; i++) {
  const el = document.getElementById(massIds[i]);
  if (!el) {
    continue;
  }

  el.addEventListener("input", (e) => {
    if (simulator.materials[i]) {
      simulator.materials[i].mass = parseFloat(e.target.value);
    }
  });
}

{
  const useSpatialHash = document.getElementById("useSpatialHash");

  if (useSpatialHash) {
    useSpatialHash.addEventListener("change", (e) => {
      simulator.useSpatialHash = e.target.checked;
    });
  }
}

window.addEventListener("resize", () => {
  resizeCanvasToDisplaySize();
  simulator.resize(window.innerWidth, window.innerHeight);
  renderer.resize(canvas.width, canvas.height);
});

window.addEventListener("pointermove", (e) => {
  simulator.mouseX = e.clientX;
  simulator.mouseY = e.clientY;
});

window.addEventListener("pointerdown", (e) => {
  simulator.mouseX = e.clientX;
  simulator.mouseY = e.clientY;
  simulator.mousePrevX = e.clientX;
  simulator.mousePrevY = e.clientY;
});

window.addEventListener("pointerup", () => {
});

const actionKeys = { e: "emit", d: "drain", a: "attract", r: "repel" };

window.addEventListener("keydown", (e) => {
  if (actionKeys[e.key]) {
    simulator[actionKeys[e.key]] = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (actionKeys[e.key]) {
    simulator[actionKeys[e.key]] = false;
  }
});

window.addEventListener("blur", () => {
  for (let key in actionKeys) {
    simulator[actionKeys[key]] = false;
  }
});

// Optional helper for a future separate background script
window.setMetaballsBackgroundTexture = function (texture) {
  externalBackgroundTexture = texture;
};