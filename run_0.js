
// Options
let numParticles = 2200;

const portfolioProjects = {
  shroomfall: {
    label: "Original Game",
    title: "Shroomfall",
    subtitle: "A multiplayer active-ragdoll platformer built around expressive movement, physics-driven interaction, networking, and playful chaos.",
    summary: "Shroomfall is my main original game project. The goal is to make physics-heavy gameplay feel expressive without becoming unreadable. A lot of the work is in turning unstable simulation into movement and interactions that still feel intentional, responsive, and funny in a good way.",
    role: "Gameplay Programmer",
    type: "Original Project",
    focus: [
      "Movement and player feel",
      "Active ragdoll behavior",
      "Networked gameplay systems",
      "Physics interaction and readability"
    ],
    tech: [
      "Unity",
      "Fusion networking",
      "Host-authoritative gameplay",
      "Physics-driven gameplay",
      "Animation tuning and systems iteration"
    ],
    work: [
      "Built and tuned multiplayer movement systems with a focus on readable physics and expressive control.",
      "Implemented active ragdoll behavior and proxy playback so characters stay playful without losing responsiveness.",
      "Iterated on jumping, grounding, and in-air stiffness to improve feel while respecting network authority.",
      "Designed systemic interactions that create emergent moments instead of relying only on scripted sequences."
    ],
    deepDives: [
      {
        title: "Networking and active ragdoll architecture",
        body: "This section is meant for a deeper explanation of how you structured authority, synchronized bones, and handled proxy playback. Add screenshots, gifs, or diagrams showing the local player, host simulation, and remote proxy interpolation."
      },
      {
        title: "Movement tuning and player feel",
        body: "Use this dropdown to explain the tuning process for jump timing, coyote time, sprinting, air control, and how you balanced responsiveness against the chaos of a physics-based character."
      },
      {
        title: "Environmental interaction and systemic design",
        body: "This section can break down an interaction set such as grabbing, bouncing, slingshot motion, or object-based traversal, including what was hard and how you made it readable for players."
      }
    ],
    media: [
      { title: "Hero gameplay clip", note: "Drop in a wide gif or video showing the core movement and character feel." },
      { title: "Networking breakdown", note: "Use a screenshot, diagram, or short clip that supports the authority and proxy explanation." },
      { title: "System spotlight", note: "Show one mechanic in detail, such as grabbing, ragdoll recovery, or traversal." }
    ],
    impact: "This project shows how I approach systems-heavy gameplay work. It combines engineering, networking, animation awareness, and hands-on feel tuning in a way that maps directly to gameplay programming roles.",
    bodyClass: "project-shroomfall",
    materialId: 0
  },
  axis: {
    label: "Professional Work",
    title: "Axis Football",
    subtitle: "Production gameplay work focused on tackle presentation, animation tuning, edge-case polish, and franchise feature support.",
    summary: "At Axis Games, I worked on player-facing gameplay polish where timing, offsets, and readability mattered across many edge cases. A lot of the value came from repeated iteration on situations that were easy to miss individually but very noticeable to players when they happened in motion.",
    role: "Gameplay / Animation Intern",
    type: "Professional Experience",
    focus: [
      "Gameplay readability",
      "Tackle animation tuning",
      "Edge-case iteration",
      "Franchise feature support"
    ],
    tech: [
      "Unity workflow",
      "Gameplay iteration",
      "Animation polish",
      "Production collaboration",
      "System and presentation design"
    ],
    work: [
      "Tuned tackle animations across goal-line, high-speed, sideline, and side-impact situations.",
      "Adjusted offsets, timing, and rotation behavior to reduce awkward presentation and improve clarity.",
      "Supported planning for an AI-assisted franchise article system built around template structure and data tags.",
      "Worked in a production environment where polish depended on repeated testing and refinement across many scenarios."
    ],
    deepDives: [
      {
        title: "Tackle animation polish",
        body: "Use this section to explain how you tuned offsets, rotation timing, and edge cases for different tackle contexts. This is a good place for side-by-side gifs or before and after clips."
      },
      {
        title: "Franchise article generation system",
        body: "Break down the article template structure, priority logic, tag system, and how you thought about balancing authored content with lighter AI support."
      },
      {
        title: "Working inside production constraints",
        body: "Explain how you evaluated changes, communicated with the team, and iterated on work that had to fit an existing game instead of being built in isolation."
      }
    ],
    media: [
      { title: "Tackle presentation reel", note: "Add a gameplay gif or short video showing the kinds of tackle moments you tuned." },
      { title: "Before / after polish", note: "Use this slot for comparison captures that make your iteration visible." },
      { title: "Feature planning support", note: "Include a screenshot, mockup, or article system image if you want to show deeper systems work." }
    ],
    impact: "This work shows that I can contribute inside a real production pipeline and improve the parts of gameplay that players notice immediately, especially readability, polish, and presentation quality.",
    bodyClass: "project-axis",
    materialId: 2
  },
  tools: {
    label: "Tools + Workflow",
    title: "Gameplay / Design Tools",
    subtitle: "Internal tooling focused on faster iteration, clearer debugging, and more usable workflows for design and gameplay development.",
    summary: "This section is meant to collect tools work that supports development directly: tuning utilities, debug visualization, workflow helpers, and systems that make iteration faster and clearer. Even when the tool itself is small, the value is in how much easier it makes building and balancing features.",
    role: "Tools / Technical Design",
    type: "Internal Tooling",
    focus: [
      "Iteration speed",
      "Debug visibility",
      "Tuning workflows",
      "Designer-facing usability"
    ],
    tech: [
      "Unity editor tooling",
      "Debug visualization",
      "Systems tuning",
      "Workflow design",
      "Gameplay support tools"
    ],
    work: [
      "Built and iterated on internal helpers that support faster testing and clearer debugging.",
      "Focused on tooling that makes systems easier to inspect, tune, and communicate during development.",
      "Approached tools work with the same player-facing mindset as gameplay work: clarity, responsiveness, and usability.",
      "Used tooling as a way to reduce friction between design intent and engineering implementation."
    ],
    deepDives: [
      {
        title: "Why tooling matters",
        body: "Use this section to explain what problem a tool solved, who used it, and how it improved workflow speed or visibility."
      },
      {
        title: "Debugging and visualization",
        body: "Show any in-editor or runtime views that made hidden systems easier to understand, such as state displays, graphs, overlays, or tuning panels."
      },
      {
        title: "Where this is going",
        body: "As you add more tools work, this page can become a stronger hub for editor extensions, balancing utilities, import pipelines, and workflow support systems."
      }
    ],
    media: [
      { title: "Tool UI capture", note: "Add an editor screenshot, debug panel, or workflow UI." },
      { title: "Before / after workflow", note: "Show how the tool made a task faster, clearer, or less error-prone." },
      { title: "System visibility", note: "Use a clip or screenshot that demonstrates what the tool reveals or improves." }
    ],
    impact: "This card shows tools-programmer and technical-design thinking: improving development quality by making systems easier to tune, inspect, and ship.",
    bodyClass: "project-tools",
    materialId: 1
  },
  aiml: {
    label: "AI / ML",
    title: "Steam Metadata ML",
    subtitle: "A machine learning project predicting Steam review sentiment using pre-release metadata rather than gameplay footage or player-written review text.",
    summary: "This project explored whether a game’s review outcome could be predicted from metadata alone, using information like price, genres, categories, achievements, and platform support. I cleaned the dataset, engineered 81 metadata features, and compared multiple classifiers to see how much signal exists before a game even launches.",
    role: "ML / Data Project",
    type: "Applied Machine Learning",
    focus: [
      "Feature engineering",
      "Dataset cleaning",
      "Model comparison",
      "Games-focused analysis"
    ],
    tech: [
      "Python",
      "Scikit-learn",
      "Classification models",
      "Data preprocessing",
      "Visualization and evaluation"
    ],
    work: [
      "Cleaned and filtered a large Steam dataset to remove unstable or misleading samples.",
      "Built metadata-only features so the model could not rely on review leakage.",
      "Compared Logistic Regression and Random Forest classifiers on the same task.",
      "Analyzed which metadata features were most predictive and what that implies for game positioning and reception."
    ],
    deepDives: [
      {
        title: "Feature engineering and preprocessing",
        body: "Explain how metadata fields were parsed, encoded, cleaned, and transformed into model-ready features."
      },
      {
        title: "Model results and interpretation",
        body: "Break down the comparison between baseline and nonlinear models, and explain what ~67 percent accuracy means in context."
      },
      {
        title: "Why this matters for games",
        body: "Use this section to connect the project back to game development: player expectations, store positioning, platform support, and how metadata can reveal product signals."
      }
    ],
    media: [
      { title: "Data distribution view", note: "Add one chart showing review positivity versus review count or another key relationship." },
      { title: "Feature importance plot", note: "Show the most predictive metadata features from the model." },
      { title: "Pipeline overview", note: "Use a simple diagram or screenshot to explain the preprocessing and training flow." }
    ],
    impact: "This project broadens the portfolio beyond gameplay alone and shows applied ML thinking on a problem directly related to games, data, and technical analysis.",
    bodyClass: "project-aiml",
    materialId: 3
  }
};

