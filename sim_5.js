class Particle {
  constructor(posX, posY, velX, velY, materialId = 0) {
    this.posX = posX;
    this.posY = posY;

    this.prevX = posX;
    this.prevY = posY;

    this.velX = velX;
    this.velY = velY;

    this.materialId = materialId;
    this.springs = {};
  }
}

function moveParticleData(dst, src) {
  dst.posX = src.posX;
  dst.posY = src.posY;
  dst.prevX = src.prevX;
  dst.prevY = src.prevY;
  dst.velX = src.velX;
  dst.velY = src.velY;
  dst.materialId = src.materialId;
  dst.springs = src.springs;
}

class Material {
  constructor(name, restDensity, stiffness, nearStiffness, kernelRadius, color = "#00cc66", mass = 1.0) {
    this.name = name;
    this.restDensity = restDensity;
    this.stiffness = restDensity ? stiffness : 0.5;
    this.nearStiffness = nearStiffness;
    this.kernelRadius = kernelRadius;
    this.pointSize = 5;
    this.gravX = 0.0;
    this.gravY = 0.5;
    this.dt = 1.0;

    this.springStiffness = 0.0;
    this.plasticity = 0.5;
    this.yieldRatio = 0.25;
    this.minDistRatio = 0.25;

    this.linViscosity = 0.0;
    this.quadViscosity = 0.1;

    this.maxPressure = 1.0;

    this.color = color;
    this.mass = mass;
  }
}

class Simulator {
  constructor(width, height, numParticles) {
    this.running = false;

    this.width = width;
    this.height = height;

    this.screenX = window.screenX;
    this.screenY = window.screenY;
    this.screenMoveSmootherX = 0;
    this.screenMoveSmootherY = 0;

    this.mouseX = width * 0.5;
    this.mouseY = height * 0.5;
    this.attract = false;
    this.repel = false;
    this.emit = false;
    this.drain = false;
    this.drag = false;

    this.mousePrevX = this.mouseX;
    this.mousePrevY = this.mouseY;

    // hover-only interaction tuning
    this.hoverRadius = 140;
    this.hoverStrength = 0.11;
    this.hoverMaxSpeed = 14;
    this.hoverFalloffPower = 1.35;
    this.hoverLowerHalfOnly = false;

    this.useSpatialHash = true;
    this.numHashBuckets = 5000;
    this.numActiveBuckets = 0;
    this.activeBuckets = [];
    this.particleListHeads = [];

    for (let i = 0; i < this.numHashBuckets; i++) {
      this.particleListHeads.push(-1);
      this.activeBuckets.push(0);
    }

    this.particleListNextIdx = [];

    this.material = new Material("base", 4, 0.5, 0.5, 40);

    this.materials = [
      new Material("red", 4, 0.5, 0.5, 40, "#FF4040", 1.0),
      new Material("orange", 4, 0.5, 0.5, 40, "#ffaa00", 0.6),
      new Material("green", 4, 0.5, 0.5, 40, "#00e230", 0.36),
      new Material("blue", 4, 0.5, 0.5, 40, "#0077f2", 0.216),
    ];

    this.emitMaterialId = 0;

    this.attractSame = 0.0;
    this.attractDifferent = 0.0;

    this.particles = [];
    this.addParticles(numParticles);
  }

  start() {
    this.running = true;
  }

  pause() {
    this.running = false;
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
  }

  getMaterialCount() {
    return this.materials.length;
  }

  getParticleMaterial(p) {
    return this.materials[p.materialId] || this.materials[0];
  }

  getParticleMass(p) {
    const mass = this.getParticleMaterial(p).mass;
    return Math.max(0.0001, mass);
  }

