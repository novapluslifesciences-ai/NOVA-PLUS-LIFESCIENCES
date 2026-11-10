import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RotateCw, Maximize2, Sparkles, Eye, ChevronDown, ChevronUp, Beaker } from 'lucide-react';

interface ThreeBottleCanvasProps {
  className?: string;
  activeProductAura?: 'blue' | 'teal';
}

export const ThreeBottleCanvas: React.FC<ThreeBottleCanvasProps> = ({
  className = '',
  activeProductAura = 'blue',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [modelMode, setModelMode] = useState<'bottle' | 'sachet' | 'molecule'>('bottle');
  const [liquidFill, setLiquidFill] = useState<number>(0.85);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [isControlsExpanded, setIsControlsExpanded] = useState<boolean>(true);

  // References to communicate with WebGL loop safely without tearing down context
  const sceneRef = useRef<THREE.Scene | null>(null);
  const liquidMeshRef = useRef<THREE.Mesh | null>(null);
  const bottleGroupRef = useRef<THREE.Group | null>(null);
  const sachetGroupRef = useRef<THREE.Group | null>(null);
  const moleculeGroupRef = useRef<THREE.Group | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const autoRotateRef = useRef<boolean>(true);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  useEffect(() => {
    if (bottleGroupRef.current && sachetGroupRef.current && moleculeGroupRef.current) {
      bottleGroupRef.current.visible = modelMode === 'bottle';
      sachetGroupRef.current.visible = modelMode === 'sachet';
      moleculeGroupRef.current.visible = modelMode === 'molecule';
    }
  }, [modelMode]);

  useEffect(() => {
    if (liquidMeshRef.current) {
      liquidMeshRef.current.scale.y = Math.max(0.05, liquidFill);
      liquidMeshRef.current.position.y = 1.35 * liquidFill;
    }
  }, [liquidFill]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect software WebGL safely
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    // 2. Scene & Camera setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x0b1b3d, 0.035);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 6.2);

    // 3. Renderer configuration
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 4. Studio Environment Lighting
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Studio 3-Point Light Rig
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(4, 6, 5);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.shadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 15;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x091b33, 1.2);
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight(0x2dd4bf, 1.8);
    rimLight.position.set(-5, 4, -4);
    scene.add(rimLight);

    // 5. Contact Shadow Grounding
    const contactCanvas = document.createElement('canvas');
    contactCanvas.width = 256;
    contactCanvas.height = 256;
    const ctx = contactCanvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
      grad.addColorStop(0, 'rgba(3, 10, 26, 0.65)');
      grad.addColorStop(0.5, 'rgba(3, 10, 26, 0.25)');
      grad.addColorStop(1, 'rgba(3, 10, 26, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);
    }
    const shadowTexture = new THREE.CanvasTexture(contactCanvas);
    shadowTexture.colorSpace = THREE.SRGBColorSpace;
    const shadowGeo = new THREE.PlaneGeometry(3.6, 3.6);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.01;
    scene.add(shadowMesh);

    // 6. Procedural Bottle Label Texture
    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 1024;
    labelCanvas.height = 512;
    const lCtx = labelCanvas.getContext('2d');
    if (lCtx) {
      // White pharmaceutical label backing
      lCtx.fillStyle = '#FFFFFF';
      lCtx.fillRect(0, 0, 1024, 512);

      // Deep corporate blue top ribbon
      lCtx.fillStyle = '#0B1B3D';
      lCtx.fillRect(0, 0, 1024, 80);

      // Gold divider line
      lCtx.fillStyle = '#D97706';
      lCtx.fillRect(0, 80, 1024, 6);

      // Brand Title
      lCtx.fillStyle = '#0B1B3D';
      lCtx.font = 'bold 54px Plus Jakarta Sans, Arial';
      lCtx.fillText('Nova-Plus Lifesciences', 60, 160);

      // Tagline
      lCtx.fillStyle = '#0284C7';
      lCtx.font = '600 24px Plus Jakarta Sans, Arial';
      lCtx.fillText('Advancing Healthcare • Safe & Effective Medicine', 60, 205);

      // Product Feature Block
      lCtx.fillStyle = '#F0FDF4';
      lCtx.fillRect(60, 230, 420, 180);
      lCtx.strokeStyle = '#22C55E';
      lCtx.lineWidth = 2;
      lCtx.strokeRect(60, 230, 420, 180);

      lCtx.fillStyle = '#15803D';
      lCtx.font = 'bold 28px Plus Jakarta Sans, Arial';
      lCtx.fillText('120 ml SYRUP', 80, 275);

      lCtx.fillStyle = '#1E293B';
      lCtx.font = '500 20px Plus Jakarta Sans, Arial';
      lCtx.fillText('✓ Sugar-Free Formulation', 80, 315);
      lCtx.fillText('✓ WHO-GMP & Ayush Certified', 80, 350);
      lCtx.fillText('✓ Standardized Phytomedicine', 80, 385);

      // Measuring Scale on the side of label
      lCtx.fillStyle = '#64748B';
      lCtx.fillRect(860, 60, 4, 400);
      const marks = ['120ml', '90ml', '60ml', '30ml', '10ml'];
      marks.forEach((m, idx) => {
        const y = 80 + idx * 80;
        lCtx.fillRect(830, y, 30, 3);
        lCtx.fillStyle = '#334155';
        lCtx.font = '600 18px monospace';
        lCtx.fillText(m, 760, y + 6);
      });

      // Bottom regulatory bar
      lCtx.fillStyle = '#0F172A';
      lCtx.fillRect(0, 460, 1024, 52);
      lCtx.fillStyle = '#E2E8F0';
      lCtx.font = '16px monospace';
      lCtx.fillText('BATCH: NP-2026-X8  |  MFG: 02/2026  |  EXP: 01/2029  |  TEL: 0302-9278899', 60, 492);
    }

    const labelTexture = new THREE.CanvasTexture(labelCanvas);
    labelTexture.colorSpace = THREE.SRGBColorSpace;
    labelTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // 7. Composite 3-12 Part Procedural Model: 120ml Amber Glass Bottle (THREE.Group)
    const bottleGroup = new THREE.Group();
    bottleGroupRef.current = bottleGroup;
    scene.add(bottleGroup);

    // Part 1: Outer Glass Body (Physical high-clarity amber pharmaceutical glass)
    const bottleBodyGeo = new THREE.CylinderGeometry(0.85, 0.85, 2.7, 48);
    const bottleGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x92400e, // Warm rich pharmaceutical amber
      metalness: 0.1,
      roughness: 0.08,
      transmission: isSoftwareGl ? 0 : 0.88,
      opacity: isSoftwareGl ? 0.75 : 1.0,
      transparent: true,
      ior: 1.52,
      thickness: 0.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });
    const bottleBodyMesh = new THREE.Mesh(bottleBodyGeo, bottleGlassMat);
    bottleBodyMesh.position.y = 1.35;
    bottleBodyMesh.castShadow = !isSoftwareGl;
    bottleGroup.add(bottleBodyMesh);

    // Part 2: Bottle Base Ring (Grounding footing)
    const baseGeo = new THREE.CylinderGeometry(0.86, 0.84, 0.12, 48);
    const baseMesh = new THREE.Mesh(baseGeo, bottleGlassMat);
    baseMesh.position.y = 0.06;
    bottleGroup.add(baseMesh);

    // Part 3: Bottle Shoulder Curve (Smooth Lathe bevel transition)
    const shoulderGeo = new THREE.ConeGeometry(0.85, 0.5, 48, 1, true);
    const shoulderMesh = new THREE.Mesh(shoulderGeo, bottleGlassMat);
    shoulderMesh.position.y = 2.95;
    bottleGroup.add(shoulderMesh);

    // Part 4: Bottle Neck (Cylindrical opening)
    const neckGeo = new THREE.CylinderGeometry(0.38, 0.42, 0.6, 36);
    const neckMesh = new THREE.Mesh(neckGeo, bottleGlassMat);
    neckMesh.position.y = 3.35;
    bottleGroup.add(neckMesh);

    // Part 5: Threaded Rim Collar
    const rimGeo = new THREE.TorusGeometry(0.4, 0.035, 16, 36);
    rimGeo.rotateX(Math.PI / 2);
    const rimMesh = new THREE.Mesh(rimGeo, bottleGlassMat);
    rimMesh.position.y = 3.52;
    bottleGroup.add(rimMesh);

    // Part 6: Pilfer-Proof Aluminium Safety Cap
    const capGeo = new THREE.CylinderGeometry(0.44, 0.44, 0.55, 36);
    const capMat = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9, // Bio sapphire metallic blue
      metalness: 0.88,
      roughness: 0.22,
    });
    const capMesh = new THREE.Mesh(capGeo, capMat);
    capMesh.position.y = 3.7;
    capMesh.castShadow = !isSoftwareGl;
    bottleGroup.add(capMesh);

    // Part 7: Cap Tamper-Evident Security Ring
    const securityRingGeo = new THREE.TorusGeometry(0.45, 0.025, 12, 36);
    securityRingGeo.rotateX(Math.PI / 2);
    const goldRingMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.95,
      roughness: 0.15,
    });
    const securityRingMesh = new THREE.Mesh(securityRingGeo, goldRingMat);
    securityRingMesh.position.y = 3.44;
    bottleGroup.add(securityRingMesh);

    // Part 8: Inner Liquid Volume with Meniscus
    const liquidGeo = new THREE.CylinderGeometry(0.79, 0.79, 2.6, 36);
    const liquidMat = new THREE.MeshPhysicalMaterial({
      color: 0xb45309, // Rich active herbal syrup core
      metalness: 0.05,
      roughness: 0.1,
      transmission: isSoftwareGl ? 0 : 0.6,
      opacity: 0.9,
      transparent: true,
      ior: 1.34,
    });
    const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
    liquidMesh.position.y = 1.35 * 0.85;
    liquidMesh.scale.y = 0.85;
    liquidMeshRef.current = liquidMesh;
    bottleGroup.add(liquidMesh);

    // Part 9: Cylindrical Wrap Label
    const labelGeo = new THREE.CylinderGeometry(0.856, 0.856, 1.8, 48, 1, true, 0, Math.PI * 1.6);
    const labelMat = new THREE.MeshStandardMaterial({
      map: labelTexture,
      roughness: 0.45,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });
    const labelMesh = new THREE.Mesh(labelGeo, labelMat);
    labelMesh.position.y = 1.35;
    labelMesh.rotation.y = -Math.PI * 0.8;
    bottleGroup.add(labelMesh);

    // 8. Composite 3-12 Part Procedural Model: Cran Bee Sachet Pack (THREE.Group)
    const sachetGroup = new THREE.Group();
    sachetGroupRef.current = sachetGroup;
    sachetGroup.visible = false;
    scene.add(sachetGroup);

    // Part S1: Outer Foil Packet Body
    const sachetBodyGeo = new THREE.BoxGeometry(1.6, 2.4, 0.18);
    const sachetFoilMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.4,
      roughness: 0.25,
    });
    const sachetBody = new THREE.Mesh(sachetBodyGeo, sachetFoilMat);
    sachetBody.position.y = 1.4;
    sachetGroup.add(sachetBody);

    // Part S2: Maroon/Cranberry Brand Header
    const sachetHeaderGeo = new THREE.BoxGeometry(1.61, 0.8, 0.19);
    const sachetHeaderMat = new THREE.MeshStandardMaterial({
      color: 0x881337, // Cranberry deep red
      metalness: 0.6,
      roughness: 0.3,
    });
    const sachetHeader = new THREE.Mesh(sachetHeaderGeo, sachetHeaderMat);
    sachetHeader.position.y = 2.1;
    sachetGroup.add(sachetHeader);

    // Part S3 & S4: Crimped Heat-Sealed Top and Bottom Ridges
    for (let i = 0; i < 2; i++) {
      const crimpGeo = new THREE.BoxGeometry(1.65, 0.15, 0.08);
      const crimpMat = new THREE.MeshStandardMaterial({
        color: 0xd97706, // Gold crimp foil
        metalness: 0.9,
        roughness: 0.18,
      });
      const crimpMesh = new THREE.Mesh(crimpGeo, crimpMat);
      crimpMesh.position.y = i === 0 ? 2.55 : 0.25;
      sachetGroup.add(crimpMesh);
    }

    // Part S5: Gold Foil Seal Badge
    const sealGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
    sealGeo.rotateX(Math.PI / 2);
    const sealMesh = new THREE.Mesh(sealGeo, goldRingMat);
    sealMesh.position.set(0.45, 0.7, 0.05);
    sachetGroup.add(sealMesh);

    // 9. Composite Procedural Model: Bio-Molecular Helix & Active Particle Cluster
    const moleculeGroup = new THREE.Group();
    moleculeGroupRef.current = moleculeGroup;
    moleculeGroup.visible = false;
    scene.add(moleculeGroup);

    // DNA double helix strand procedural particles
    const helixCount = 42;
    const helixRadius = 1.4;
    const helixHeight = 3.8;
    const sphereGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const strandAMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.7, roughness: 0.2 });
    const strandBMat = new THREE.MeshStandardMaterial({ color: 0x0d9488, metalness: 0.7, roughness: 0.2 });
    const rungMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.3 });

    for (let i = 0; i < helixCount; i++) {
      const t = i / helixCount;
      const angle = t * Math.PI * 5;
      const y = t * helixHeight;

      // Strand A node
      const xA = Math.cos(angle) * helixRadius;
      const zA = Math.sin(angle) * helixRadius;
      const nodeA = new THREE.Mesh(sphereGeo, strandAMat);
      nodeA.position.set(xA, y, zA);
      moleculeGroup.add(nodeA);

      // Strand B node (opposite phase)
      const xB = Math.cos(angle + Math.PI) * helixRadius;
      const zB = Math.sin(angle + Math.PI) * helixRadius;
      const nodeB = new THREE.Mesh(sphereGeo, strandBMat);
      nodeB.position.set(xB, y, zB);
      moleculeGroup.add(nodeB);

      // Connecting hydrogen bond rung
      if (i % 2 === 0) {
        const rungLength = helixRadius * 2;
        const rungGeo = new THREE.CylinderGeometry(0.02, 0.02, rungLength, 8);
        rungGeo.rotateZ(Math.PI / 2);
        const rung = new THREE.Mesh(rungGeo, rungMat);
        rung.position.set(0, y, 0);
        rung.rotation.y = -angle;
        moleculeGroup.add(rung);
      }
    }

    // 10. Ambient Floating Bio-Active Molecules around the bottle
    const particleGroup = new THREE.Group();
    scene.add(particleGroup);
    const particleGeo = new THREE.IcosahedronGeometry(0.09, 0);
    const particleMat = new THREE.MeshStandardMaterial({
      color: activeProductAura === 'teal' ? 0x14b8a6 : 0x38bdf8,
      metalness: 0.5,
      roughness: 0.2,
      wireframe: true,
    });
    const particles: THREE.Mesh[] = [];
    for (let p = 0; p < 16; p++) {
      const pm = new THREE.Mesh(particleGeo, particleMat);
      const theta = Math.random() * Math.PI * 2;
      const r = 1.6 + Math.random() * 1.2;
      pm.position.set(Math.cos(theta) * r, 0.5 + Math.random() * 3.0, Math.sin(theta) * r);
      particleGroup.add(pm);
      particles.push(pm);
    }

    // 11. OrbitControls with Damping
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2.5;
    controls.maxDistance = 10;
    controls.target.set(0, 1.8, 0);
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1.8;
    controlsRef.current = controls;

    // 12. Render loop with Software GL pacing
    let frameId = 0;
    let clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Ambient particle gentle drift
      particleGroup.rotation.y = elapsedTime * 0.15;
      particles.forEach((pt, i) => {
        pt.position.y += Math.sin(elapsedTime * 2 + i) * 0.002;
      });

      if (moleculeGroup.visible) {
        moleculeGroup.rotation.y = elapsedTime * 0.4;
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className={`relative w-full h-full min-h-[460px] md:min-h-[560px] select-none rounded-2xl overflow-hidden ${className}`}>
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Spec Badges - Static Clean Badges (No pulsating dots) */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 pointer-events-none">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900/80 text-white border border-slate-700/60 shadow-lg">
          <Beaker className="w-3.5 h-3.5 text-teal-400" />
          Interactive 3D Formulation Lab
        </span>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-950/80 text-blue-200 border border-blue-800/60 shadow-md">
          {modelMode === 'bottle' ? '120ml Amber Glass Specification' : modelMode === 'sachet' ? 'Hermetic Triple-Foil Sachet' : 'Active Molecular Bio-Helix'}
        </span>
      </div>

      {/* Interactive Helper Hint */}
      <div className="absolute top-4 right-4 z-10 pointer-events-none hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-900/70 text-slate-300 border border-slate-700/50">
        <RotateCw className="w-3 h-3 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
        Click & Drag to Rotate • Scroll to Zoom
      </div>

      {/* Unified Bottom Control Dock - strictly consolidated, pinned to bottom center with zero side clutter */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-lg transition-all duration-300">
        {/* Toggle Collapse Pill */}
        <div className="flex justify-center -mb-2">
          <button
            onClick={() => setIsControlsExpanded(!isControlsExpanded)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-t-lg bg-slate-900 text-slate-300 hover:text-white border-t border-x border-slate-700/80 text-xs font-medium shadow-md transition-colors"
          >
            {isControlsExpanded ? <ChevronDown className="w-3.5 h-3.5 text-teal-400" /> : <ChevronUp className="w-3.5 h-3.5 text-teal-400" />}
            {isControlsExpanded ? '▾ Hide Controls' : '▴ Show 3D Controls'}
          </button>
        </div>

        {/* Collapsible Dock Panel */}
        {isControlsExpanded && (
          <div className="bg-slate-900/95 border border-slate-700/80 rounded-xl p-3 shadow-2xl space-y-3">
            {/* Model Mode Selector Tabs */}
            <div className="grid grid-cols-3 gap-1.5 bg-slate-800/80 p-1 rounded-lg">
              <button
                onClick={() => setModelMode('bottle')}
                className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded text-xs font-semibold transition-all ${
                  modelMode === 'bottle'
                    ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Beaker className="w-3 h-3" />
                Syrup (120ml)
              </button>
              <button
                onClick={() => setModelMode('sachet')}
                className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded text-xs font-semibold transition-all ${
                  modelMode === 'sachet'
                    ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Eye className="w-3 h-3" />
                Cran Sachet
              </button>
              <button
                onClick={() => setModelMode('molecule')}
                className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded text-xs font-semibold transition-all ${
                  modelMode === 'molecule'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                Bio-Helix
              </button>
            </div>

            {/* Sub-controls: Auto-rotate & Liquid Level */}
            <div className="flex items-center justify-between gap-3 text-xs text-slate-300 pt-1 border-t border-slate-800">
              {modelMode === 'bottle' ? (
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-[11px] text-slate-400 whitespace-nowrap">Fill Level:</span>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={liquidFill}
                    onChange={(e) => setLiquidFill(parseFloat(e.target.value))}
                    className="w-full accent-teal-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                  />
                  <span className="text-[11px] text-teal-300 font-mono">{Math.round(liquidFill * 120)}ml</span>
                </div>
              ) : (
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-400" />
                  Standardized Pharmacopoeial Geometry
                </div>
              )}

              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`px-2.5 py-1 rounded text-xs font-medium border flex items-center gap-1 transition-colors ${
                  autoRotate
                    ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                <RotateCw className={`w-3 h-3 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
                {autoRotate ? 'Rotating' : 'Paused'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