let activeProjectId = null;
let projectFocusBlend = 0;

const projectCards = Array.from(document.querySelectorAll(".project-card"));
const projectView = document.getElementById("projectView");
const projectBack = document.getElementById("projectBack");
const projectViewLabel = document.getElementById("projectViewLabel");
const projectViewTitle = document.getElementById("projectViewTitle");
const projectViewSubtitle = document.getElementById("projectViewSubtitle");
const projectRole = document.getElementById("projectRole");
const projectType = document.getElementById("projectType");
const projectSummary = document.getElementById("projectSummary");
const projectFocusList = document.getElementById("projectFocusList");
const projectTechList = document.getElementById("projectTechList");
const projectWorkList = document.getElementById("projectWorkList");
const projectImpact = document.getElementById("projectImpact");
const projectMediaGrid = document.getElementById("projectMediaGrid");
const projectDeepDives = document.getElementById("projectDeepDives");

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function renderList(el, items) {
  el.innerHTML = "";
  for (const item of items) {
    const li = document.createElement("li");
    li.textContent = item;
    el.appendChild(li);
  }
}

function renderMedia(items) {
  projectMediaGrid.innerHTML = "";
  for (const item of items) {
    const slot = document.createElement("div");
    slot.className = "media-slot";

    const title = document.createElement("strong");
    title.textContent = item.title;

    const note = document.createElement("span");
    note.textContent = item.note;

    slot.appendChild(title);
    slot.appendChild(note);
    projectMediaGrid.appendChild(slot);
  }
}