  syncSharedMaterialSettings() {
    for (let m of this.materials) {
      m.restDensity = this.material.restDensity;
      m.stiffness = this.material.stiffness;
      m.nearStiffness = this.material.nearStiffness;
      m.kernelRadius = this.material.kernelRadius;
      m.pointSize = this.material.pointSize;
      m.gravX = this.material.gravX;
      m.gravY = this.material.gravY;
      m.dt = this.material.dt;
      m.springStiffness = this.material.springStiffness;
      m.plasticity = this.material.plasticity;
      m.yieldRatio = this.material.yieldRatio;
      m.minDistRatio = this.material.minDistRatio;
      m.linViscosity = this.material.linViscosity;
      m.quadViscosity = this.material.quadViscosity;
      m.maxPressure = this.material.maxPressure;
    }
  }

  addParticles(count) {
    const materialCount = this.getMaterialCount();

    for (let i = 0; i < count; i++) {
      const posX = Math.random() * this.width;
      const posY = Math.random() * this.height;
      const velX = Math.random() * 2 - 1;
      const velY = Math.random() * 2 - 1;
      const materialId = i % materialCount;

      this.particles.push(new Particle(posX, posY, velX, velY, materialId));
    }
  }

  emitParticles() {
    const emitRate = 10;
    const materialId = Math.max(0, Math.min(this.getMaterialCount() - 1, this.emitMaterialId));

    for (let i = 0; i < emitRate; i++) {
      const posX = this.mouseX + Math.random() * 10 - 5;
      const posY = this.mouseY + Math.random() * 10 - 5;
      const velX = Math.random() * 2 - 1;
      const velY = Math.random() * 2 - 1;

      this.particles.push(new Particle(posX, posY, velX, velY, materialId));
    }
  }

  drainParticles() {
    let numParticles = this.particles.length;
    const affectedIds = [];

    for (let i = 0; i < numParticles; i++) {
      const p = this.particles[i];

      const dx = p.posX - this.mouseX;
      const dy = p.posY - this.mouseY;
      const distSq = dx * dx + dy * dy;

      if (distSq < 10000) {
        affectedIds.push(i);
        affectedIds.push(numParticles - 1);
        moveParticleData(p, this.particles[numParticles - 1]);
        numParticles--;
      }
    }

    this.particles.length = numParticles;

    for (let p of this.particles) {
      for (let i of affectedIds) {
        delete p.springs[i];
      }
    }
  }

  draw(ctx) {
    ctx.save();

    const pointSize = this.material.pointSize;
    ctx.translate(-0.5 * pointSize, -0.5 * pointSize);

    for (let p of this.particles) {
      const mat = this.getParticleMaterial(p);
      ctx.fillStyle = mat.color;
      ctx.fillRect(p.posX, p.posY, pointSize, pointSize);
    }

    ctx.restore();
  }

  applyCursorHoverForce(mouseVelX, mouseVelY, dt) {
    const mouseSpeedSq = mouseVelX * mouseVelX + mouseVelY * mouseVelY;
    if (mouseSpeedSq < 0.0001) {
      return;
    }

    const mouseSpeed = Math.sqrt(mouseSpeedSq);
    const cappedSpeed = Math.min(mouseSpeed, this.hoverMaxSpeed);

    if (cappedSpeed <= 0.0001) {
      return;
    }

    const dirX = mouseVelX / mouseSpeed;
    const dirY = mouseVelY / mouseSpeed;

    const radius = this.hoverRadius;
    const radiusSq = radius * radius;
    const baseStrength = this.hoverStrength * cappedSpeed * dt;

    for (let p of this.particles) {
      if (this.hoverLowerHalfOnly && p.posY < this.height * 0.45) {
        continue;
      }

      const dx = p.posX - this.mouseX;
      const dy = p.posY - this.mouseY;
      const distSq = dx * dx + dy * dy;

      if (distSq <= 0.0001 || distSq > radiusSq) {
        continue;
      }

      const dist = Math.sqrt(distSq);
      const t = 1 - dist / radius;
      const falloff = Math.pow(t, this.hoverFalloffPower);

      const invMass = 1 / this.getParticleMass(p);
      const push = baseStrength * falloff * invMass;

      p.velX += dirX * push;
      p.velY += dirY * push;
    }
  }

