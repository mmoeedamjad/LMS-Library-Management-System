/**
 * Athenaeum Full-Page 3D Experience
 * - Full-page ambient 3D Three.js background canvas with scroll-depth parallax
 * - Interactive 3D perspective card tilting with dynamic specular glare
 * - Scroll-driven 3D entrance observer
 */

(function () {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // =========================================================================
  // 1. FULL-PAGE AMBIENT 3D BACKGROUND CANVAS
  // =========================================================================
  const bgContainer = document.getElementById("ambient-3d-bg");
  if (bgContainer && !prefersReducedMotion && typeof THREE !== "undefined") {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    bgContainer.appendChild(renderer.domElement);

    // Glowing Archival Motes (Golden Dust & Constellations)
    const particleCount = 180;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const driftSpeeds = [];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 220;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 350;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 160;
      scales[i] = Math.random() * 0.8 + 0.3;
      driftSpeeds.push({
        x: (Math.random() - 0.5) * 0.03,
        y: (Math.random() - 0.5) * 0.02,
        rot: (Math.random() - 0.5) * 0.005,
      });
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Particle Texture with soft warm glow
    const pCanvas = document.createElement("canvas");
    pCanvas.width = 64;
    pCanvas.height = 64;
    const pCtx = pCanvas.getContext("2d");
    const grad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 30);
    grad.addColorStop(0, "rgba(255, 235, 170, 0.95)");
    grad.addColorStop(0.3, "rgba(197, 155, 39, 0.5)");
    grad.addColorStop(0.8, "rgba(197, 155, 39, 0.1)");
    grad.addColorStop(1, "rgba(197, 155, 39, 0)");
    pCtx.fillStyle = grad;
    pCtx.fillRect(0, 0, 64, 64);

    const material = new THREE.PointsMaterial({
      size: 3.5,
      map: new THREE.CanvasTexture(pCanvas),
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Floating 3D Geometric Glyphs (Rare ancient manuscripts motifs)
    const glyphGroup = new THREE.Group();
    const ringGeo = new THREE.TorusGeometry(8, 0.12, 16, 64);
    const goldWireMat = new THREE.MeshBasicMaterial({
      color: 0xc59b27,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });

    for (let g = 0; g < 6; g++) {
      const ring = new THREE.Mesh(ringGeo, goldWireMat);
      ring.position.set(
        (Math.random() - 0.5) * 140,
        (Math.random() - 0.5) * 260,
        (Math.random() - 0.5) * 60
      );
      ring.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      glyphGroup.add(ring);
    }
    scene.add(glyphGroup);

    // Scroll depth tracking
    let targetScrollY = 0;
    let currentScrollY = 0;

    window.addEventListener("scroll", () => {
      targetScrollY = window.scrollY;
    }, { passive: true });

    // Render loop
    function animateBg() {
      requestAnimationFrame(animateBg);

      // Smooth scroll interpolation
      currentScrollY += (targetScrollY - currentScrollY) * 0.05;

      // Parallax move camera based on page scroll
      camera.position.y = -currentScrollY * 0.08;
      particles.rotation.y += 0.0006;
      glyphGroup.rotation.y += 0.001;
      glyphGroup.rotation.x += 0.0005;

      renderer.render(scene, camera);
    }

    animateBg();

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  // =========================================================================
  // 2. INTERACTIVE 3D PERSPECTIVE CARD TILT ENGINE
  // =========================================================================
  if (!prefersReducedMotion) {
    const tiltCards = document.querySelectorAll(".card-3d");

    tiltCards.forEach((card) => {
      // Create glare overlay dynamically if not already present
      let glare = card.querySelector(".glare-3d");
      if (!glare) {
        glare = document.createElement("div");
        glare.className = "glare-3d";
        card.appendChild(glare);
      }

      let isHovered = false;

      card.addEventListener("mouseenter", () => {
        isHovered = true;
        card.style.transition = "transform 0.1s ease-out, box-shadow 0.25s ease-out";
      });

      card.addEventListener("mousemove", (e) => {
        if (!isHovered) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calculate rotation angles (max 12 degrees)
        const rotateX = ((y - centerY) / centerY) * -11;
        const rotateY = ((x - centerX) / centerX) * 11;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(12px)`;

        // Specular glare effect moving with pointer
        const percentX = (x / rect.width) * 100;
        const percentY = (y / rect.height) * 100;
        glare.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(255, 235, 170, 0.22) 0%, rgba(255, 255, 255, 0) 65%)`;
        glare.style.opacity = "1";
      });

      card.addEventListener("mouseleave", () => {
        isHovered = false;
        card.style.transition = "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s ease";
        card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
        glare.style.opacity = "0";
      });
    });
  }

  // =========================================================================
  // 3. SCROLL-TRIGGERED 3D REVEAL OBSERVER
  // =========================================================================
  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const revealElements = document.querySelectorAll(".reveal-3d");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    revealElements.forEach((el) => observer.observe(el));
  }
})();