function renderDeepDives(items) {
  projectDeepDives.innerHTML = "";
  for (const item of items) {
    const details = document.createElement("details");
    details.className = "deep-dive";

    const summary = document.createElement("summary");
    summary.textContent = item.title;

    const body = document.createElement("div");
    body.className = "deep-dive-body";

    const copy = document.createElement("p");
    copy.className = "deep-dive-copy";
    copy.textContent = item.body;

    body.appendChild(copy);
    details.appendChild(summary);
    details.appendChild(body);
    projectDeepDives.appendChild(details);
  }
}

function openProject(projectId) {
  const project = portfolioProjects[projectId];
  if (!project) return;

  activeProjectId = projectId;
  document.body.classList.add("project-open");

  for (const value of Object.values(portfolioProjects)) {
    document.body.classList.remove(value.bodyClass);
  }

  document.body.classList.add(project.bodyClass);
  projectView.setAttribute("aria-hidden", "false");

  for (const card of projectCards) {
    card.classList.toggle("is-active", card.dataset.project === projectId);
  }

  projectViewLabel.textContent = project.label;
  projectViewTitle.textContent = project.title;
  projectViewSubtitle.textContent = project.subtitle;
  projectRole.textContent = project.role;
  projectType.textContent = project.type;
  projectSummary.textContent = project.summary;
  projectImpact.textContent = project.impact;

  renderList(projectFocusList, project.focus);
  renderList(projectTechList, project.tech);
  renderList(projectWorkList, project.work);
  renderMedia(project.media);
  renderDeepDives(project.deepDives);

  projectView.scrollTo({ top: 0, behavior: "smooth" });
}

