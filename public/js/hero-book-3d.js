/**
 * Athenaeum Antique 3D Interactive Codex
 * Features:
 * - Real 3D Hardcover Tome with Spine Hinge Physics
 * - Interactive Open / Close Front Cover with Aged Vellum Interior Pages
 * - Procedural Leather, Gold Leaf Filigree, and Calligraphy Textures
 * - Full 360 Orbit Controls & Mouse Parallax
 * - Candlelight Warm Illumination & Drifting Archival Embers
 */

(function () {
  const container = document.getElementById("book-3d-canvas");
  if (!container) return;

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  const width = container.clientWidth || 540;
  const height = container.clientHeight || 420;

  const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
  camera.position.set(0, 0.05, 6.6);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // Group that holds the entire book assembly
  const bookRoot = new THREE.Group();
  bookRoot.position.set(0, -0.05, 0);
  scene.add(bookRoot);

  const bookWidth = 2.2;
  const bookHeight = 3.1;
  const bookThickness = 0.5;
  const coverThickness = 0.07;

  // ----------------------------------------------------
  // Procedural Leather & Gold Leaf Cover Texture
  // ----------------------------------------------------
  function createCoverTexture(title = "ATHENAEUM", subtitle = "ARCHIVUM CODEX") {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1400;
    const ctx = canvas.getContext("2d");

    // Deep aged Moroccan leather (dark oxblood / mahogany gradient)
    const bgGrad = ctx.createRadialGradient(512, 700, 40, 512, 700, 750);
    bgGrad.addColorStop(0, "#28150d");
    bgGrad.addColorStop(0.5, "#1b0d07");
    bgGrad.addColorStop(1, "#100603");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1024, 1400);

    // Fine organic leather grain
    for (let i = 0; i < 45000; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1400;
      const alpha = Math.random() * 0.05;
      ctx.fillStyle = Math.random() > 0.5 ? `rgba(220,180,130,${alpha})` : `rgba(0,0,0,${alpha * 1.8})`;
      ctx.fillRect(x, y, 2, 2);
    }

    // Outer Gilded Filigree Border
    ctx.strokeStyle = "#c59a35";
    ctx.lineWidth = 16;
    ctx.strokeRect(65, 65, 894, 1270);

    // Inner Delicate Gold Rules
    ctx.strokeStyle = "#dfbb5b";
    ctx.lineWidth = 4;
    ctx.strokeRect(95, 95, 834, 1210);

    // Antique Corner Ornaments
    const drawCorner = (x, y, rot) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.strokeStyle = "#f3d274";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, 45, 0, Math.PI / 2);
      ctx.stroke();
      ctx.fillStyle = "#c59a35";
      ctx.fillRect(40, -6, 12, 12);
      ctx.fillRect(-6, 40, 12, 12);
      ctx.restore();
    };
    drawCorner(100, 100, 0);
    drawCorner(924, 100, Math.PI / 2);
    drawCorner(924, 1300, Math.PI);
    drawCorner(100, 1300, -Math.PI / 2);

    // Central Archival Seal
    ctx.save();
    ctx.translate(512, 530);
    ctx.strokeStyle = "#dfbb5b";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(0, 0, 150, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 136, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "#f3d274";
    ctx.font = "90px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("❦", 0, -25);

    ctx.font = "bold 26px 'Cinzel', serif";
    ctx.fillText("MCMXXVI", 0, 55);
    ctx.restore();

    // Gilded Typography
    ctx.fillStyle = "#f8e08d";
    ctx.shadowColor = "rgba(0,0,0,0.85)";
    ctx.shadowBlur = 12;
    ctx.font = "bold 58px 'Cinzel', serif";
    ctx.textAlign = "center";
    ctx.fillText(title, 512, 840);

    ctx.font = "600 28px 'Playfair Display', serif";
    ctx.fillStyle = "#dfbb5b";
    ctx.fillText(subtitle, 512, 915);

    ctx.font = "italic 24px 'EB Garamond', serif";
    ctx.fillStyle = "#baa067";
    ctx.fillText("Ex Libris Centralis • Bibliotheca", 512, 975);

    ctx.font = "bold 22px 'Cinzel', serif";
    ctx.fillStyle = "#c59a35";
    ctx.fillText("• LIBER PRIMUS •", 512, 1140);

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 8;
    return texture;
  }

  // Inside Page Texture (Antique Latin Calligraphy & Woodcut)
  function createInsidePageTexture(isLeft = true) {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1400;
    const ctx = canvas.getContext("2d");

    // Aged yellowed parchment base
    ctx.fillStyle = "#f4ecd9";
    ctx.fillRect(0, 0, 1024, 1400);

    // Weathered page edges and tea stain vignette
    const vig = ctx.createRadialGradient(512, 700, 200, 512, 700, 750);
    vig.addColorStop(0, "rgba(244, 236, 217, 0)");
    vig.addColorStop(0.7, "rgba(224, 207, 172, 0.4)");
    vig.addColorStop(1, "rgba(185, 155, 110, 0.75)");
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, 1024, 1400);

    // Foxing spots (vintage paper aging)
    for (let i = 0; i < 40; i++) {
      const rx = Math.random() * 1024;
      const ry = Math.random() * 1400;
      const rad = Math.random() * 15 + 4;
      ctx.fillStyle = "rgba(165, 130, 85, 0.12)";
      ctx.beginPath();
      ctx.arc(rx, ry, rad, 0, Math.PI * 2);
      ctx.fill();
    }

    if (isLeft) {
      // Woodcut engraving & frontispiece border
      ctx.strokeStyle = "#4a3520";
      ctx.lineWidth = 4;
      ctx.strokeRect(120, 120, 784, 1160);

      ctx.fillStyle = "#382313";
      ctx.font = "italic 32px 'EB Garamond', serif";
      ctx.textAlign = "center";
      ctx.fillText("BIBLIOTHECA ATHENAEUM", 512, 220);

      ctx.font = "20px 'Cinzel', serif";
      ctx.fillStyle = "#705234";
      ctx.fillText("ACCESSION REGISTRY • NO. 00142", 512, 280);

      // Classical emblem engraving
      ctx.strokeStyle = "#65492d";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(512, 560, 170, 0, Math.PI * 2);
      ctx.stroke();

      ctx.font = "140px serif";
      ctx.fillStyle = "#50361e";
      ctx.fillText("🏛", 512, 570);

      // Red Archival Wax Seal Stamp
      ctx.save();
      ctx.translate(512, 980);
      ctx.fillStyle = "rgba(160, 32, 32, 0.85)";
      ctx.beginPath();
      ctx.arc(0, 0, 95, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(110, 15, 15, 0.9)";
      ctx.lineWidth = 5;
      ctx.stroke();

      ctx.fillStyle = "#f4ecd9";
      ctx.font = "bold 20px 'Cinzel', serif";
      ctx.fillText("CURATOR'S SEAL", 0, -10);
      ctx.font = "italic 16px serif";
      ctx.fillText("VERIFIED ARCHIVE", 0, 20);
      ctx.restore();
    } else {
      // Right Page: Opening Chapter & Calligraphy Lines
      ctx.fillStyle = "#382313";
      ctx.font = "bold 38px 'Cinzel', serif";
      ctx.textAlign = "center";
      ctx.fillText("CAPUT PRIMUM", 512, 200);

      ctx.font = "italic 24px 'EB Garamond', serif";
      ctx.fillStyle = "#65492d";
      ctx.fillText("De Origine Scientiae et Litterarum", 512, 245);

      // Drop Cap "I"
      ctx.fillStyle = "#a02020";
      ctx.font = "bold 96px 'Cinzel Decorative', serif";
      ctx.textAlign = "left";
      ctx.fillText("I", 140, 390);

      // Antique manuscript text lines
      ctx.fillStyle = "#2c1c11";
      ctx.font = "24px 'EB Garamond', serif";
      const lines = [
        "n antiquissimis temporibus, cum libri manu",
        "scripti in monasteriis et academiis diligenter",
        "custodirentur, omnis pagina sapientiae plena",
        "fuit. Hic codex continet omnes catalogo",
        "adscriptos libros qui in arce repositi sunt.",
        "",
        "Omnis qui has paginas perlustrat, iuramentum",
        "silentii et reverentiae erga codices veteres",
        "praestare debet. Quisque liber pretiosus,",
        "omne verbum aeternum habetur.",
        "",
        "Anno Domini MMXXVI • Athenaeum Archive",
      ];

      let startY = 345;
      lines.forEach((line, idx) => {
        const x = idx < 2 ? 220 : 140;
        ctx.fillText(line, x, startY);
        startY += 44;
      });

      // Bottom Page Number in Roman Numerals
      ctx.font = "italic 22px 'EB Garamond', serif";
      ctx.textAlign = "center";
      ctx.fillText("— pag. I —", 512, 1260);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 8;
    return texture;
  }

  // Spine & Gilded Page Edges
  function createSpineTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 300;
    canvas.height = 1400;
    const ctx = canvas.getContext("2d");

    const grad = ctx.createLinearGradient(0, 0, 300, 0);
    grad.addColorStop(0, "#100603");
    grad.addColorStop(0.5, "#28150d");
    grad.addColorStop(1, "#100603");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 300, 1400);

    // Gilded spine ribs
    [100, 340, 580, 820, 1060, 1280].forEach((y) => {
      ctx.fillStyle = "#c59a35";
      ctx.fillRect(20, y - 6, 260, 12);
      ctx.fillStyle = "#f8e08d";
      ctx.fillRect(35, y - 2, 230, 4);
    });

    ctx.save();
    ctx.translate(150, 460);
    ctx.rotate(Math.PI / 2);
    ctx.font = "bold 44px 'Cinzel', serif";
    ctx.fillStyle = "#f8e08d";
    ctx.textAlign = "center";
    ctx.fillText("ATHENAEUM", 0, 0);
    ctx.restore();

    ctx.save();
    ctx.translate(150, 700);
    ctx.rotate(Math.PI / 2);
    ctx.font = "26px 'Cinzel', serif";
    ctx.fillStyle = "#dfbb5b";
    ctx.textAlign = "center";
    ctx.fillText("VOL. I", 0, 0);
    ctx.restore();

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 8;
    return texture;
  }

  // Gilded Page Edges Texture
  function createGildedEdgesTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#d4af37";
    ctx.fillRect(0, 0, 512, 512);

    for (let y = 0; y < 512; y += 4) {
      const shade = Math.sin(y * 0.35) * 20;
      ctx.fillStyle = `rgb(${212 + shade}, ${175 + shade}, ${55 + shade})`;
      ctx.fillRect(0, y, 512, 2);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 3);
    return texture;
  }

  // ----------------------------------------------------
  // Assembly of the 3D Book with Hinged Front Cover
  // ----------------------------------------------------
  const leatherMatOpts = { roughness: 0.42, metalness: 0.15 };
  const frontTex = createCoverTexture("ATHENAEUM", "ARCHIVUM CODEX");
  const insideLeftTex = createInsidePageTexture(true);
  const insideRightTex = createInsidePageTexture(false);
  const spineTex = createSpineTexture();
  const edgesTex = createGildedEdgesTexture();

  // 1. Back Cover (Static base)
  const backCoverGeo = new THREE.BoxGeometry(bookWidth, bookHeight, coverThickness);
  const backCoverMat = new THREE.MeshStandardMaterial({ map: frontTex, ...leatherMatOpts });
  const backCover = new THREE.Mesh(backCoverGeo, backCoverMat);
  backCover.position.set(0, 0, -bookThickness / 2);
  bookRoot.add(backCover);

  // 2. Interior Pages Block (Right page visible when open)
  const pagesWidth = bookWidth - 0.16;
  const pagesHeight = bookHeight - 0.2;
  const pagesDepth = bookThickness - coverThickness * 2;

  const pagesGeo = new THREE.BoxGeometry(pagesWidth, pagesHeight, pagesDepth);
  const pagesMats = [
    new THREE.MeshStandardMaterial({ map: edgesTex, roughness: 0.35, metalness: 0.4 }), // right gilded edge
    new THREE.MeshStandardMaterial({ color: 0x1f120a, roughness: 0.8 }), // spine side
    new THREE.MeshStandardMaterial({ map: edgesTex, roughness: 0.35, metalness: 0.4 }), // top edge
    new THREE.MeshStandardMaterial({ map: edgesTex, roughness: 0.35, metalness: 0.4 }), // bottom edge
    new THREE.MeshStandardMaterial({ map: insideRightTex, roughness: 0.8 }), // front page
    new THREE.MeshStandardMaterial({ color: 0xecdcc5, roughness: 0.8 }), // back page
  ];
  const pagesMesh = new THREE.Mesh(pagesGeo, pagesMats);
  pagesMesh.position.set(0.08, 0, 0);
  bookRoot.add(pagesMesh);

  // 3. Curved Spine (Left cylinder)
  const spineRadius = bookThickness / 2 + 0.04;
  const spineGeo = new THREE.CylinderGeometry(spineRadius, spineRadius, bookHeight, 32, 1, false, Math.PI * 0.5, Math.PI);
  const spineMat = new THREE.MeshStandardMaterial({ map: spineTex, ...leatherMatOpts, side: THREE.DoubleSide });
  const spine = new THREE.Mesh(spineGeo, spineMat);
  spine.position.set(-bookWidth / 2, 0, 0);
  spine.rotation.y = Math.PI / 2;
  bookRoot.add(spine);

  // 4. Hinged Front Cover Group (Hinged exactly at spine: x = -bookWidth / 2)
  const frontHingeGroup = new THREE.Group();
  frontHingeGroup.position.set(-bookWidth / 2, 0, bookThickness / 2);
  bookRoot.add(frontHingeGroup);

  const frontCoverGeo = new THREE.BoxGeometry(bookWidth, bookHeight, coverThickness);
  const frontCoverMats = [
    new THREE.MeshStandardMaterial({ color: 0x1b0d07, ...leatherMatOpts }),
    new THREE.MeshStandardMaterial({ color: 0x1b0d07, ...leatherMatOpts }),
    new THREE.MeshStandardMaterial({ color: 0x1b0d07, ...leatherMatOpts }),
    new THREE.MeshStandardMaterial({ color: 0x1b0d07, ...leatherMatOpts }),
    new THREE.MeshStandardMaterial({ map: frontTex, ...leatherMatOpts }), // Outside front cover
    new THREE.MeshStandardMaterial({ map: insideLeftTex, roughness: 0.75 }), // Inside left page
  ];
  const frontCoverMesh = new THREE.Mesh(frontCoverGeo, frontCoverMats);
  // Offset mesh so its left edge aligns with hinge pivot point at 0
  frontCoverMesh.position.set(bookWidth / 2, 0, 0);
  frontHingeGroup.add(frontCoverMesh);

  // 5. Silk Bookmark Ribbon (Royal Crimson)
  const ribbonCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.2, -pagesHeight / 2 + 0.1, 0),
    new THREE.Vector3(0.3, -pagesHeight / 2 - 0.35, 0.1),
    new THREE.Vector3(0.18, -pagesHeight / 2 - 0.8, 0.22),
    new THREE.Vector3(0.32, -pagesHeight / 2 - 1.25, 0.15),
  ]);
  const ribbonGeo = new THREE.TubeGeometry(ribbonCurve, 28, 0.045, 8, false);
  const ribbonMat = new THREE.MeshStandardMaterial({ color: 0x8b1818, roughness: 0.35, metalness: 0.1 });
  const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
  bookRoot.add(ribbon);

  // 6. Archival Candlelight & Studio Lighting
  const ambientLight = new THREE.AmbientLight(0xfff1dc, 0.9);
  scene.add(ambientLight);

  // Warm candlelight key illumination
  const candleKey = new THREE.PointLight(0xffd58a, 2.4, 18);
  candleKey.position.set(4, 5, 5);
  scene.add(candleKey);

  // Antique brass rim light
  const goldRim = new THREE.PointLight(0xc99a3e, 2.0, 14);
  goldRim.position.set(-5, 2, 4);
  scene.add(goldRim);

  // 7. Floating Archival Ember Particles
  const particleCount = 60;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(particleCount * 3);
  const pSpeeds = [];

  for (let i = 0; i < particleCount; i++) {
    pPos[i * 3] = (Math.random() - 0.5) * 10;
    pPos[i * 3 + 1] = (Math.random() - 0.5) * 8;
    pPos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    pSpeeds.push({
      x: (Math.random() - 0.5) * 0.004,
      y: Math.random() * 0.006 + 0.002,
      z: (Math.random() - 0.5) * 0.004,
    });
  }
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));

  const pCanvas = document.createElement("canvas");
  pCanvas.width = 32;
  pCanvas.height = 32;
  const pCtx = pCanvas.getContext("2d");
  const grad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, "rgba(255, 235, 170, 1)");
  grad.addColorStop(0.4, "rgba(201, 154, 62, 0.6)");
  grad.addColorStop(1, "rgba(201, 154, 62, 0)");
  pCtx.fillStyle = grad;
  pCtx.fillRect(0, 0, 32, 32);

  const pMat = new THREE.PointsMaterial({
    size: 0.18,
    map: new THREE.CanvasTexture(pCanvas),
    transparent: true,
    opacity: 0.8,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const emberSystem = new THREE.Points(pGeo, pMat);
  scene.add(emberSystem);

  // Initial Book Angle (Majestic 3D reading lectern perspective)
  bookRoot.rotation.x = 0.24;
  bookRoot.rotation.y = -0.45;
  bookRoot.rotation.z = -0.05;

  // ----------------------------------------------------
  // Interactive State & Controls (Open / Close / Inspect)
  // ----------------------------------------------------
  let isBookOpen = false;
  let targetHingeAngle = 0; // 0 = closed, ~ -2.7 rad = open
  let targetRotX = 0.24;
  let targetRotY = -0.45;
  let mouseTiltX = 0;
  let mouseTiltY = 0;
  let isDragging = false;
  let prevX = 0;
  let prevY = 0;
  let userInteracting = false;
  let idleTimer = null;

  function toggleBookOpen() {
    isBookOpen = !isBookOpen;
    if (isBookOpen) {
      targetHingeAngle = -Math.PI * 0.86; // Open ~155 degrees
      targetRotX = 0.28;
      targetRotY = 0.12; // Turn slightly to showcase open double-page spread!
    } else {
      targetHingeAngle = 0;
      targetRotX = 0.24;
      targetRotY = -0.45;
    }

    const openBtn = document.getElementById("toggle-codex-btn");
    if (openBtn) {
      openBtn.innerHTML = isBookOpen
        ? '<i class="bi bi-book-fill text-warning me-1"></i> Close Codex'
        : '<i class="bi bi-book-half text-warning me-1"></i> Open & Inspect Tome';
    }
  }

  // Pointer Events for Tilt & Drag Orbit
  container.addEventListener("pointermove", (e) => {
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

    if (!isDragging) {
      mouseTiltY = x * 0.3;
      mouseTiltX = -y * 0.2;
    }
  });

  container.addEventListener("pointerdown", (e) => {
    isDragging = true;
    userInteracting = true;
    prevX = e.clientX;
    prevY = e.clientY;
    container.style.cursor = "grabbing";
    if (idleTimer) clearTimeout(idleTimer);
  });

  window.addEventListener("pointerup", () => {
    if (isDragging) {
      isDragging = false;
      container.style.cursor = "grab";
      idleTimer = setTimeout(() => {
        userInteracting = false;
      }, 3500);
    }
  });

  window.addEventListener("pointermove", (e) => {
    if (!isDragging) return;
    const dx = e.clientX - prevX;
    const dy = e.clientY - prevY;

    targetRotY += dx * 0.012;
    targetRotX += dy * 0.012;
    targetRotX = Math.max(-0.85, Math.min(0.85, targetRotX));

    prevX = e.clientX;
    prevY = e.clientY;
  });

  // UI Control Buttons
  const toggleBtn = document.getElementById("toggle-codex-btn");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", toggleBookOpen);
  }

  const resetBtn = document.getElementById("reset-3d-book");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      isBookOpen = false;
      targetHingeAngle = 0;
      targetRotX = 0.24;
      targetRotY = -0.45;
      mouseTiltX = 0;
      mouseTiltY = 0;
      userInteracting = false;
      if (toggleBtn) {
        toggleBtn.innerHTML = '<i class="bi bi-book-half text-warning me-1"></i> Open & Inspect Tome';
      }
    });
  }

  // Clicking the book directly can also toggle opening
  container.addEventListener("dblclick", toggleBookOpen);
  container.style.cursor = "grab";
  container.style.touchAction = "none";

  // ----------------------------------------------------
  // Animation & Render Loop
  // ----------------------------------------------------
  const clock = new THREE.Clock();
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const time = clock.getElapsedTime();

    if (!prefersReducedMotion) {
      // Smoothly animate the front cover opening / closing
      frontHingeGroup.rotation.y += (targetHingeAngle - frontHingeGroup.rotation.y) * 0.08;

      // Idle floating levitation & gentle rotation when not dragging
      if (!userInteracting && !isBookOpen) {
        targetRotY += 0.0035;
      }

      bookRoot.rotation.y += (targetRotY + mouseTiltY - bookRoot.rotation.y) * 0.07;
      bookRoot.rotation.x += (targetRotX + mouseTiltX - bookRoot.rotation.x) * 0.07;

      // Soft breathing levitation
      bookRoot.position.y = Math.sin(time * 1.5) * 0.08;

      // Candlelight subtle flicker effect
      candleKey.intensity = 2.4 + Math.sin(time * 8) * 0.15 + Math.cos(time * 13) * 0.08;

      // Drift embers upwards
      const pos = emberSystem.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3 + 1] += pSpeeds[i].y;
        pos[i * 3] += pSpeeds[i].x;
        if (pos[i * 3 + 1] > 4) pos[i * 3 + 1] = -4;
      }
      emberSystem.geometry.attributes.position.needsUpdate = true;
    }

    renderer.render(scene, camera);
  }

  animate();

  function handleResize() {
    if (!container) return;
    const w = container.clientWidth || 540;
    const h = container.clientHeight || 420;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  window.addEventListener("resize", handleResize);
})();