  update() {
    this.syncSharedMaterialSettings();

    this.screenMoveSmootherX += window.screenX - this.screenX;
    this.screenMoveSmootherY += window.screenY - this.screenY;
    this.screenX = window.screenX;
    this.screenY = window.screenY;

    const maxScreenMove = 50;
    const screenMoveX =
      this.screenMoveSmootherX > maxScreenMove ? maxScreenMove :
        this.screenMoveSmootherX < -maxScreenMove ? -maxScreenMove :
          this.screenMoveSmootherX;

    const screenMoveY =
      this.screenMoveSmootherY > maxScreenMove ? maxScreenMove :
        this.screenMoveSmootherY < -maxScreenMove ? -maxScreenMove :
          this.screenMoveSmootherY;

    this.screenMoveSmootherX -= screenMoveX;
    this.screenMoveSmootherY -= screenMoveY;

    const mouseVelX = this.mouseX - this.mousePrevX;
    const mouseVelY = this.mouseY - this.mousePrevY;
    this.mousePrevX = this.mouseX;
    this.mousePrevY = this.mouseY;

    if (!this.running) {
      return;
    }

    if (this.emit) {
      this.emitParticles();
    }

    if (this.drain) {
      this.drainParticles();
    }

    this.populateHashGrid();

    const dt = this.material.dt;
    const kernelRadius = this.material.kernelRadius;

    const gravX = 0.02 * kernelRadius * this.material.gravX * dt;
    const gravY = 0.02 * kernelRadius * this.material.gravY * dt;

    let mouseField = this.attract ? 0.01 * kernelRadius : 0;
    mouseField -= this.repel ? 0.01 * kernelRadius : 0;
    const mouseFieldNonZero = mouseField !== 0;

    for (let p of this.particles) {
      const invMass = 1 / this.getParticleMass(p);

      p.velX += gravX * invMass;
      p.velY += gravY * invMass;

      if (mouseFieldNonZero) {
        let dx = p.posX - this.mouseX;
        let dy = p.posY - this.mouseY;
        const distSq = dx * dx + dy * dy;

        if (distSq < 100000 && distSq > 0.1) {
          const dist = Math.sqrt(distSq);
          const invDist = 1 / dist;

          dx *= invDist;
          dy *= invDist;

          p.velX -= mouseField * dx * invMass;
          p.velY -= mouseField * dy * invMass;
        }
      }

      p.posX -= screenMoveX;
      p.posY -= screenMoveY;
    }

    this.applyCursorHoverForce(mouseVelX, mouseVelY, dt);

    this.applyMaterialAttraction(dt);
    this.applyViscosity(dt);

    for (let p of this.particles) {
      p.prevX = p.posX;
      p.prevY = p.posY;

      p.posX += p.velX * dt;
      p.posY += p.velY * dt;
    }

    this.applySpringDisplacements(dt);
    this.doubleDensityRelaxation(dt);
    this.resolveCollisions(dt);

    const dtInv = 1 / dt;

    for (let p of this.particles) {
      p.velX = (p.posX - p.prevX) * dtInv;
      p.velY = (p.posY - p.prevY) * dtInv;

      p.velX *= 0.995;
      p.velY *= 0.995;
    }
  }