function closeProject() {
  activeProjectId = null;
  document.body.classList.remove("project-open");
  projectView.setAttribute("aria-hidden", "true");

  for (const value of Object.values(portfolioProjects)) {
    document.body.classList.remove(value.bodyClass);
  }

  for (const card of projectCards) {
    card.classList.remove("is-active");
  }
}

projectCards.forEach((card) => {
  card.addEventListener("click", () => openProject(card.dataset.project));
});

if (projectBack) {
  projectBack.addEventListener("click", closeProject);
}

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeProject();
});

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

let simulator = new Simulator(window.innerWidth, window.innerHeight, numParticles);
simulator.running = true;

const fpsMonitor = new FPSMonitor();
const renderer = new MetaballsRenderer(gl, canvas);

let positionBuffer = gl.createBuffer();
let materialBuffer = gl.createBuffer();
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
    "restDensity", "stiffness", "nearStiffness", "springStiffness", "plasticity", "yieldRatio",
    "minDistRatio", "linViscosity", "quadViscosity", "kernelRadius", "pointSize", "gravX",
    "gravY", "dt", "attractSame", "attractDifferent", "stepsPerFrame"
  ];

  for (let id of sliderIds) {
    const el = document.getElementById(id);
    if (!el) continue;
    const value = parseFloat(el.value);

    if (id === "attractSame") simulator.attractSame = value;
    else if (id === "attractDifferent") simulator.attractDifferent = value;
    else if (id === "stepsPerFrame") simulator.stepsPerFrame = Math.max(1, Math.round(value));
    else simulator.material[id] = value;
  }

  const emitMaterial = document.getElementById("emitMaterial");
  if (emitMaterial) simulator.emitMaterialId = parseInt(emitMaterial.value, 10) || 0;

  const colorIds = ["color0", "color1", "color2", "color3"];
  for (let i = 0; i < colorIds.length; i++) {
    const el = document.getElementById(colorIds[i]);
    if (el && simulator.materials[i]) simulator.materials[i].color = el.value;
  }

  const massIds = ["mass0", "mass1", "mass2", "mass3"];
  for (let i = 0; i < massIds.length; i++) {
    const el = document.getElementById(massIds[i]);
    if (el && simulator.materials[i]) simulator.materials[i].mass = parseFloat(el.value);
  }

  simulator.hoverStrength = 0.085;
  simulator.hoverRadius = 150;
  simulator.hoverFalloffPower = 1.4;
  simulator.hoverMaxSpeed = 15;
}

function getActiveHeaderMaterialId() {
  return activeProjectId ? portfolioProjects[activeProjectId].materialId : -1;
}

function applyPortfolioHeaderFlow() {
  const targetProjectBlend = activeProjectId ? 1 : 0;
  projectFocusBlend += (targetProjectBlend - projectFocusBlend) * 0.16;

  const blend = projectFocusBlend;
  if (blend <= 0.001) {
    return;
  }

  const activeMaterialId = getActiveHeaderMaterialId();
  const topClampY = 10;
  const bandCenterY = 22;
  const headerDepth = 42;
  const forcedRiseSpeed = 12.5;
  const forcedLift = 1.85;
  const horizontalSpread = 0.028;
  const settleStrength = 0.072;
  const settleDamping = 0.87;
  const nonSelectedDrop = 0.02;

  for (let i = 0; i < simulator.particles.length; i++) {
    const p = simulator.particles[i];
    const selected = p.materialId === activeMaterialId;

    if (selected) {
      const riseFactor = clamp((p.posY - bandCenterY) / Math.max(110, simulator.height * 0.42), 0, 1);
      const lift = blend * (0.45 + riseFactor * 0.9);
      const hashed = ((((i * 0.61803398875) + (p.posX * 0.0037)) % 1) + 1) % 1;
      const targetX = simulator.width * (0.08 + hashed * 0.84);
      const targetY = bandCenterY + (hashed - 0.5) * headerDepth;
      const nearHeader = p.posY < bandCenterY + headerDepth * 1.1;

      p.velY = Math.min(p.velY, -(4.4 + forcedRiseSpeed * lift));
      p.posY -= forcedLift * lift;

      if (nearHeader) {
        p.posY += (targetY - p.posY) * (settleStrength * blend);
        p.velY *= settleDamping;
      }

      p.velX += clamp((targetX - p.posX) / 120, -1.9, 1.9) * horizontalSpread * (0.45 + blend * 0.8);
      p.velX *= 0.992;

      if (p.posY < topClampY) {
        p.posY = topClampY;
        if (p.velY < -0.05) p.velY = -0.05;
      }
    } else if (nonSelectedDrop > 0) {
      p.velY += nonSelectedDrop * projectFocusBlend;
      p.velX *= 0.998;
      p.velY *= 0.998;
    }
  }
}

