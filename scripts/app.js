
// Options
let numParticles = 2200;

const portfolioProjects = {
  shroomfall: {
    label: "Indie Game",
    title: "Shroomfall",
    titleLogo: "assets/projects/shroomfall/images/shroomfall-logo.png",
    subtitle: "A solo-developed multiplayer active-ragdoll game built around host-authoritative networking, physics-first interaction, and expressive movement that still feels responsive. In active solo development since October 2025, focused on building toward a full playable release.",
    summary: "Shroomfall is a solo-developed multiplayer project built around a <span class='highlight-recruiter-red'>host-authoritative active ragdoll</span> instead of a traditional character controller. The core challenge has been making a fully physics-driven player still feel responsive in multiplayer, so I split responsibilities intentionally: the host owns movement, grounded state, jumping, damage, knockdowns, and body orientation, while clients mainly send input and render the replicated result. Around that, I built a <span class='highlight-recruiter-red'>custom movement stack</span> with separate ground and air acceleration, buffered jump, coyote time, jump-cutting, distance-based fall acceleration, and adaptive yaw steering so the character keeps its unstable ragdoll feel without becoming muddy or unplayable.",
    role: "Solo Developer / Gameplay Programmer",
    type: "Indie Project",
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
        title: "Technical breakdown: host-authoritative movement stack, active-ragdoll locomotion, and physical traversal",
        body: "The movement system is built specifically for a <span class='highlight-recruiter-red'>physics-based active ragdoll</span>, not a normal capsule controller or a single rigidbody with forces layered on top. The player body is a connected physical structure driven by a root rigidbody, multiple limb bodies, configurable joints, animation-fed joint targets, grab states, slingshot launches, impact recovery, and active-versus-limp transitions, so locomotion had to cooperate with the rest of that chain instead of bypassing it. I originally explored a more typical client-predicted approach, but that ended up being a poor fit for a heavily jointed body where small differences in contact resolution, latch timing, posture, or impulse response created visible corrections and instability. The final system is therefore <span class='highlight-recruiter-red'>fully host-authoritative</span>: the input owner packages movement, jump, sprint, grab, and look intent into network input, while the host computes grounded truth, body yaw, jump legality, fall shaping, landing consequences, and the final physical motion result. Inside that authority-owned loop, <span class='highlight-recruiter-red'>MovementControl</span> acts as the real motor. Ground and air are handled separately through velocity shaping rather than transform warping, with explicit ground acceleration and braking, a more constrained air-control model that respects takeoff momentum, sprint latching, jump buffering, coyote time, jump cut on early release, extra downward stick, and distance-based fall acceleration so the body can stay responsive without losing its unstable ragdoll character. Facing is part of the movement model too: the host rotates a networked body-yaw value toward aim input and drives the main joint toward that orientation, with turn rate reduced in air, while carrying heavier objects, or while both hands are latched to kinematic anchors. Movement posture is also fed back into the ragdoll through head and spine targets, airborne stiffness blending, and animation parameters that support locomotion without replacing the physical body. Special traversal follows the same philosophy rather than cheating around it. Aerial jumps can release dual kinematic hand latches before applying force, hard landings convert movement outcome into damage and knockdown state, and the slingshot mechanic works as a dedicated sub-mode that charges through physical attachment state, releases both hands, applies host-side launch velocity and torque, temporarily changes ragdoll behavior, and then recovers back into the normal locomotion loop. The result is a <span class='highlight-recruiter-red'>single connected movement architecture</span> where traversal, posture, recovery, jump forgiveness, and ragdoll state all reinforce each other, while the networking model stays matched to the kind of body the game is actually simulating."
      },
      {
        title: "Technical breakdown: physically-staged customization pipeline, preview separation, and multiplayer replication",
        body: "I wanted customization to feel like an <span class='highlight-recruiter-red'>interactive in-world system</span> instead of a flat menu that just swaps colors and face icons. To do that, I split the feature into clean layers with different responsibilities. <span class='highlight-recruiter-red'>ShroomCustomizerMPB</span> is the rendering core for a single avatar or preview shroom: it applies masked body, cap, and spot colors through <span class='highlight-recruiter-red'>MaterialPropertyBlocks</span> so each player can have unique colors without duplicating runtime materials, switches eye variants through GameObject sets, swaps mouth textures through a property block on the mouth quad, and can drive temporary emission feedback while a change is still “in transit.” The important architecture decision is that preview state and committed state are separate. The additive overlay edits a dedicated preview avatar, not the live networked player, so the player can experiment freely without polluting session state or other clients. Color changes also are not hard-set immediately every frame. The wheel controller samples a color from a 3D raycast-driven wheel, routes it into body, cap, or spots, then the preview customizer pushes that value into a <span class='highlight-recruiter-red'>pending -> queued sample -> delayed target -> visible color motion</span> pipeline. Small color jitter is filtered out, queued samples are released after a configurable travel delay, the visible colors lerp toward those delayed targets, and emission renderers light with the pending color while the change is still moving. That gave the whole system a much more physical and visually authored feel than a normal RGB picker. Face customization uses a different interaction model entirely: draggable eye and mouth stickers preview only while hovering a valid drop zone, revert safely on invalid release, and commit only on a valid drop, which made trying options feel playful without accidental changes. On apply, the preview avatar exports a compact <span class='highlight-recruiter-red'>ShroomData</span> payload, writes it to local persistence, immediately updates the live local avatar for responsiveness, and sends the same packed RGBA and face-index state into Fusion network properties so every client reconstructs the same committed look through its own local customizer. That separation between rendering, preview UX, saved preference, and authoritative replication made the feature feel much more polished than a standard menu while still staying efficient and maintainable in multiplayer."
      },
      {
        title: "Technical breakdown: host-authoritative ragdoll architecture, proxy playback, and world-state integration",
        body: "The broader multiplayer architecture is built around a <span class='highlight-recruiter-red'>host-authoritative active ragdoll</span> rather than a normal controller that just synchronizes a transform and a few booleans. <span class='highlight-recruiter-red'>NetworkPlayer</span> separates input authority from state authority so the local player submits intent, but the host owns the real gameplay truth: health, death, active-versus-limp state, portal transition state, grounded state, body yaw, grab state, and the final local rotations of the tracked ragdoll bones. The most important networking decision is that I am not trying to keep a full physical ragdoll simulation alive on every proxy. On non-authoritative instances, rigidbodies are zeroed and made kinematic, gravity and collisions are disabled, colliders are turned off, and joints are stripped so remote players become intentionally <span class='highlight-recruiter-red'>de-physicalized visual replicas</span> instead of unstable second simulations fighting the host. The host publishes the resulting local rotations of tracked bones into a network array each tick, and proxies reconstruct that result through buffered playback: they store replicated snapshots in a per-tick ring buffer, backfill missed ticks when needed, render from a small delay, slerp between adjacent snapshots, and snap when angles diverge too far. That gives remote characters continuity and readable secondary motion without the solver divergence, collision conflicts, and correction noise that would come from fully distributed ragdoll physics. The same authority pattern extends outward into the rest of the game. Hazards and interactables do not reach deep into player internals from random places; systems such as fire, explosions, and portals feed through narrow authoritative entry points for damage, knockdown, impulses, and transition state. Durable gameplay truth lives in replicated properties and timers, while one-shot audiovisual moments are fanned out with RPCs. Portal activation, countdowns, forced arrivals, teleports, and scene swaps all follow that same state-plus-RPC split, and authority-side teleports are paired with local correction on the input owner so the transition still feels immediate. The result is a multiplayer architecture that preserves the identity of a messy, physical active ragdoll character while staying far more stable, readable, and shippable than trying to simulate the full body independently on every machine."
      }
    ],
    media: [
      { title: "Gameplay Systems", type: "video", src: "shroomfall-gameplay.mp4", note: "Active ragdoll movement, grabbing, slingshot, fall splat, portals, fire spread, and other core gameplay systems." },
      { title: "Multiplayer", type: "video", src: "shroomfall-multiplayer.mp4", note: "Networking and multiplayer behavior with several players in a shared test scene." },
      { title: "Customization", type: "video", src: "assets/projects/shroomfall/video/shroomfall-customization.mp4", note: "Character customization flow and presentation." }
    ],
    impact: "Shroomfall shows my strongest gameplay engineering work as a solo developer: multiplayer architecture, custom movement, ragdoll networking, animation-physics blending, and <span class='highlight-recruiter-red'>systemic interaction design</span> all built to support the same physics-first game instead of feeling like isolated features.",
    bodyClass: "project-shroomfall",
    materialId: 0
  },
  axis: {
    label: "Professional Work",
    title: "Axis Football 27",
    titleLogo: "assets/projects/axis/images/axis-football-27-logo.png",
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
      {
        title: "Tackle Animation Reel",
        type: "video",
        src: "assets/projects/axis/video/AxisFootballTackleAnimations.mp4",
        note: "Fast-cut showcase of the tackle animation tuning and polish work across a wide range of situations."
      },
      {
        title: "Article Tag Debug",
        type: "video",
        src: "assets/projects/axis/video/AxisTags.mp4",
        note: "Debug view showing live franchise tag resolution and the data feeding the article generation pipeline."
      }
    ],
    impact: "This project shows both sides of production gameplay work: building a <span class='highlight-recruiter-blue'>shipped runtime content system</span> that turns simulation data into player-facing franchise content, and detailed on-field animation tuning that improves gameplay presentation.",
    bodyClass: "project-axis",
    materialId: 3
  },
  tools: {
    label: "Internship Project",
    title: "AWS Cloud Automation",
    subtitle: "Internship project focused on cloud-backed backend automation for storefront pricing, catalog imports, service-order workflows, and Shopify data management.",
    summary: "Built a <span class='title-accent-yellow'>lightweight cloud commerce automation stack</span> around serverless-style backend jobs, Shopify Admin integrations, product and service data modeling, and automated workflows for pricing, imports, and service-order handling. The throughline was taking messy operational tasks and turning them into reliable scripted systems that could run securely, scale across multiple handlers, and update real storefront data without constant manual intervention.",
    role: "Cloud Engineering / Backend Automation Intern",
    type: "Internship Project",
    focus: [
      "Serverless-style backend workflows",
      "API integration and automation",
      "Shopify Admin REST + GraphQL",
      "Data modeling and normalization",
      "Operational tooling and schema setup",
      "Commerce workflow automation"
    ],
    tech: [
      "AWS Secrets Manager",
      "Lambda-style handler architecture",
      "Python + JavaScript automation",
      "Shopify Admin REST API",
      "Shopify Admin GraphQL API",
      "Environment-driven configuration",
      "Regex and heuristic data cleaning",
      "CSV and JSON processing"
    ],
    work: [
      "Built <span class='title-accent-yellow'>cloud-backed backend automations</span> for storefront operations rather than one-off scripts, with reusable handlers, environment-driven configuration, and secure secret-managed credentials.",
      "Developed a competitive pricing pipeline that pulled external market data, extracted likely price candidates, filtered noisy results, computed trimmed averages, and pushed updated values back into Shopify product variants.",
      "Created import and normalization workflows for product and service catalog data, including SKU generation, category assignment, conditional inventory behavior, and metadata mapping into Shopify-ready payloads.",
      "Implemented service-order and customer workflows that turned intake data into structured Shopify records using custom metafields, customer creation scripts, and schema-definition automation."
    ],
    deepDives: [
      {
        title: "Technical breakdown: serverless-style job architecture, secure configuration, and handler reuse",
        body: "A big part of the value here was architectural, not just feature-by-feature scripting. The automation stack was structured around a <span class='title-accent-yellow'>Lambda-style execution model</span> where environment configuration determined which handler should run, which meant the same deployed backend could execute different operational tasks without being rewritten into isolated one-off tools. Shopify credentials and external API access were driven through environment variables and <span class='title-accent-yellow'>AWS Secrets Manager</span> rather than being embedded directly in code, which is the kind of separation you want when automation starts moving from local experiments into reusable cloud jobs. That structure made the work feel more like backend systems engineering than simple scripting: a configurable automation surface, secure credential flow, and a codebase organized so multiple commerce tasks could live in the same operational framework."
      },
      {
        title: "Technical breakdown: competitive pricing pipeline, noisy-data cleanup, and storefront updates",
        body: "The pricing workflow was essentially a small ingestion and decision pipeline. It queried an external search source, extracted likely prices from returned text using regex, filtered out unreasonable values, and then used a <span class='title-accent-yellow'>trimmed-mean style aggregation</span> to reduce the influence of noisy outliers before committing an updated number. On the storefront side, the automation fetched Shopify product data, read variant pricing, and wrote adjusted prices back through the Admin API. What I like about this system is that it was not just a naive scrape-and-overwrite approach. It had secret-managed credentials, external API communication, heuristic extraction, outlier resistance, persistence updates, and final API-side synchronization, which made it a more credible data pipeline than a basic crawler script."
      },
      {
        title: "Technical breakdown: catalog import workflows, service-order modeling, and Shopify schema automation",
        body: "Another major piece of the work was turning semi-structured business data into a normalized operational model inside Shopify. Product and service import scripts converted source records into storefront-ready payloads by deriving titles and descriptions, generating SKUs when needed, assigning categories, and handling inventory behavior differently for service items versus stocked items. Beyond that, I worked on a <span class='title-accent-yellow'>service-order digitization workflow</span> that represented repair intake as structured Shopify records with custom metafields for things like invoice number, complaint description, service date, parts provided, vehicle state, and other intake details. Supporting scripts also created the metafield definitions and customer records through GraphQL, including validation, formatting, and rate-limited batch behavior. That combination of import logic, schema creation, and operational record modeling made this project much stronger than simple CRUD automation because it treated Shopify as both a storefront and a backend data system."
      }
    ],
    media: [],
    impact: "This project broadens the portfolio beyond gameplay by showing <span class='title-accent-yellow'>backend automation, API integration, secure cloud job design, data modeling, and operational workflow engineering</span> in a real business context.",
    bodyClass: "project-tools",
    materialId: 1
  },
  aiml: {
    label: "Focused Project",
    title: "Steam Metadata ML",
    subtitle: "A machine learning project predicting Steam review sentiment from pre-release metadata alone, using store-facing features instead of gameplay footage, review text, or post-launch reception signals.",
    summary: "This project asked whether a game’s Steam review outcome could be predicted before launch using only metadata the developer already controls or exposes ahead of release. I built a <span class='highlight-recruiter-green'>metadata-only classification pipeline</span> using price, genres, categories, platform support, achievements, and related store information, then compared Logistic Regression and Random Forest models to measure how much signal exists without relying on gameplay footage or user-written reviews.",
    role: "ML / Data Project",
    type: "Focused Portfolio Project",
    focus: [
      "Feature engineering",
      "Dataset cleaning and filtering",
      "Model comparison",
      "Games-focused data analysis",
      "Interpretability and feature importance"
    ],
    tech: [
      "Python",
      "Pandas / NumPy",
      "Scikit-learn",
      "Logistic Regression",
      "Random Forest",
      "Data preprocessing",
      "Visualization and evaluation"
    ],
    work: [
      "Cleaned and filtered a 70,000+ entry Steam dataset down to a more reliable 24,000-game training set by removing unreleased titles, zero-review games, and unstable low-sample cases.",
      "Engineered <span class='highlight-recruiter-green'>81 metadata-based features</span> from store-facing fields such as genres, categories, platforms, achievements, developer/publisher counts, price, and release timing.",
      "Removed all review-derived input columns to avoid leakage, then trained and compared Logistic Regression and Random Forest classifiers on the same binary sentiment task.",
      "Used visualization and feature-importance analysis to identify which metadata signals were most predictive, including price, achievement count, genre tags, controller support, trading cards, cloud saves, and broader platform coverage."
    ],
    deepDives: [
      {
        title: "Technical breakdown: dataset filtering, label design, and leakage-safe preprocessing",
        body: "The core challenge was turning a messy real-world Steam dataset into something usable without letting the model cheat. I started from a 70,000+ entry Kaggle dataset, removed unreleased games and titles with zero reviews, then filtered the set down further to games with at least 10 reviews because extremely small sample sizes caused unstable review percentages that would add noise to the label. The final dataset contained roughly <span class='highlight-recruiter-green'>24,000 games and 81 metadata-only features</span>. From there, I parsed list-encoded store fields such as genres, categories, and platforms, multi-hot encoded those tags, created structured numeric signals like developer and publisher counts, filled missing Metacritic values with the median, derived release-year information, and removed all review-related columns from the model inputs. Labels were then created from the positive review percentage using Steam’s 75 percent ‘Very Positive’ threshold, so the final task stayed grounded in a real platform-facing quality benchmark while still keeping the input pipeline pre-release only."
      },
      {
        title: "Technical breakdown: baseline versus nonlinear model comparison",
        body: "I used two different classifiers so the project could compare simple and nonlinear decision boundaries on the same feature set. <span class='highlight-recruiter-green'>Logistic Regression</span> acted as the linear baseline after feature scaling, which helped show how far straightforward metadata relationships could go on their own. I then trained a <span class='highlight-recruiter-green'>Random Forest classifier</span> to capture more complex interactions between price, platform support, genre combinations, and other store metadata. The models were evaluated on a stratified 80/20 train-test split, and both landed around <span class='highlight-recruiter-green'>67 percent accuracy</span> without using gameplay footage, written review text, or post-launch engagement signals. That result was the most interesting part of the project: metadata alone does not explain everything, but it carries a lot more predictive signal than I initially expected."
      },
      {
        title: "Technical breakdown: visualization, feature importance, and game-facing takeaways",
        body: "The project was not just about producing an accuracy number; it was also about understanding what kinds of store-facing signals actually matter. The review-count scatter plot showed why low-sample games had to be filtered: titles with very few reviews could appear extremely positive or extremely negative simply because a tiny audience swings the percentage wildly, while higher-review games stabilize into a narrower band. On the model side, the Random Forest feature importances surfaced a set of useful patterns. <span class='highlight-recruiter-green'>Initial price and achievement count</span> were by far the strongest signals, followed by genre tags such as indie, action, casual, adventure, and RPG, plus ecosystem-facing features like Steam Cloud, trading cards, and controller support. Mac and Linux support also ranked meaningfully, which suggests broader platform support may correlate with more mature production and engineering pipelines. The overall takeaway is that store metadata cannot capture why a game fails moment to moment, but it does encode meaningful information about positioning, production scope, and perceived player value before launch."
      }
    ],
    media: [
      { title: "Review positivity vs review count", type: "image", src: "assets/projects/steam-metadata-ml/images/review-positivity-vs-review-count.png", note: "Shows why low-review-count games were filtered out: tiny sample sizes create extreme percentages that stabilize as review counts grow." },
      { title: "Top 30 feature importances", type: "image", src: "assets/projects/steam-metadata-ml/images/top-30-feature-importances.png", note: "Random Forest feature importances highlighting which metadata fields carried the most predictive signal." }
    ],
    impact: "This project shows applied ML work in a game-focused context: cleaning noisy real-world data, building a <span class='highlight-recruiter-green'>leakage-safe prediction pipeline</span>, comparing interpretable and nonlinear models, and using feature analysis to extract practical insights about how Steam store metadata relates to player reception.",
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
const projectMediaNote = document.querySelector(".media-note");
const shroomfallBgVideo = document.getElementById("shroomfallBgVideo");

function stopShroomfallBgVideo(resetToStart = false) {
  if (!shroomfallBgVideo) return;
  shroomfallBgVideo.pause();

  if (resetToStart && shroomfallBgVideo.readyState > 0) {
    try {
      shroomfallBgVideo.currentTime = 0;
    } catch (err) {
      // Ignore seek timing issues on partially loaded media.
    }
  }
}

function playShroomfallBgVideoOnce() {
  if (!shroomfallBgVideo) return;

  stopShroomfallBgVideo(true);

  const playPromise = shroomfallBgVideo.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch(() => { });
  }
}


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