  applyMaterialAttraction(dt) {
    if (this.attractSame === 0 && this.attractDifferent === 0) {
      return;
    }

    const kernelRadius = this.material.kernelRadius;
    const kernelRadiusSq = kernelRadius * kernelRadius;
    const kernelRadiusInv = 1 / kernelRadius;
    const visitedBuckets = [];

    const strengthScale = 0.015 * dt;
    const maxPairForce = 0.08 * dt;

    for (let abIdx = 0; abIdx < this.numActiveBuckets; abIdx++) {
      let selfIdx = this.particleListHeads[this.activeBuckets[abIdx]];

      while (selfIdx !== -1) {
        const p0 = this.particles[selfIdx];
        const bucketX = Math.floor(p0.posX * kernelRadiusInv);
        const bucketY = Math.floor(p0.posY * kernelRadiusInv);

        let numVisitedBuckets = 0;

        for (let bucketDX = -1; bucketDX <= 1; bucketDX++) {
          for (let bucketDY = -1; bucketDY <= 1; bucketDY++) {
            const bucketIdx = this.getHashBucketIdx(bucketX + bucketDX, bucketY + bucketDY);

            let found = false;
            for (let k = 0; k < numVisitedBuckets; k++) {
              if (visitedBuckets[k] === bucketIdx) {
                found = true;
                break;
              }
            }

            if (found) {
              continue;
            }

            visitedBuckets[numVisitedBuckets++] = bucketIdx;

            let neighborIdx = this.particleListHeads[bucketIdx];

            while (neighborIdx !== -1) {
              if (neighborIdx <= selfIdx) {
                neighborIdx = this.particleListNextIdx[neighborIdx];
                continue;
              }

              const p1 = this.particles[neighborIdx];

              const diffX = p1.posX - p0.posX;
              const diffY = p1.posY - p0.posY;

              if (diffX > kernelRadius || diffX < -kernelRadius || diffY > kernelRadius || diffY < -kernelRadius) {
                neighborIdx = this.particleListNextIdx[neighborIdx];
                continue;
              }

              const rSq = diffX * diffX + diffY * diffY;
              if (rSq > 0.0001 && rSq < kernelRadiusSq) {
                const r = Math.sqrt(rSq);
                const q = r * kernelRadiusInv;
                const closeness = 1 - q;

                const same = p0.materialId === p1.materialId;
                let strength = same ? this.attractSame : this.attractDifferent;

                const falloff = closeness * (1 - 0.85 * closeness);
                strength *= strengthScale;

                let force = strength * falloff;
                if (force > maxPairForce) force = maxPairForce;
                if (force < -maxPairForce) force = -maxPairForce;

                if (force !== 0) {
                  const nx = diffX / r;
                  const ny = diffY / r;

                  const invMass0 = 1 / this.getParticleMass(p0);
                  const invMass1 = 1 / this.getParticleMass(p1);

                  const fx = nx * force;
                  const fy = ny * force;

                  p0.velX += fx * invMass0;
                  p0.velY += fy * invMass0;
                  p1.velX -= fx * invMass1;
                  p1.velY -= fy * invMass1;
                }
              }

              neighborIdx = this.particleListNextIdx[neighborIdx];
            }
          }
        }

        selfIdx = this.particleListNextIdx[selfIdx];
      }
    }
  }

