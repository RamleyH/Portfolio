
// Options
let numParticles = 2200;

const portfolioProjects = {
  shroomfall: {
    label: "Original Game",
    title: "Shroomfall",
    titleLogo: "ShroomfallLogo (1).png",
    subtitle: "A solo-developed multiplayer active-ragdoll game built around host-authoritative networking, physics-first interaction, and expressive movement that still feels responsive.",
    summary: "Shroomfall is a solo-developed multiplayer project built around a <span class='highlight-recruiter-red'>host-authoritative active ragdoll</span> instead of a traditional character controller. The core challenge has been making a fully physics-driven player still feel responsive in multiplayer, so I split responsibilities intentionally: the host owns movement, grounded state, jumping, damage, knockdowns, and body orientation, while clients mainly send input and render the replicated result. Around that, I built a <span class='highlight-recruiter-red'>custom movement stack</span> with separate ground and air acceleration, buffered jump, coyote time, jump-cutting, distance-based fall acceleration, and adaptive yaw steering so the character keeps its unstable ragdoll feel without becoming muddy or unplayable.",
    role: "Solo Developer / Gameplay Programmer",
    type: "Original Project",
    focus: [
      "Host-authoritative multiplayer architecture",
      "Active ragdoll player controller",
      "Movement feel and gameplay responsiveness",
      "Physics interaction systems",
      "Animation-ragdoll blending",
      "Networked environmental gameplay"
    ],
    tech: [
      "Unity",
      "Fusion networking",
      "Host-authoritative simulation",
      "Networked bone playback",
      "Physics-driven gameplay",
      "Animation-driven joint targets",
      "Debug and tuning workflows"
    ],
    work: [
      "Owned the full solo-dev gameplay and networking foundation for a multiplayer physics-first game, from controller architecture through interaction, consequence, and progression systems.",
      "Built custom movement and state systems instead of relying on engine defaults, with a focus on tunable feel, readable ragdoll behavior, and multiplayer consistency.",
      "Created <span class='highlight-recruiter-red'>networked interaction systems</span> for grabbing, fire, explosions, sockets, and portals so they behave like synchronized gameplay systems instead of isolated effects.",
      "Developed the technical framework that lets networking, animation, ragdoll behavior, and physics support each other across the full player experience."
    ],
    deepDives: [
      {
        title: "Technical breakdown: authority model, simulation ownership, and movement stack",
        body: "The player runtime is built around a <span class='highlight-recruiter-red'>host-authoritative multiplayer architecture</span> with explicit separation between input authority and simulation authority. The host resolves movement, grounded truth, jump execution, damage, knockdowns, and authored body orientation, while clients submit input and consume replicated state for presentation. On top of that authority split, I implemented a custom motor with separate ground and air acceleration paths, buffered jump windows, coyote time, variable-height jump cutting, distance-scaled extra fall acceleration, and state-dependent yaw steering. That let me preserve the nonlinear instability of a physics-driven character while still exposing clear tuning points for responsiveness, readability, and multiplayer consistency."
      },
      {
        title: "Technical breakdown: replicated bone state, ring-buffer interpolation, and proxy stability",
        body: "For remote playback, I avoided full proxy-side physics simulation and instead built a host-written bone replication pipeline where driven local bone rotations are published into a network array each tick. Proxy instances reconstruct motion through a per-tick circular snapshot buffer with delayed render sampling, missed-tick backfilling, and quaternion slerp across adjacent snapshots. I also added large-angle snap protection and fallback handling so discontinuous motion does not smear, wobble, or visually desynchronize during fast impacts and abrupt state changes. The result is a <span class='highlight-recruiter-red'>ring-buffer interpolation pipeline</span> where gameplay truth stays centralized on the host, but remote characters still preserve the expressive secondary motion that sells the active ragdoll."
      },
      {
        title: "Technical breakdown: joint-drive blending, physical interaction, and networked consequence systems",
        body: "The active ragdoll is not just replicated pose data; it is driven through animation-informed joint targets and dynamic stiffness control for head look, spine shaping, locomotion pose support, and air-to-ground drive blending. Around that, interaction systems are implemented as real physical attachments rather than fake parenting: each hand can create a fixed-joint latch at a contact point, classify dynamic versus kinematic attachment state, propagate effective carried mass, and release or break under force thresholds. Consequence systems then consume the same physical state, converting impact velocity into scaled landing damage, knockdown timing, and temporary impact posing, while environmental systems synchronize burn timers, material darkening, secondary ignition, radial force falloff, sockets, and portal transitions under server-owned state."
      }
    ],
    media: [
      { title: "Core movement clip", note: "Show the active ragdoll movement, jumping, and general player feel in a clean gameplay clip." },
      { title: "Networking / proxy breakdown", note: "Use a gif, overlay, or diagram that explains host authority, replicated bones, and remote proxy playback." },
      { title: "Interaction systems spotlight", note: "Show one system in detail, such as grabbing, hard landings, fire spread, or explosive chain reactions." }
    ],
    impact: "Shroomfall shows my strongest gameplay engineering work as a solo developer: multiplayer architecture, custom movement, ragdoll networking, animation-physics blending, and <span class='highlight-recruiter-red'>systemic interaction design</span> all built to support the same physics-first game instead of feeling like isolated features.",
    bodyClass: "project-shroomfall",
    materialId: 0
  },
  axis: {
    label: "Professional Work",
    title: "Axis Football 27",
    titleLogo: "AxisLogoSS (2).png",
    subtitle: "Contributed to the release of Axis Football 27 through production gameplay, franchise systems work, large-scale tackle tuning, and player-facing presentation polish.",
    summary: "At Axis Games, I contributed to the release of Axis Football 27 across both on-field gameplay presentation and franchise-mode systems. The biggest systems feature I owned was a <span class='highlight-recruiter-blue'>scalable franchise news pipeline</span> that turns live simulation data into context-aware in-game articles, while my gameplay work focused on tuning 50+ new tackle animations through X offset, Z offset, rotation, and frame-start adjustments so different tackle situations read better and feel more polished in motion.",
    role: "Gameplay / Systems Intern",
    type: "Professional Experience",
    focus: [
      "Gameplay systems",
      "Data-driven content generation",
      "Runtime pipeline architecture",
      "Template rendering and validation",
      "Gameplay data integration",
      "Debug tooling and iteration workflows",
      "Animation tuning and presentation polish",
      "Production collaboration"
    ],
    tech: [
      "Unity / C# gameplay workflow",
      "Data-driven systems design",
      "Template-based content pipelines",
      "Runtime validation and formatting",
      "Debug tooling",
      "Gameplay data integration",
      "Franchise simulation support",
      "Animation tuning"
    ],
    work: [
      "Owned franchise-mode systems work for a dynamic in-game news feature that turns simulation state into player-facing articles.",
      "Built the supporting <span class='highlight-recruiter-blue'>content pipeline and debug workflow</span> needed to make a template-driven article system usable in production.",
      "Expanded the authored article and tag coverage so the system could support a wider range of weekly franchise storylines.",
      "Contributed on-field polish work by tuning 50+ tackle animations for cleaner alignment, timing, and situation-specific readability."
    ],
    deepDives: [
      {
        title: "Technical breakdown: article pipeline architecture and runtime composition",
        body: "The article system is structured as a <span class='highlight-recruiter-blue'>data-driven runtime pipeline</span> instead of a bundle of hardcoded news cases. Article content is split into reusable categories with separate headline and body template pools, then resolved at runtime into final UI-ready stories. The generation flow loads the valid article set for the current franchise week, filters against simulation context, checks whether required fields can be resolved, selects a compatible headline/body pairing, performs placeholder substitution, and emits formatted output for the news feed. That separation between authored content, validation, and rendering made the feature scale to 50+ article types and thousands of possible combinations without needing one-off scripts per story."
      },
      {
        title: "Technical breakdown: franchise context model, tag resolution, and validation tooling",
        body: "A major technical problem was making authored templates bind to live franchise data reliably enough for production use. I built a franchise-week context model plus a <span class='highlight-recruiter-blue'>100+ tag resolution layer</span> that exposes gameplay-driven values to the renderer, including standings, streaks, rankings, injuries, trades, schedule context, leaders, and matchup story hooks. Validation runs before template selection, so the pipeline only chooses stories whose required fields can actually be resolved for the current week. I also added caching, hotkey-based regeneration, and tag inspection tooling so I could audit mappings, surface missing data, and expand content coverage without destabilizing runtime output."
      },
      {
        title: "Technical breakdown: tackle alignment tuning and presentation iteration",
        body: "My gameplay-side contribution focused on the authored tuning layer for over 50 new tackle animations. For each tackle, I adjusted X offset, Z offset, rotation, and frame-start values so the clip would align more cleanly with the gameplay situation and contact timing. That tuning work was especially important for context-sensitive tackle cases tied to player velocity, mass, and field position, including sideline, goal-line, speed, and power scenarios. The workflow was highly iterative: evaluate the tackle in motion, identify alignment or timing failures, adjust the setup values, and retest until contact timing, body orientation, and overall field readability held up consistently."
      }
    ],
    media: [
      { title: "Franchise news system", note: "Add a screenshot or short clip of the generated franchise articles inside the in-game news feed." },
      { title: "Tag / template breakdown", note: "Show the template structure, supported tags, or a debug view that reveals how live franchise data maps into article output." },
      { title: "Tackle polish reel", note: "Use a gameplay gif or short before-and-after clip to show the animation tuning and situation-specific tackle work." }
    ],
    impact: "This project shows both sides of production gameplay work: building a <span class='highlight-recruiter-blue'>shipped runtime content system</span> that turns simulation data into player-facing franchise content, and detailed on-field animation tuning that improves gameplay presentation.",
    bodyClass: "project-axis",
    materialId: 3
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
    materialId: 2
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
    li.innerHTML = item;
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
    copy.innerHTML = item.body;

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
  if (project.titleLogo) {
    const extraClass = projectId === "shroomfall" ? " project-view-title-logo-shroomfall" : "";
    projectViewTitle.innerHTML = `<img class="project-view-title-logo${extraClass}" src="${project.titleLogo}" alt="${project.title}">`;
  } else {
    projectViewTitle.textContent = project.title;
  }
  projectViewSubtitle.textContent = project.subtitle;
  projectRole.textContent = project.role;
  projectType.textContent = project.type;
  projectSummary.innerHTML = project.summary;
  projectImpact.innerHTML = project.impact;

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