function stepSimulation() {
  const steps = Math.max(1, simulator.stepsPerFrame || 1);
  for (let i = 0; i < steps; i++) {
    simulator.update();
    applyPortfolioHeaderFlow();
  }
}

function renderFrame() {
  uploadParticleBuffers();
  const colors = getMaterialColors();
  const metaballPointSize = simulator.material.pointSize * 8.0;
  const focusBoost = 1 + projectFocusBlend * 0.18;
  renderer.beginMetaballsRender(metaballPointSize * focusBoost);
  renderer.renderMetaballsBatch(positionBuffer, materialBuffer, simulator.particles.length);
  renderer.endMetaballsRender();
  renderer.applyBlur();

  renderer.render({
    colors,
    backgroundTexture: externalBackgroundTexture,
    threshold: 0.215 - projectFocusBlend * 0.012,
    refractionStrength: 0.024,
    chromaticAberration: 0.002,
    lightIntensity: 1.45 + projectFocusBlend * 0.12,
    absorption: 0.72,
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
  "restDensity", "stiffness", "nearStiffness", "springStiffness", "plasticity", "yieldRatio",
  "minDistRatio", "linViscosity", "quadViscosity", "kernelRadius", "pointSize", "gravX",
  "gravY", "dt", "attractSame", "attractDifferent", "stepsPerFrame"
];

for (let sliderId of materialSliders) {
  const slider = document.getElementById(sliderId);
  if (!slider) continue;

  slider.addEventListener("input", (e) => {
    const value = parseFloat(e.target.value);
    if (sliderId === "attractSame") simulator.attractSame = value;
    else if (sliderId === "attractDifferent") simulator.attractDifferent = value;
    else if (sliderId === "stepsPerFrame") simulator.stepsPerFrame = Math.max(1, Math.round(value));
    else simulator.material[sliderId] = value;
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

document.getElementById("numParticles").addEventListener("input", (e) => {
  const newCount = parseInt(e.target.value, 10);
  if (newCount === numParticles) return;

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
  if (!el) continue;
  el.addEventListener("input", (e) => {
    if (simulator.materials[i]) simulator.materials[i].color = e.target.value;
  });
}

const massIds = ["mass0", "mass1", "mass2", "mass3"];
for (let i = 0; i < massIds.length; i++) {
  const el = document.getElementById(massIds[i]);
  if (!el) continue;
  el.addEventListener("input", (e) => {
    if (simulator.materials[i]) simulator.materials[i].mass = parseFloat(e.target.value);
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

const actionKeys = { e: "emit", d: "drain", a: "attract", r: "repel" };

window.addEventListener("keydown", (e) => {
  if (actionKeys[e.key]) simulator[actionKeys[e.key]] = true;
});

window.addEventListener("keyup", (e) => {
  if (actionKeys[e.key]) simulator[actionKeys[e.key]] = false;
});

window.addEventListener("blur", () => {
  for (let key in actionKeys) simulator[actionKeys[key]] = false;
});

window.setMetaballsBackgroundTexture = function (texture) {
  externalBackgroundTexture = texture;
};
