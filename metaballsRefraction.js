class MetaballsRenderer {
  constructor(gl, canvas) {
    this.gl = gl;
    this.canvas = canvas;
    this.width = 0;
    this.height = 0;

    // Framebuffers and textures
    this.metaballsFramebuffer = null;
    this.blurFramebuffer1 = null;
    this.blurFramebuffer2 = null;

    // Fallback black texture if no background is provided
    this.fallbackTexture = null;

    // Shader programs
    this.metaballsProgram = null;
    this.blurProgram = null;
    this.refractionProgram = null;

    // Buffers
    this.quadBuffer = null;

    this.setupShaders();
    this.setupBuffers();
    this.resize(canvas.width, canvas.height);
    this.createFallbackTexture();
  }

  createShader(type, source) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error("Shader compilation error:", this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  createProgram(vsSource, fsSource) {
    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vsSource);
    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fsSource);

    if (!vertexShader || !fragmentShader) {
      return null;
    }

    const program = this.gl.createProgram();
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      console.error("Program linking error:", this.gl.getProgramInfoLog(program));
      this.gl.deleteProgram(program);
      return null;
    }

    return program;
  }

  setupShaders() {
    const metaballsVS = `
      attribute vec2 a_position;
      attribute float a_material;
      uniform vec2 u_resolution;
      uniform float u_pointSize;
      varying float v_material;

      void main() {
        vec2 clipSpace = (a_position / u_resolution) * 2.0 - 1.0;
        gl_Position = vec4(clipSpace * vec2(1.0, -1.0), 0.0, 1.0);
        gl_PointSize = u_pointSize;
        v_material = a_material;
      }
    `;

    const metaballsFS = `
      precision highp float;
      varying float v_material;

      void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);

        if (dist > 0.5) {
          discard;
        }

        float intensity = 1.0 - smoothstep(0.0, 0.5, dist);

        vec4 color = vec4(0.0);
        int mat = int(v_material);

        if (mat == 0) color.r = intensity;
        else if (mat == 1) color.g = intensity;
        else if (mat == 2) color.b = intensity;
        else if (mat == 3) color.a = intensity;

        gl_FragColor = color;
      }
    `;

    const blurVS = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;

      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = (a_position + 1.0) * 0.5;
      }
    `;

    const blurFS = `
      precision highp float;
      uniform sampler2D u_texture;
      uniform vec2 u_texelSize;
      uniform vec2 u_direction;
      varying vec2 v_texCoord;

      void main() {
        vec4 result = texture2D(u_texture, v_texCoord) * 0.159577;

        vec2 stepDir = u_direction * u_texelSize;

        vec2 offset0 = 1.440405 * stepDir;
        result += texture2D(u_texture, v_texCoord + offset0) * 0.263184;
        result += texture2D(u_texture, v_texCoord - offset0) * 0.263184;

        vec2 offset1 = 3.372549 * stepDir;
        result += texture2D(u_texture, v_texCoord + offset1) * 0.125589;
        result += texture2D(u_texture, v_texCoord - offset1) * 0.125589;

        vec2 offset2 = 5.311321 * stepDir;
        result += texture2D(u_texture, v_texCoord + offset2) * 0.035136;
        result += texture2D(u_texture, v_texCoord - offset2) * 0.035136;

        vec2 offset3 = 7.259259 * stepDir;
        result += texture2D(u_texture, v_texCoord + offset3) * 0.005827;
        result += texture2D(u_texture, v_texCoord - offset3) * 0.005827;

        gl_FragColor = result;
      }
    `;

    const refractionVS = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;

      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = (a_position + 1.0) * 0.5;
      }
    `;

    const refractionFS = `
      precision highp float;
      uniform sampler2D u_metaballs;
      uniform sampler2D u_background;
      uniform vec2 u_resolution;
      uniform float u_threshold;
      uniform float u_refractionStrength;
      uniform float u_chromaticAberration;
      uniform vec3 u_color0;
      uniform vec3 u_color1;
      uniform vec3 u_color2;
      uniform vec3 u_color3;
      uniform float u_lightIntensity;
      uniform float u_absorption;
      uniform int u_materialMode;
      varying vec2 v_texCoord;

      vec3 ACESFilm(vec3 x) {
        float a = 2.51;
        float b = 0.03;
        float c = 2.43;
        float d = 0.59;
        float e = 0.14;
        return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
      }

      float DistributionGGX(vec3 N, vec3 H, float roughness) {
        float a = roughness * roughness;
        float a2 = a * a;
        float NdotH = max(dot(N, H), 0.0);
        float NdotH2 = NdotH * NdotH;

        float num = a2;
        float denom = (NdotH2 * (a2 - 1.0) + 1.0);
        denom = 3.14159265 * denom * denom;

        return num / denom;
      }

      float GeometrySchlickGGX(float NdotV, float roughness) {
        float r = roughness + 1.0;
        float k = (r * r) / 8.0;

        float num = NdotV;
        float denom = NdotV * (1.0 - k) + k;

        return num / denom;
      }

      float GeometrySmith(vec3 N, vec3 V, vec3 L, float roughness) {
        float NdotV = max(dot(N, V), 0.0);
        float NdotL = max(dot(N, L), 0.0);
        float ggx2 = GeometrySchlickGGX(NdotV, roughness);
        float ggx1 = GeometrySchlickGGX(NdotL, roughness);
        return ggx1 * ggx2;
      }

      vec3 fresnelSchlick(float cosTheta, vec3 F0) {
        return F0 + (1.0 - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
      }

      void main() {
        vec4 metaball = texture2D(u_metaballs, v_texCoord);
        float maxIntensity = max(max(metaball.r, metaball.g), max(metaball.b, metaball.a));

        if (maxIntensity < u_threshold) {
          vec3 bg = texture2D(u_background, v_texCoord).rgb;
          gl_FragColor = vec4(bg, 1.0);
          return;
        }

        vec2 texelSize = 1.0 / u_resolution;
        vec4 left = texture2D(u_metaballs, v_texCoord - vec2(texelSize.x, 0.0));
        vec4 right = texture2D(u_metaballs, v_texCoord + vec2(texelSize.x, 0.0));
        vec4 top = texture2D(u_metaballs, v_texCoord - vec2(0.0, texelSize.y));
        vec4 bottom = texture2D(u_metaballs, v_texCoord + vec2(0.0, texelSize.y));

        float leftMax = max(max(left.r, left.g), max(left.b, left.a));
        float rightMax = max(max(right.r, right.g), max(right.b, right.a));
        float topMax = max(max(top.r, top.g), max(top.b, top.a));
        float bottomMax = max(max(bottom.r, bottom.g), max(bottom.b, bottom.a));

        vec2 gradient = vec2(rightMax - leftMax, bottomMax - topMax);
        vec3 normal = normalize(vec3(gradient * 2.0, 1.0));

        float normalizedHeight = smoothstep(u_threshold, 1.0, maxIntensity);

        float normalMagnitude = length(gradient);
        float surfaceAngle = atan(normalMagnitude);
        float liquidRI = 1.33;

        float refractionStrength = sin(surfaceAngle) * (liquidRI - 1.0) / liquidRI;
        refractionStrength = clamp(refractionStrength, 0.0, 1.0);

        float refractionAmount = u_refractionStrength * refractionStrength;
        vec2 baseRefraction = gradient * refractionAmount;

        float redShift = 0.98;
        float greenShift = 1.0;
        float blueShift = 1.02;

        vec2 chromaticOffset = gradient * u_chromaticAberration * refractionStrength;

        vec2 redCoord = clamp(v_texCoord + baseRefraction * redShift - chromaticOffset, 0.0, 1.0);
        vec2 greenCoord = clamp(v_texCoord + baseRefraction * greenShift, 0.0, 1.0);
        vec2 blueCoord = clamp(v_texCoord + baseRefraction * blueShift + chromaticOffset, 0.0, 1.0);

        vec3 refractedColor = vec3(
          texture2D(u_background, redCoord).r,
          texture2D(u_background, greenCoord).g,
          texture2D(u_background, blueCoord).b
        );

        vec3 baseColor;
        if (metaball.r > metaball.g && metaball.r > metaball.b && metaball.r > metaball.a) {
          baseColor = u_color0;
        } else if (metaball.g > metaball.b && metaball.g > metaball.a) {
          baseColor = u_color1;
        } else if (metaball.b > metaball.a) {
          baseColor = u_color2;
        } else {
          baseColor = u_color3;
        }

        float roughness;
        float metallic;
        float materialOpacity;

        if (u_materialMode == 0) {
          roughness = 0.04;
          metallic = 0.0;
          materialOpacity = 0.55;
        } else if (u_materialMode == 1) {
          roughness = 0.1;
          metallic = 0.9;
          materialOpacity = 1.0;
        } else {
          roughness = 0.8;
          metallic = 0.0;
          materialOpacity = 0.95;
        }

        float absorption = normalizedHeight * u_absorption;
        vec3 absorptionColor = mix(vec3(1.0), baseColor, absorption);
        vec3 transmittedColor = refractedColor * absorptionColor;

        vec3 lightDir = normalize(vec3(0.5, 0.8, 1.0));
        vec3 viewDir = vec3(0.0, 0.0, 1.0);
        vec3 halfwayDir = normalize(lightDir + viewDir);

        vec3 F0 = vec3(0.04);
        F0 = mix(F0, baseColor, metallic);

        vec3 lightColor = vec3(u_lightIntensity, u_lightIntensity * 0.9, u_lightIntensity * 0.75);
        vec3 radiance = lightColor;

        float NDF = DistributionGGX(normal, halfwayDir, roughness);
        float G = GeometrySmith(normal, viewDir, lightDir, roughness);
        vec3 F = fresnelSchlick(max(dot(halfwayDir, viewDir), 0.0), F0);

        vec3 kS = F;
        vec3 kD = vec3(1.0) - kS;
        kD *= 1.0 - metallic;

        vec3 numerator = NDF * G * F;
        float denominator = 4.0 * max(dot(normal, viewDir), 0.0) * max(dot(normal, lightDir), 0.0) + 0.0001;
        vec3 specular = numerator / denominator;

        float NdotL = max(dot(normal, lightDir), 0.0);
        vec3 Lo = (kD * baseColor / 3.14159265 + specular) * radiance * NdotL;

      vec3 ambient = vec3(0.12) * baseColor;
      vec3 color = ambient + Lo;

        float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.0);
        float surfaceAlpha = smoothstep(u_threshold, u_threshold + 0.2, maxIntensity);
        float blendFactor = surfaceAlpha * (materialOpacity + (1.0 - materialOpacity) * fresnel);

        vec3 finalColor = mix(transmittedColor, color, blendFactor);

        float rim = 1.0 - max(dot(normal, viewDir), 0.0);
        rim = pow(rim, 2.0);
        finalColor += baseColor * rim * 0.2 * normalizedHeight;

        finalColor *= 4.4;
        finalColor = ACESFilm(finalColor);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    this.metaballsProgram = this.createProgram(metaballsVS, metaballsFS);
    this.blurProgram = this.createProgram(blurVS, blurFS);
    this.refractionProgram = this.createProgram(refractionVS, refractionFS);

    this.getUniformLocations();
  }

  getUniformLocations() {
    this.metaballsUniforms = {
      resolution: this.gl.getUniformLocation(this.metaballsProgram, "u_resolution"),
      pointSize: this.gl.getUniformLocation(this.metaballsProgram, "u_pointSize")
    };

    this.metaballsAttribs = {
      position: this.gl.getAttribLocation(this.metaballsProgram, "a_position"),
      material: this.gl.getAttribLocation(this.metaballsProgram, "a_material")
    };

    this.blurUniforms = {
      texture: this.gl.getUniformLocation(this.blurProgram, "u_texture"),
      texelSize: this.gl.getUniformLocation(this.blurProgram, "u_texelSize"),
      direction: this.gl.getUniformLocation(this.blurProgram, "u_direction")
    };

    this.blurAttribs = {
      position: this.gl.getAttribLocation(this.blurProgram, "a_position")
    };

    this.refractionUniforms = {
      metaballs: this.gl.getUniformLocation(this.refractionProgram, "u_metaballs"),
      background: this.gl.getUniformLocation(this.refractionProgram, "u_background"),
      resolution: this.gl.getUniformLocation(this.refractionProgram, "u_resolution"),
      threshold: this.gl.getUniformLocation(this.refractionProgram, "u_threshold"),
      refractionStrength: this.gl.getUniformLocation(this.refractionProgram, "u_refractionStrength"),
      chromaticAberration: this.gl.getUniformLocation(this.refractionProgram, "u_chromaticAberration"),
      lightIntensity: this.gl.getUniformLocation(this.refractionProgram, "u_lightIntensity"),
      absorption: this.gl.getUniformLocation(this.refractionProgram, "u_absorption"),
      materialMode: this.gl.getUniformLocation(this.refractionProgram, "u_materialMode"),
      color0: this.gl.getUniformLocation(this.refractionProgram, "u_color0"),
      color1: this.gl.getUniformLocation(this.refractionProgram, "u_color1"),
      color2: this.gl.getUniformLocation(this.refractionProgram, "u_color2"),
      color3: this.gl.getUniformLocation(this.refractionProgram, "u_color3")
    };

    this.refractionAttribs = {
      position: this.gl.getAttribLocation(this.refractionProgram, "a_position")
    };
  }

  setupBuffers() {
    const quadVertices = new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1
    ]);

    this.quadBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quadBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, quadVertices, this.gl.STATIC_DRAW);
  }

  createFramebuffer(width, height) {
    const framebuffer = this.gl.createFramebuffer();
    const texture = this.gl.createTexture();

    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, width, height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, framebuffer);
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, texture, 0);

    return { framebuffer, texture };
  }

  createFallbackTexture() {
    this.fallbackTexture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.fallbackTexture);

    const pixel = new Uint8Array([0, 0, 0, 255]);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      1,
      1,
      0,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      pixel
    );

    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
  }

  resize(width, height) {
    this.width = width;
    this.height = height;

    if (this.metaballsFramebuffer) {
      this.gl.deleteFramebuffer(this.metaballsFramebuffer.framebuffer);
      this.gl.deleteTexture(this.metaballsFramebuffer.texture);
    }

    if (this.blurFramebuffer1) {
      this.gl.deleteFramebuffer(this.blurFramebuffer1.framebuffer);
      this.gl.deleteTexture(this.blurFramebuffer1.texture);
    }

    if (this.blurFramebuffer2) {
      this.gl.deleteFramebuffer(this.blurFramebuffer2.framebuffer);
      this.gl.deleteTexture(this.blurFramebuffer2.texture);
    }

    this.metaballsFramebuffer = this.createFramebuffer(width, height);
    this.blurFramebuffer1 = this.createFramebuffer(width, height);
    this.blurFramebuffer2 = this.createFramebuffer(width, height);

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
  }

  beginMetaballsRender(pointSize) {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.metaballsFramebuffer.framebuffer);
    this.gl.viewport(0, 0, this.width, this.height);
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.ONE, this.gl.ONE);

    this.gl.useProgram(this.metaballsProgram);

    const rect = this.canvas.getBoundingClientRect();
    this.gl.uniform2f(this.metaballsUniforms.resolution, rect.width, rect.height);
    this.gl.uniform1f(this.metaballsUniforms.pointSize, pointSize);

    this.gl.enableVertexAttribArray(this.metaballsAttribs.position);
    this.gl.enableVertexAttribArray(this.metaballsAttribs.material);
  }

  renderMetaballsBatch(positionBuffer, materialBuffer, numParticles) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    this.gl.vertexAttribPointer(this.metaballsAttribs.position, 2, this.gl.FLOAT, false, 0, 0);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, materialBuffer);
    this.gl.vertexAttribPointer(this.metaballsAttribs.material, 1, this.gl.UNSIGNED_BYTE, false, 0, 0);

    this.gl.drawArrays(this.gl.POINTS, 0, numParticles);
  }

  endMetaballsRender() {
    this.gl.disableVertexAttribArray(this.metaballsAttribs.position);
    this.gl.disableVertexAttribArray(this.metaballsAttribs.material);
  }

  applyBlur() {
    this.gl.useProgram(this.blurProgram);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quadBuffer);
    this.gl.vertexAttribPointer(this.blurAttribs.position, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.blurAttribs.position);

    this.gl.uniform1i(this.blurUniforms.texture, 0);
    this.gl.uniform2f(this.blurUniforms.texelSize, 1.0 / this.width, 1.0 / this.height);

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.blurFramebuffer1.framebuffer);
    this.gl.viewport(0, 0, this.width, this.height);
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.metaballsFramebuffer.texture);
    this.gl.uniform2f(this.blurUniforms.direction, 1.0, 0.0);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.blurFramebuffer2.framebuffer);
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.gl.bindTexture(this.gl.TEXTURE_2D, this.blurFramebuffer1.texture);
    this.gl.uniform2f(this.blurUniforms.direction, 0.0, 1.0);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

    this.gl.disableVertexAttribArray(this.blurAttribs.position);
  }

  render({
    colors,
    backgroundTexture = null,
    threshold = 0.3,
    refractionStrength = 0.02,
    chromaticAberration = 0.003,
    lightIntensity = 2.0,
    absorption = 0.8,
    materialMode = "water"
  }) {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.gl.disable(this.gl.BLEND);

    this.gl.useProgram(this.refractionProgram);

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.blurFramebuffer2.texture);
    this.gl.uniform1i(this.refractionUniforms.metaballs, 0);

    this.gl.activeTexture(this.gl.TEXTURE1);
    this.gl.bindTexture(this.gl.TEXTURE_2D, backgroundTexture || this.fallbackTexture);
    this.gl.uniform1i(this.refractionUniforms.background, 1);

    const rect = this.canvas.getBoundingClientRect();
    this.gl.uniform2f(this.refractionUniforms.resolution, rect.width, rect.height);
    this.gl.uniform1f(this.refractionUniforms.threshold, threshold);
    this.gl.uniform1f(this.refractionUniforms.refractionStrength, refractionStrength);
    this.gl.uniform1f(this.refractionUniforms.chromaticAberration, chromaticAberration);
    this.gl.uniform1f(this.refractionUniforms.lightIntensity, lightIntensity);
    this.gl.uniform1f(this.refractionUniforms.absorption, absorption);

    let materialModeInt = 0;
    if (materialMode === "metal") materialModeInt = 1;
    else if (materialMode === "paint") materialModeInt = 2;

    this.gl.uniform1i(this.refractionUniforms.materialMode, materialModeInt);
    this.gl.uniform3fv(this.refractionUniforms.color0, colors[0]);
    this.gl.uniform3fv(this.refractionUniforms.color1, colors[1]);
    this.gl.uniform3fv(this.refractionUniforms.color2, colors[2]);
    this.gl.uniform3fv(this.refractionUniforms.color3, colors[3]);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quadBuffer);
    this.gl.vertexAttribPointer(this.refractionAttribs.position, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.refractionAttribs.position);

    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

    this.gl.disableVertexAttribArray(this.refractionAttribs.position);
  }

  destroy() {
    if (this.metaballsFramebuffer) {
      this.gl.deleteFramebuffer(this.metaballsFramebuffer.framebuffer);
      this.gl.deleteTexture(this.metaballsFramebuffer.texture);
    }

    if (this.blurFramebuffer1) {
      this.gl.deleteFramebuffer(this.blurFramebuffer1.framebuffer);
      this.gl.deleteTexture(this.blurFramebuffer1.texture);
    }

    if (this.blurFramebuffer2) {
      this.gl.deleteFramebuffer(this.blurFramebuffer2.framebuffer);
      this.gl.deleteTexture(this.blurFramebuffer2.texture);
    }

    if (this.fallbackTexture) {
      this.gl.deleteTexture(this.fallbackTexture);
    }

    if (this.quadBuffer) {
      this.gl.deleteBuffer(this.quadBuffer);
    }

    if (this.metaballsProgram) {
      this.gl.deleteProgram(this.metaballsProgram);
    }

    if (this.blurProgram) {
      this.gl.deleteProgram(this.blurProgram);
    }

    if (this.refractionProgram) {
      this.gl.deleteProgram(this.refractionProgram);
    }
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = MetaballsRenderer;
} else {
  window.MetaballsRenderer = MetaballsRenderer;
}