  doubleDensityRelaxation(dt) {
    const kernelRadius = this.material.kernelRadius;
    const kernelRadiusSq = kernelRadius * kernelRadius;
    const kernelRadiusInv = 1 / kernelRadius;

    const restDensity = this.material.restDensity;
    const stiffness = this.material.stiffness * dt * dt;
    const nearStiffness = this.material.nearStiffness * dt * dt;
    const minDist = this.material.minDistRatio * kernelRadius;

    const neighbors = [];
    const neighborUnitX = [];
    const neighborUnitY = [];
    const neighborCloseness = [];
    const visitedBuckets = [];

    const minX = 5;
    const maxX = this.width - 5;
    const minY = 5;
    const maxY = this.height - 5;

    for (let abIdx = 0; abIdx < this.numActiveBuckets; abIdx++) {
      let selfIdx = this.particleListHeads[this.activeBuckets[abIdx]];

      while (selfIdx !== -1) {
        const p0 = this.particles[selfIdx];

        let density = 0;
        let nearDensity = 0;
        let numNeighbors = 0;
        let numVisitedBuckets = 0;

        const bucketX = Math.floor(p0.posX * kernelRadiusInv);
        const bucketY = Math.floor(p0.posY * kernelRadiusInv);

        for (let bucketDX = -1; bucketDX <= 1; bucketDX++) {
          for (let bucketDY = -1; bucketDY <= 1; bucketDY++) {
            const bucketIdx = this.getHashBucketIdx(bucketX + bucketDX, bucketY + bucketDY);

            let found = false;
            for (let k = 0; k < numVisitedBuckets; k++) {
              if (visitedBuckets[k] === bucketIdx) {
                found = true;
                break;
              }
            }

            if (found) {
              continue;
            }

            visitedBuckets[numVisitedBuckets++] = bucketIdx;

            let neighborIdx = this.particleListHeads[bucketIdx];

            while (neighborIdx !== -1) {
              if (neighborIdx === selfIdx) {
                neighborIdx = this.particleListNextIdx[neighborIdx];
                continue;
              }

              const p1 = this.particles[neighborIdx];

              const diffX = p1.posX - p0.posX;
              const diffY = p1.posY - p0.posY;

              if (diffX > kernelRadius || diffX < -kernelRadius || diffY > kernelRadius || diffY < -kernelRadius) {
                neighborIdx = this.particleListNextIdx[neighborIdx];
                continue;
              }

              const rSq = diffX * diffX + diffY * diffY;

              if (rSq > 0.0001 && rSq < kernelRadiusSq) {
                const r = Math.sqrt(rSq);
                const closeness = 1 - r * kernelRadiusInv;
                const closenessSq = closeness * closeness;

                density += closenessSq;
                nearDensity += closenessSq * closeness;

                neighbors[numNeighbors] = p1;
                neighborUnitX[numNeighbors] = diffX / r;
                neighborUnitY[numNeighbors] = diffY / r;
                neighborCloseness[numNeighbors] = closeness;
                numNeighbors++;

                const addSprings = this.material.springStiffness > 0;
                if (addSprings && selfIdx < neighborIdx && r > minDist && !p0.springs[neighborIdx]) {
                  p0.springs[neighborIdx] = r;
                }
              }

              neighborIdx = this.particleListNextIdx[neighborIdx];
            }
          }
        }

        const leftDist = p0.posX - minX;
        if (leftDist < kernelRadius) {
          const closeness = 1 - Math.max(0, leftDist) * kernelRadiusInv;
          const closenessSq = closeness * closeness;
          density += closenessSq;
          nearDensity += closenessSq * closeness;
        }

        const rightDist = maxX - p0.posX;
        if (rightDist < kernelRadius) {
          const closeness = 1 - Math.max(0, rightDist) * kernelRadiusInv;
          const closenessSq = closeness * closeness;
          density += closenessSq;
          nearDensity += closenessSq * closeness;
        }

        const topDist = p0.posY - minY;
        if (topDist < kernelRadius) {
          const closeness = 1 - Math.max(0, topDist) * kernelRadiusInv;
          const closenessSq = closeness * closeness;
          density += closenessSq;
          nearDensity += closenessSq * closeness;
        }

        const bottomDist = maxY - p0.posY;
        if (bottomDist < kernelRadius) {
          const closeness = 1 - Math.max(0, bottomDist) * kernelRadiusInv;
          const closenessSq = closeness * closeness;
          density += closenessSq;
          nearDensity += closenessSq * closeness;
        }

        let pressure = stiffness * (density - restDensity);
        let nearPressure = nearStiffness * nearDensity;

        if (pressure < 0) pressure = 0;
        if (pressure > this.material.maxPressure) pressure = this.material.maxPressure;
        if (nearPressure > this.material.maxPressure) nearPressure = this.material.maxPressure;

        let dispX = 0;
        let dispY = 0;

        for (let j = 0; j < numNeighbors; j++) {
          const p1 = neighbors[j];
          const closeness = neighborCloseness[j];
          const D = (pressure * closeness + nearPressure * closeness * closeness) * 0.5;
          const DX = D * neighborUnitX[j];
          const DY = D * neighborUnitY[j];

          p1.posX += DX;
          p1.posY += DY;

          dispX -= DX;
          dispY -= DY;
        }

        if (leftDist < kernelRadius) {
          const closeness = 1 - Math.max(0, leftDist) * kernelRadiusInv;
          const D = pressure * closeness + nearPressure * closeness * closeness;
          dispX += D;
        }

        if (rightDist < kernelRadius) {
          const closeness = 1 - Math.max(0, rightDist) * kernelRadiusInv;
          const D = pressure * closeness + nearPressure * closeness * closeness;
          dispX -= D;
        }

        if (topDist < kernelRadius) {
          const closeness = 1 - Math.max(0, topDist) * kernelRadiusInv;
          const D = pressure * closeness + nearPressure * closeness * closeness;
          dispY += D;
        }

        if (bottomDist < kernelRadius) {
          const closeness = 1 - Math.max(0, bottomDist) * kernelRadiusInv;
          const D = pressure * closeness + nearPressure * closeness * closeness;
          dispY -= D;
        }

        p0.posX += dispX;
        p0.posY += dispY;

        selfIdx = this.particleListNextIdx[selfIdx];
      }
    }
  }