function pauseAllMedia(except = null, resetToStart = false) {
  const videos = projectMediaGrid.querySelectorAll("video");
  videos.forEach((video) => {
    if (video !== except) {
      video.pause();
      if (resetToStart && video.readyState > 0) {
        try {
          video.currentTime = 0;
        } catch (err) {
          // Ignore seek timing issues on partially loaded media.
        }
      }
    }
  });
}

function renderMedia(items) {
  projectMediaGrid.innerHTML = "";
  const mediaCard = projectMediaGrid.closest(".media-card");
  const hasMedia = Array.isArray(items) && items.length > 0;

  if (mediaCard) {
    mediaCard.hidden = !hasMedia;
  }

  if (!hasMedia) {
    projectMediaGrid.classList.remove("media-grid-video-large", "media-grid-image-pair");
    if (projectMediaNote) projectMediaNote.textContent = "";
    return;
  }

  const hasVideo = items.some((item) => item.type === "video");
  const hasImage = items.some((item) => item.type === "image");
  const imageCount = items.filter((item) => item.type === "image").length;

  projectMediaGrid.classList.toggle("media-grid-video-large", hasVideo && items.length >= 3);
  projectMediaGrid.classList.toggle("media-grid-image-pair", !hasVideo && hasImage && imageCount === 2);

  if (projectMediaNote) {
    if (hasVideo) projectMediaNote.textContent = "Hover videos to preview them.";
    else if (hasImage) projectMediaNote.textContent = "Selected visualizations from the project.";
    else projectMediaNote.textContent = "";
  }

  for (const item of items) {
    const slot = document.createElement("div");
    slot.className = "media-slot";

    if (item.type === "video") {
      slot.classList.add("media-slot-video");

      const frame = document.createElement("div");
      frame.className = "media-video-frame";

      const video = document.createElement("video");
      video.className = "media-video";
      video.src = item.src;
      video.preload = "metadata";
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.setAttribute("webkit-playsinline", "");
      video.setAttribute("aria-label", item.title);

      const overlay = document.createElement("div");
      overlay.className = "media-video-overlay";
      overlay.textContent = "Hover to play";

      frame.appendChild(video);
      frame.appendChild(overlay);
      slot.appendChild(frame);

      const playVideo = () => {
        pauseAllMedia(video);
        const promise = video.play();
        if (promise && typeof promise.catch === "function") {
          promise.catch(() => { });
        }
      };

      const stopVideo = () => {
        video.pause();
        video.currentTime = 0;
      };

      slot.addEventListener("mouseenter", playVideo);
      slot.addEventListener("mouseleave", stopVideo);
      slot.addEventListener("focusin", playVideo);
      slot.addEventListener("focusout", stopVideo);
      video.addEventListener("ended", () => {
        video.currentTime = 0;
      });
    } else if (item.type === "image") {
      slot.classList.add("media-slot-image");

      const frame = document.createElement("div");
      frame.className = "media-image-frame";

      const image = document.createElement("img");
      image.className = "media-image";
      image.src = item.src;
      image.alt = item.title;
      image.loading = "lazy";

      frame.appendChild(image);
      slot.appendChild(frame);
    }

    const meta = document.createElement("div");
    meta.className = "media-slot-copy";

    const title = document.createElement("strong");
    title.textContent = item.title;

    const note = document.createElement("span");
    note.textContent = item.note;

    meta.appendChild(title);
    meta.appendChild(note);
    slot.appendChild(meta);
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

  if (projectId === "shroomfall") playShroomfallBgVideoOnce();
  else stopShroomfallBgVideo(false);

  projectView.scrollTo({ top: 0, behavior: "smooth" });
}

function closeProject() {
  pauseAllMedia(null, false);
  stopShroomfallBgVideo(false);
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


const discordLink = document.querySelector(".site-nav-discord");
if (discordLink) {
  const originalDiscordText = discordLink.textContent;
  const discordUsername = discordLink.dataset.discordUsername || "ramsram";

  discordLink.addEventListener("click", async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(discordUsername);
        discordLink.textContent = `Discord: ${discordUsername} copied`;
        window.setTimeout(() => {
          discordLink.textContent = originalDiscordText;
        }, 1600);
      }
    } catch (err) {
      // Ignore clipboard permission failures and still allow Discord to open.
    }
  });
}

if (shroomfallBgVideo) {
  shroomfallBgVideo.addEventListener("ended", () => {
    shroomfallBgVideo.pause();
  });
}

window.setMetaballsBackgroundTexture = function (texture) {
  externalBackgroundTexture = texture;
};