  getHashBucketIdx(bucketX, bucketY) {
    const h = ((bucketX * 92837111) ^ (bucketY * 689287499));
    return Math.abs(h) % this.numHashBuckets;
  }

  populateHashGrid() {
    for (let i = 0; i < this.numHashBuckets; i++) {
      this.particleListHeads[i] = -1;
    }

    this.numActiveBuckets = 0;

    const bucketSize = this.material.kernelRadius;
    const bucketSizeInv = 1 / bucketSize;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      const bucketX = Math.floor(p.posX * bucketSizeInv);
      const bucketY = Math.floor(p.posY * bucketSizeInv);

      const bucketIdx = this.getHashBucketIdx(bucketX, bucketY);
      const headIdx = this.particleListHeads[bucketIdx];

      if (headIdx === -1) {
        this.activeBuckets[this.numActiveBuckets++] = bucketIdx;
      }

      this.particleListNextIdx[i] = headIdx;
      this.particleListHeads[bucketIdx] = i;
    }
  }

  applySpringDisplacements(dt) {
    if (this.material.springStiffness === 0) {
      return;
    }

    const kernelRadius = this.material.kernelRadius;
    const kernelRadiusInv = 1 / kernelRadius;
    const springStiffness = this.material.springStiffness * dt * dt;
    const plasticity = this.material.plasticity * dt;
    const yieldRatio = this.material.yieldRatio;
    const minDist = this.material.minDistRatio * kernelRadius;

    for (let particle of this.particles) {
      for (let springIdx of Object.keys(particle.springs)) {
        let restLength = particle.springs[springIdx];
        const springParticle = this.particles[springIdx];

        let dx = particle.posX - springParticle.posX;
        let dy = particle.posY - springParticle.posY;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 0.0001) {
          continue;
        }

        const tolerableDeformation = yieldRatio * restLength;

        if (dist > restLength + tolerableDeformation) {
          restLength = restLength + plasticity * (dist - restLength - tolerableDeformation);
          particle.springs[springIdx] = restLength;
        } else if (dist < restLength - tolerableDeformation && dist > minDist) {
          restLength = restLength - plasticity * (restLength - tolerableDeformation - dist);
          particle.springs[springIdx] = restLength;
        }

        if (restLength < minDist) {
          restLength = minDist;
          particle.springs[springIdx] = restLength;
        }

        if (restLength > kernelRadius) {
          delete particle.springs[springIdx];
          continue;
        }

        const D = springStiffness * (1 - restLength * kernelRadiusInv) * (dist - restLength) / dist;
        dx *= D;
        dy *= D;

        particle.posX -= dx;
        particle.posY -= dy;

        springParticle.posX += dx;
        springParticle.posY += dy;
      }
    }
  }

  applyViscosity(dt) {
    if (this.material.linViscosity === 0 && this.material.quadViscosity === 0) {
      return;
    }

    const visitedBuckets = [];
    const kernelRadius = this.material.kernelRadius;
    const kernelRadiusSq = kernelRadius * kernelRadius;
    const kernelRadiusInv = 1 / kernelRadius;

    const linViscosity = this.material.linViscosity * dt;
    const quadViscosity = this.material.quadViscosity * dt;

    for (let abIdx = 0; abIdx < this.numActiveBuckets; abIdx++) {
      let selfIdx = this.particleListHeads[this.activeBuckets[abIdx]];

      while (selfIdx !== -1) {
        const p0 = this.particles[selfIdx];
        let numVisitedBuckets = 0;

        const bucketX = Math.floor(p0.posX * kernelRadiusInv);
        const bucketY = Math.floor(p0.posY * kernelRadiusInv);

        for (let bucketDX = -1; bucketDX <= 1; bucketDX++) {
          for (let bucketDY = -1; bucketDY <= 1; bucketDY++) {
            const bucketIdx = this.getHashBucketIdx(bucketX + bucketDX, bucketY + bucketDY);

            let found = false;
            for (let k = 0; k < numVisitedBuckets; k++) {
              if (visitedBuckets[k] === bucketIdx) {
                found = true;
                break;
              }
            }

            if (found) {
              continue;
            }

            visitedBuckets[numVisitedBuckets++] = bucketIdx;

            let neighborIdx = this.particleListHeads[bucketIdx];

            while (neighborIdx !== -1) {
              if (neighborIdx === selfIdx) {
                neighborIdx = this.particleListNextIdx[neighborIdx];
                continue;
              }

              const p1 = this.particles[neighborIdx];

              const diffX = p1.posX - p0.posX;
              const diffY = p1.posY - p0.posY;

              if (diffX > kernelRadius || diffX < -kernelRadius || diffY > kernelRadius || diffY < -kernelRadius) {
                neighborIdx = this.particleListNextIdx[neighborIdx];
                continue;
              }

              const rSq = diffX * diffX + diffY * diffY;

              if (rSq > 0.0001 && rSq < kernelRadiusSq) {
                const r = Math.sqrt(rSq);
                const closeness = 1 - r * kernelRadiusInv;

                const dx = diffX / r;
                const dy = diffY / r;
                let inwardVel = ((p0.velX - p1.velX) * dx + (p0.velY - p1.velY) * dy);

                if (inwardVel > 1) {
                  inwardVel = 1;
                }

                if (inwardVel > 0) {
                  const I = closeness * (linViscosity * inwardVel + quadViscosity * inwardVel * inwardVel) * 0.5;
                  const IX = I * dx;
                  const IY = I * dy;
                  p0.velX -= IX;
                  p0.velY -= IY;
                  p1.velX += IX;
                  p1.velY += IY;
                }
              }

              neighborIdx = this.particleListNextIdx[neighborIdx];
            }
          }
        }

        selfIdx = this.particleListNextIdx[selfIdx];
      }
    }
  }

  resolveCollisions(dt) {
    const margin = Math.max(5, this.material.pointSize * 0.5 + 1);
    const minX = margin;
    const maxX = this.width - margin;
    const minY = margin;
    const maxY = this.height - margin;

    const bounce = 0.0;

    for (let p of this.particles) {
      let vx = p.posX - p.prevX;
      let vy = p.posY - p.prevY;

      if (p.posX < minX) {
        p.posX = minX;
        if (vx < 0) vx = -vx * bounce;
        else vx = 0;
        p.prevX = p.posX - vx;
      } else if (p.posX > maxX) {
        p.posX = maxX;
        if (vx > 0) vx = -vx * bounce;
        else vx = 0;
        p.prevX = p.posX - vx;
      }

      if (p.posY < minY) {
        p.posY = minY;
        if (vy < 0) vy = -vy * bounce;
        else vy = 0;
        p.prevY = p.posY - vy;
      } else if (p.posY > maxY) {
        p.posY = maxY;
        if (vy > 0) vy = -vy * bounce;
        else vy = 0;
        p.prevY = p.posY - vy;
      }
    }
  }
}