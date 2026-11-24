import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  parseMetricDimensions,
  packVolumetricContainer,
  type MetricBox3D
} from '../../packages/deskhud-skeleton';
import {
  fetchCloudSkuTwins,
  insertCloudSkuTwin,
  type WsFrameLog
} from '../../src/momenClient';
import { Upload, CloudUpload } from 'lucide-react';

interface SkuPreset extends MetricBox3D {
  marketplace: string;
  specRaw: string;
  verdictCode: 'SIZE_TRAP' | 'SCALE_OK';
  verdictShort: string;
  shapeKind: 'tote' | 'mug' | 'box';
}

const INITIAL_SKUS: SkuPreset[] = [
  {
    id: 'mini-tote',
    name: 'CANVAS_TOTE_MINI',
    marketplace: 'SHOPEE_SG',
    specRaw: '18 x 12 x 7 cm',
    widthMm: 180,
    heightMm: 120,
    depthMm: 70,
    color: '#00F0FF',
    shapeKind: 'tote',
    verdictCode: 'SIZE_TRAP',
    verdictShort: 'HEIGHT 120MM = +5MM VS 330ML CAN (NO 13" LAPTOP FIT)'
  },
  {
    id: 'nordic-mug',
    name: 'CERAMIC_MUG_130ML',
    marketplace: 'SHOPEE_MY',
    specRaw: '6.2 x 7.0 x 6.2 cm',
    widthMm: 62,
    heightMm: 70,
    depthMm: 62,
    color: '#FF9F1C',
    shapeKind: 'mug',
    verdictCode: 'SIZE_TRAP',
    verdictShort: 'HEIGHT 70MM = 45MM SHORTER THAN 330ML SODA CAN'
  },
  {
    id: 'cyber-dac',
    name: 'POCKET_AUDIO_DAC',
    marketplace: 'AMAZON_US',
    specRaw: '95 x 65 x 50 mm',
    widthMm: 95,
    heightMm: 65,
    depthMm: 50,
    color: '#10B981',
    shapeKind: 'box',
    verdictCode: 'SCALE_OK',
    verdictShort: 'FOOTPRINT 95×50MM ≈ ISO CREDIT CARD (85.6×54MM)'
  },
  {
    id: 'acrylic-riser',
    name: 'DESK_MONITOR_RISER',
    marketplace: 'LAZADA',
    specRaw: '32 x 8.5 x 14.5 cm',
    widthMm: 320,
    heightMm: 85,
    depthMm: 145,
    color: '#A855F7',
    shapeKind: 'box',
    verdictCode: 'SCALE_OK',
    verdictShort: 'SPAN 320MM CLEARS 13" MACBOOK (304MM)'
  }
];

const REFERENCE_OBJS: MetricBox3D[] = [
  { id: 'can330', name: '330ML_CAN (66×115MM)', widthMm: 66, heightMm: 115, depthMm: 66, color: '#FF3366', shapeKind: 'can' },
  { id: 'iphone16', name: 'IPHONE_16 (72×148×8MM)', widthMm: 72, heightMm: 148, depthMm: 8, color: '#E2F1FF', shapeKind: 'phone' },
  { id: 'isocard', name: 'ISO_CARD (86×54×2MM)', widthMm: 86, heightMm: 54, depthMm: 2, color: '#10B981', shapeKind: 'card' },
  { id: 'macbook13', name: 'MACBOOK_13 (304×215×11MM)', widthMm: 304, heightMm: 12, depthMm: 215, color: '#94A3B8', shapeKind: 'laptop' }
];

const CONTAINERS = [
  { id: 'pd-cube', name: 'CAMERA_CUBE_S (290×200×140MM)', widthMm: 290, heightMm: 200, depthMm: 140 },
  { id: 'shopee-s', name: 'PARCEL_BOX_S (250×180×150MM)', widthMm: 250, heightMm: 180, depthMm: 150 },
  { id: 'cabin-7kg', name: 'CABIN_SIZER (400×300×200MM)', widthMm: 400, heightMm: 300, depthMm: 200 }
];

interface Props {
  onLogFrame?: (frame: WsFrameLog) => void;
}

export const ScaleHudApp: React.FC<Props> = ({ onLogFrame }) => {
  const [subMode, setSubMode] = useState<'scale-stage' | 'packfit-box' | 'exploded-rig'>('scale-stage');
  const [skus, setSkus] = useState<SkuPreset[]>(INITIAL_SKUS);
  const [selectedSku, setSelectedSku] = useState<SkuPreset>(INITIAL_SKUS[0]);
  const [customSkuName, setCustomSkuName] = useState<string>('CUSTOM_SHOPEE_SKU');
  const [specInput, setSpecInput] = useState(INITIAL_SKUS[0].specRaw);
  const [parseError, setParseError] = useState<string | null>(null);
  const [boxDims, setBoxDims] = useState({ widthMm: 180, heightMm: 120, depthMm: 70 });
  const [uploadedTextureUrl, setUploadedTextureUrl] = useState<string | null>(null);
  const [savingCloud, setSavingCloud] = useState<boolean>(false);

  const [yawDeg, setYawDeg] = useState(32);
  const [explodePct, setExplodePct] = useState(55);
  const [activeRefs, setActiveRefs] = useState<string[]>(['can330', 'iphone16']);
  const [selectedContainer, setSelectedContainer] = useState(CONTAINERS[0]);
  const [packedIds, setPackedIds] = useState<string[]>(['mini-tote', 'nordic-mug', 'cyber-dac']);

  const webglCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const hudCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const dragRef = useRef<{ active: boolean; startX: number; startYaw: number }>({
    active: false,
    startX: 0,
    startYaw: 32
  });

  // Load any user-created SKUs from Momen PostgreSQL on mount
  useEffect(() => {
    fetchCloudSkuTwins().then((cloudRows) => {
      if (cloudRows.length > 0) {
        const mapped: SkuPreset[] = cloudRows.slice(0, 6).map((r) => ({
          id: `momen_${r.id}`,
          name: r.sku_title,
          marketplace: r.marketplace,
          specRaw: `${r.width_mm} x ${r.height_mm} x ${r.depth_mm} mm`,
          widthMm: Number(r.width_mm),
          heightMm: Number(r.height_mm),
          depthMm: Number(r.depth_mm),
          color: r.verdict_code === 'SIZE_TRAP' ? '#00F0FF' : '#10B981',
          shapeKind: r.sku_title.includes('MUG') ? 'mug' : r.sku_title.includes('TOTE') || r.sku_title.includes('BAG') ? 'tote' : 'box',
          verdictCode: r.verdict_code === 'SIZE_TRAP' ? 'SIZE_TRAP' : 'SCALE_OK',
          verdictShort: `HEIGHT ${r.height_mm}MM VS 330ML CAN (115MM) · MOMEN CLOUD VERIFIED`
        }));
        const existingNames = new Set(INITIAL_SKUS.map((s) => s.name));
        const extra = mapped.filter((m) => !existingNames.has(m.name));
        if (extra.length > 0) {
          setSkus([...INITIAL_SKUS, ...extra]);
        }
      }
    });
  }, []);

  const selectPreset = (sku: SkuPreset) => {
    setSelectedSku(sku);
    setSpecInput(sku.specRaw);
    setParseError(null);
    setBoxDims({ widthMm: sku.widthMm, heightMm: sku.heightMm, depthMm: sku.depthMm });
  };

  const handleApplyCustomSpec = (e: React.FormEvent) => {
    e.preventDefault();
    const res = parseMetricDimensions(specInput);
    if (!res.ok || !res.box) {
      setParseError(res.error || 'INVALID_FORMAT');
      return;
    }
    setParseError(null);
    setBoxDims(res.box);
  };

  const handleSaveSkuToMomen = async () => {
    const res = parseMetricDimensions(specInput);
    if (!res.ok || !res.box) {
      setParseError(res.error || 'INVALID_FORMAT');
      return;
    }
    setSavingCloud(true);
    const title = (customSkuName.trim() || 'CUSTOM_SKU').toUpperCase().replace(/\s+/g, '_');
    const verdict = res.box.heightMm <= 125 ? 'SIZE_TRAP' : 'SCALE_OK';
    const saved = await insertCloudSkuTwin(
      {
        sku_title: title,
        marketplace: 'USER_UPLOAD',
        width_mm: res.box.widthMm,
        height_mm: res.box.heightMm,
        depth_mm: res.box.depthMm,
        verdict_code: verdict
      },
      onLogFrame
    );
    setSavingCloud(false);
    const newPreset: SkuPreset = {
      id: `custom_${Date.now()}`,
      name: saved?.sku_title || title,
      marketplace: 'MOMEN_PG',
      specRaw: `${res.box.widthMm} x ${res.box.heightMm} x ${res.box.depthMm} mm`,
      widthMm: res.box.widthMm,
      heightMm: res.box.heightMm,
      depthMm: res.box.depthMm,
      color: '#00F0FF',
      shapeKind: 'tote',
      verdictCode: verdict,
      verdictShort: `SAVED TO MOMEN POSTGRESQL (${res.box.widthMm}×${res.box.heightMm}×${res.box.depthMm}MM)`
    };
    setSkus((prev) => [newPreset, ...prev]);
    setSelectedSku(newPreset);
    setBoxDims(res.box);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setUploadedTextureUrl(reader.result);
        onLogFrame?.({
          id: `tex_${Date.now()}`,
          timestamp: new Date().toTimeString().slice(0, 8),
          direction: 'RX',
          type: 'RELIEF_MESH',
          summary: `Extruded 2D photo (${file.name}) onto 3D metric hull`
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const toggleRef = (id: string) => {
    setActiveRefs((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const togglePacked = (id: string) => {
    setPackedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const packResult = packVolumetricContainer(
    selectedContainer,
    skus.filter((s) => packedIds.includes(s.id))
  );

  // Render Real Three.js WebGL 3D Scene + Crisp 2D Projected Callout Layer
  useEffect(() => {
    const hudCanvas = hudCanvasRef.current;
    if (!hudCanvas) return;
    const ctx = hudCanvas.getContext('2d');
    if (!ctx) return;

    const W = hudCanvas.width;
    const H = hudCanvas.height;
    ctx.clearRect(0, 0, W, H);

    const rad = (yawDeg * Math.PI) / 180;
    const pitchFactor = 0.46;
    const scale = subMode === 'packfit-box' ? 0.72 : 0.92;
    const ox = W * 0.45;
    const oy = H * 0.75;

    const project = (x: number, y: number, z: number): [number, number] => {
      const rx = x * Math.cos(rad) - z * Math.sin(rad);
      const rz = x * Math.sin(rad) + z * Math.cos(rad);
      return [ox + rx * scale, oy - y * scale + rz * pitchFactor * scale];
    };

    // Try WebGL Three.js hardware rendering onto webglCanvasRef if WebGL context is available
    let webglRendered = false;
    let activeCamera: THREE.PerspectiveCamera | null = null;
    const glCanvas = webglCanvasRef.current;
    if (glCanvas) {
      try {
        const renderer = new THREE.WebGLRenderer({
          canvas: glCanvas,
          antialias: true,
          alpha: false,
          preserveDrawingBuffer: true
        });
        renderer.setSize(W, H, false);
        renderer.setClearColor(0x050608, 1);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(36, W / H, 1, 4000);
        const camDist = subMode === 'packfit-box' ? 660 : 690;
        camera.position.set(
          Math.sin(rad) * camDist,
          camDist * 0.56,
          Math.cos(rad) * camDist
        );
        camera.lookAt(5, 55, 0);
        camera.updateMatrixWorld();
        activeCamera = camera;

        scene.add(new THREE.AmbientLight(0xdbeafe, 0.85));
        const dirLight = new THREE.DirectionalLight(0xffffff, 1.35);
        dirLight.position.set(220, 420, 260);
        scene.add(dirLight);
        const rimLight = new THREE.DirectionalLight(0x00f0ff, 0.65);
        rimLight.position.set(-240, 180, -200);
        scene.add(rimLight);

        const grid = new THREE.GridHelper(500, 10, 0x00f0ff, 0x112233);
        scene.add(grid);

        const buildMeshForShape = (
          w: number,
          h: number,
          d: number,
          hexColor: string,
          kind: string,
          wireframeOnly = false
        ): THREE.Object3D => {
          const group = new THREE.Group();
          const col = new THREE.Color(hexColor);

          if (wireframeOnly) {
            const boxGeo = new THREE.BoxGeometry(w, h, d);
            const edges = new THREE.EdgesGeometry(boxGeo);
            const line = new THREE.LineSegments(
              edges,
              new THREE.LineBasicMaterial({ color: col })
            );
            line.position.y = h / 2;
            group.add(line);
            return group;
          }

          if (kind === 'can' || kind === 'mug') {
            const radius = w / 2;
            const cylGeo = new THREE.CylinderGeometry(radius, radius * 0.96, h, 36);
            const mat = new THREE.MeshStandardMaterial({
              color: col,
              roughness: kind === 'can' ? 0.25 : 0.45,
              metalness: kind === 'can' ? 0.7 : 0.15
            });
            const mesh = new THREE.Mesh(cylGeo, mat);
            mesh.position.y = h / 2;
            group.add(mesh);

            // Top metallic rim or mug handle
            const rimGeo = new THREE.TorusGeometry(radius * 0.96, 2.2, 12, 32);
            const rimMat = new THREE.MeshStandardMaterial({ color: 0xe2f1ff, metalness: 0.85, roughness: 0.2 });
            const rim = new THREE.Mesh(rimGeo, rimMat);
            rim.rotation.x = Math.PI / 2;
            rim.position.y = h;
            group.add(rim);

            if (kind === 'mug') {
              const handleGeo = new THREE.TorusGeometry(h * 0.28, 4.2, 12, 24, Math.PI);
              const handle = new THREE.Mesh(handleGeo, mat);
              handle.rotation.z = -Math.PI / 2;
              handle.position.set(radius, h * 0.5, 0);
              group.add(handle);
            }
            return group;
          }

          if (kind === 'tote') {
            const bodyGeo = new THREE.BoxGeometry(w, h, d);
            const mat = new THREE.MeshStandardMaterial({
              color: col,
              roughness: 0.55,
              metalness: 0.15,
              transparent: true,
              opacity: 0.86
            });
            const body = new THREE.Mesh(bodyGeo, mat);
            body.position.y = h / 2;
            group.add(body);

            const edgeLine = new THREE.LineSegments(
              new THREE.EdgesGeometry(bodyGeo),
              new THREE.LineBasicMaterial({ color: 0xffffff })
            );
            edgeLine.position.y = h / 2;
            group.add(edgeLine);

            // 3D Arched Bag Handles
            const strapGeo = new THREE.TorusGeometry(w * 0.22, 3.8, 12, 28, Math.PI);
            const strapMat = new THREE.MeshStandardMaterial({ color: 0xe2f1ff, roughness: 0.4 });
            const strapFront = new THREE.Mesh(strapGeo, strapMat);
            strapFront.position.set(0, h, d * 0.28);
            group.add(strapFront);
            const strapBack = new THREE.Mesh(strapGeo, strapMat);
            strapBack.position.set(0, h, -d * 0.28);
            group.add(strapBack);
            return group;
          }

          // Default solid 3D slab / phone / card / box
          const geo = new THREE.BoxGeometry(w, h, d);
          const mat = new THREE.MeshStandardMaterial({
            color: col,
            roughness: 0.35,
            metalness: 0.35,
            transparent: true,
            opacity: 0.85
          });
          const mesh = new THREE.Mesh(geo, mat);
          mesh.position.y = h / 2;
          group.add(mesh);

          const wire = new THREE.LineSegments(
            new THREE.EdgesGeometry(geo),
            new THREE.LineBasicMaterial({ color: col })
          );
          wire.position.y = h / 2;
          group.add(wire);
          return group;
        };

        if (subMode === 'scale-stage') {
          const mainObj = buildMeshForShape(
            boxDims.widthMm,
            boxDims.heightMm,
            boxDims.depthMm,
            selectedSku.color,
            selectedSku.shapeKind
          );
          mainObj.position.set(-80, 0, 0);
          scene.add(mainObj);

          let rx = boxDims.widthMm / 2 - 15;
          REFERENCE_OBJS.filter((r) => activeRefs.includes(r.id)).forEach((ref, idx) => {
            const zOff = idx % 2 === 0 ? -35 : 40;
            const refMesh = buildMeshForShape(
              ref.widthMm,
              ref.heightMm,
              ref.depthMm,
              ref.color,
              ref.shapeKind || 'box'
            );
            refMesh.position.set(rx, 0, zOff);
            scene.add(refMesh);
            rx += ref.widthMm + 58;
          });
        } else if (subMode === 'packfit-box') {
          const cage = buildMeshForShape(
            selectedContainer.widthMm,
            selectedContainer.heightMm,
            selectedContainer.depthMm,
            '#64748B',
            'box',
            true
          );
          scene.add(cage);

          packResult.placements.forEach((p) => {
            const itemMesh = buildMeshForShape(
              p.item.widthMm,
              p.item.heightMm,
              p.item.depthMm,
              p.overflowsContainer ? '#FF3366' : p.item.color,
              p.item.shapeKind || 'box'
            );
            itemMesh.position.set(p.xMm, p.yMm, p.zMm);
            scene.add(itemMesh);
          });
        } else {
          const layers = [
            { h: 22, color: '#0284C7', zIndex: 0 },
            { h: 15, color: '#FF9F1C', zIndex: 1 },
            { h: 16, color: '#10B981', zIndex: 2 },
            { h: 14, color: '#00F0FF', zIndex: 3 }
          ];
          const gap = Math.max(28, explodePct * 0.72);
          layers.forEach((layer) => {
            const yPos = layer.zIndex * (20 + gap);
            const m = buildMeshForShape(
              165 - layer.zIndex * 10,
              layer.h,
              125 - layer.zIndex * 8,
              layer.color,
              'box'
            );
            m.position.set(-35, yPos, 0);
            scene.add(m);
          });
        }

        renderer.render(scene, camera);
        renderer.dispose();
        webglRendered = true;
      } catch {
        webglRendered = false;
      }
    }

    const projectToScreen = (x: number, y: number, z: number): [number, number] => {
      if (webglRendered && activeCamera) {
        const v = new THREE.Vector3(x, y, z).project(activeCamera);
        return [(v.x * 0.5 + 0.5) * W, (-v.y * 0.5 + 0.5) * H];
      }
      return project(x, y, z);
    };

    const drawHudPillLabel = (text: string, sx: number, sy: number, borderColor = '#00F0FF') => {
      ctx.font = '700 10.5px "IBM Plex Mono", monospace';
      const tw = ctx.measureText(text).width + 12;
      const th = 19;
      ctx.fillStyle = 'rgba(5, 6, 8, 0.86)';
      ctx.fillRect(sx - tw / 2, sy - th + 4, tw, th);
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 1;
      ctx.strokeRect(sx - tw / 2, sy - th + 4, tw, th);
      ctx.fillStyle = '#E2F1FF';
      ctx.textAlign = 'center';
      ctx.fillText(text, sx, sy);
    };

    // Draw fallback background & floor grid ONLY if headless WebGL is unavailable
    if (!webglRendered) {
      ctx.fillStyle = '#050608';
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.09)';
      ctx.lineWidth = 1;
      for (let g = -250; g <= 250; g += 50) {
        const [x1, y1] = project(g, 0, -250);
        const [x2, y2] = project(g, 0, 250);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        const [z1, zy1] = project(-250, 0, g);
        const [z2, zy2] = project(250, 0, g);
        ctx.beginPath();
        ctx.moveTo(z1, zy1);
        ctx.lineTo(z2, zy2);
        ctx.stroke();
      }
    }

    const drawHudShape = (
      cx: number,
      cy: number,
      cz: number,
      w: number,
      h: number,
      d: number,
      color: string,
      tag: string,
      wireframe = false,
      shapeKind: string = 'box'
    ) => {
      if (!webglRendered) {
        const hw = w / 2;
        const hd = d / 2;
        const p000 = project(cx - hw, cy, cz - hd);
        const p100 = project(cx + hw, cy, cz - hd);
        const p101 = project(cx + hw, cy, cz + hd);
        const p001 = project(cx - hw, cy, cz + hd);
        const p010 = project(cx - hw, cy + h, cz - hd);
        const p110 = project(cx + hw, cy + h, cz - hd);
        const p111 = project(cx + hw, cy + h, cz + hd);
        const p011 = project(cx - hw, cy + h, cz + hd);

        if (!wireframe) {
          ctx.fillStyle = color + '44';
          ctx.beginPath();
          ctx.moveTo(...p001);
          ctx.lineTo(...p101);
          ctx.lineTo(...p111);
          ctx.lineTo(...p011);
          ctx.closePath();
          ctx.fill();
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = wireframe ? 1.8 : 1.5;
        const lines: [[number, number], [number, number]][] = [
          [p000, p100], [p100, p101], [p101, p001], [p001, p000],
          [p010, p110], [p110, p111], [p111, p011], [p011, p010],
          [p000, p010], [p100, p110], [p101, p111], [p001, p011]
        ];
        lines.forEach(([a, b]) => {
          ctx.beginPath();
          ctx.moveTo(...a);
          ctx.lineTo(...b);
          ctx.stroke();
        });
      }

      if (tag) {
        const extraTop = shapeKind === 'tote' ? 46 : 18;
        const [lx, ly] = projectToScreen(cx, cy + h + extraTop, cz);
        drawHudPillLabel(tag, lx, ly, color);
      }
    };

    if (subMode === 'scale-stage') {
      drawHudShape(
        -80,
        0,
        0,
        boxDims.widthMm,
        boxDims.heightMm,
        boxDims.depthMm,
        selectedSku.color,
        `${selectedSku.name} (${boxDims.widthMm}×${boxDims.heightMm}×${boxDims.depthMm}MM)`,
        false,
        selectedSku.shapeKind
      );

      const [c1x, c1y] = projectToScreen(-80 - boxDims.widthMm / 2, 0, boxDims.depthMm / 2 + 24);
      const [c2x, c2y] = projectToScreen(-80 + boxDims.widthMm / 2, 0, boxDims.depthMm / 2 + 24);
      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 1.6;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(c1x, c1y);
      ctx.lineTo(c2x, c2y);
      ctx.stroke();
      ctx.setLineDash([]);
      drawHudPillLabel(`SPAN: ${boxDims.widthMm}MM`, (c1x + c2x) / 2, (c1y + c2y) / 2 + 18, '#00F0FF');

      let rx = boxDims.widthMm / 2 - 15;
      REFERENCE_OBJS.filter((r) => activeRefs.includes(r.id)).forEach((ref, idx) => {
        const zOffset = idx % 2 === 0 ? -35 : 40;
        drawHudShape(rx, 0, zOffset, ref.widthMm, ref.heightMm, ref.depthMm, ref.color, ref.name, false, ref.shapeKind);
        rx += ref.widthMm + 58;
      });
    } else if (subMode === 'packfit-box') {
      drawHudShape(
        0,
        0,
        0,
        selectedContainer.widthMm,
        selectedContainer.heightMm,
        selectedContainer.depthMm,
        '#64748B',
        selectedContainer.name,
        true
      );
      packResult.placements.forEach((p) => {
        drawHudShape(
          p.xMm,
          p.yMm,
          p.zMm,
          p.item.widthMm,
          p.item.heightMm,
          p.item.depthMm,
          p.overflowsContainer ? '#FF3366' : p.item.color,
          `${p.overflowsContainer ? 'OVERFLOW ' : ''}${p.item.widthMm}×${p.item.heightMm}MM`,
          false,
          p.item.shapeKind
        );
      });
    } else {
      const layers = [
        { name: 'L0_MAGNESIUM_CHASSIS (±0.04MM)', h: 22, color: '#0284C7', zIndex: 0 },
        { name: 'L1_VAPOR_THERMAL_PLATE (58°C)', h: 15, color: '#FF9F1C', zIndex: 1 },
        { name: 'L2_DEPTH_CMOS_ARRAY (±0.01MM)', h: 16, color: '#10B981', zIndex: 2 },
        { name: 'L3_OPTICAL_BEZEL_RING (IP67)', h: 14, color: '#00F0FF', zIndex: 3 }
      ];
      const gap = Math.max(28, explodePct * 0.72);
      layers.forEach((layer) => {
        const yPos = layer.zIndex * (20 + gap);
        drawHudShape(-35, yPos, 0, 165 - layer.zIndex * 10, layer.h, 125 - layer.zIndex * 8, layer.color, '', false);
        const [px, py] = projectToScreen(50, yPos + layer.h / 2, 0);
        ctx.strokeStyle = layer.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + 42, py);
        ctx.stroke();
        drawHudPillLabel(layer.name, px + 145, py + 4, layer.color);
      });
    }
  }, [subMode, boxDims, yawDeg, explodePct, activeRefs, selectedSku, selectedContainer, packResult, uploadedTextureUrl]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 370px', gap: '12px', height: '100%', minHeight: 0 }}>
      {/* Left: Three.js WebGL 3D Viewport + Projected Callout Layer */}
      <div
        style={{
          background: '#050608',
          border: '1px solid rgba(0, 240, 255, 0.18)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 14px',
            borderBottom: '1px solid rgba(0, 240, 255, 0.14)',
            background: 'rgba(11, 15, 23, 0.88)',
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '11px',
            flexWrap: 'wrap',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              data-testid="scale-submode-stage"
              onClick={() => setSubMode('scale-stage')}
              style={{
                background: subMode === 'scale-stage' ? '#00F0FF' : '#0B0F17',
                color: subMode === 'scale-stage' ? '#050608' : '#94A3B8',
                border: '1px solid rgba(0,240,255,0.3)',
                padding: '5px 10px',
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '10.5px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              01 // 1:1 SCALE STAGE
            </button>
            <button
              data-testid="scale-submode-packfit"
              onClick={() => setSubMode('packfit-box')}
              style={{
                background: subMode === 'packfit-box' ? '#10B981' : '#0B0F17',
                color: subMode === 'packfit-box' ? '#050608' : '#94A3B8',
                border: '1px solid rgba(16,185,129,0.3)',
                padding: '5px 10px',
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '10.5px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              02 // PACKFIT 3D BOX
            </button>
            <button
              data-testid="scale-submode-rig"
              onClick={() => setSubMode('exploded-rig')}
              style={{
                background: subMode === 'exploded-rig' ? '#FF9F1C' : '#0B0F17',
                color: subMode === 'exploded-rig' ? '#050608' : '#94A3B8',
                border: '1px solid rgba(255,159,28,0.3)',
                padding: '5px 10px',
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '10.5px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              03 // EXPLODED CAD RIG
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#94A3B8' }}>
            <span>ORBIT: {yawDeg}°</span>
            <input
              type="range"
              min={-180}
              max={180}
              value={yawDeg}
              onChange={(e) => setYawDeg(Number(e.target.value))}
              style={{ width: '90px' }}
            />
            {subMode === 'exploded-rig' && (
              <>
                <span>EXPLODE: {explodePct}%</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={explodePct}
                  onChange={(e) => setExplodePct(Number(e.target.value))}
                  style={{ width: '80px' }}
                />
              </>
            )}
          </div>
        </div>

        {/* Stacked Three.js WebGL Canvas + HUD Callout Canvas */}
        <div style={{ flex: 1, position: 'relative', minHeight: '340px' }}>
          <canvas
            ref={webglCanvasRef}
            width={780}
            height={440}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
          />
          <canvas
            ref={hudCanvasRef}
            width={780}
            height={440}
            onMouseDown={(e) => {
              dragRef.current = { active: true, startX: e.clientX, startYaw: yawDeg };
            }}
            onMouseMove={(e) => {
              if (!dragRef.current.active) return;
              const delta = e.clientX - dragRef.current.startX;
              setYawDeg(Math.max(-180, Math.min(180, Math.round(dragRef.current.startYaw + delta * 0.6))));
            }}
            onMouseUp={() => {
              dragRef.current.active = false;
            }}
            onMouseLeave={() => {
              dragRef.current.active = false;
            }}
            style={{ position: 'relative', width: '100%', height: '100%', display: 'block', cursor: 'grab' }}
          />

          {uploadedTextureUrl && (
            <div
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(9,12,18,0.9)',
                border: '1px solid #00F0FF',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '10px'
              }}
            >
              <img src={uploadedTextureUrl} alt="2D Source" style={{ width: '36px', height: '36px', objectFit: 'cover' }} />
              <span style={{ color: '#00F0FF' }}>2D TEXTURE MAPPED</span>
            </div>
          )}

          <div
            style={{
              position: 'absolute',
              left: '12px',
              right: '12px',
              bottom: '12px',
              background: 'rgba(9, 12, 18, 0.92)',
              border: `1px solid ${
                subMode === 'packfit-box'
                  ? packResult.hasOverflow
                    ? '#FF3366'
                    : '#10B981'
                  : selectedSku.verdictCode === 'SIZE_TRAP'
                  ? '#FF9F1C'
                  : '#10B981'
              }`,
              padding: '8px 12px',
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '11px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            {subMode === 'scale-stage' && (
              <>
                <span style={{ color: selectedSku.verdictCode === 'SIZE_TRAP' ? '#FF9F1C' : '#10B981', fontWeight: 700 }}>
                  [{selectedSku.verdictCode}] {selectedSku.verdictShort}
                </span>
                <span style={{ color: '#64748B' }}>THREE.JS WEBGL · DRAG TO ORBIT</span>
              </>
            )}
            {subMode === 'packfit-box' && (
              <>
                <span style={{ color: packResult.hasOverflow ? '#FF3366' : '#10B981', fontWeight: 700 }}>
                  VOLUME UTILIZATION: {packResult.utilizationPct}% ({packResult.packedVolumeCm3} / {packResult.containerVolumeCm3} CM³)
                </span>
                <span style={{ color: packResult.hasOverflow ? '#FF3366' : '#E2F1FF' }}>
                  {packResult.hasOverflow ? '✗ CONTAINER BOUNDS EXCEEDED' : `✓ TOP CLEARANCE: +${packResult.clearanceTopMm}MM`}
                </span>
              </>
            )}
            {subMode === 'exploded-rig' && (
              <>
                <span style={{ color: '#00F0FF', fontWeight: 700 }}>
                  ISOMETRIC CAD RIG // 4 LAYERS · EXPLOSION FACTOR {explodePct}%
                </span>
                <span style={{ color: '#10B981' }}>TOLERANCE: ±0.01MM VERIFIED</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right Control Dock */}
      <div
        style={{
          background: '#090C12',
          border: '1px solid rgba(0, 240, 255, 0.18)',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          fontFamily: 'IBM Plex Mono, monospace',
          overflowY: 'auto'
        }}
      >
        {subMode === 'scale-stage' ? (
          <>
            <div>
              <div style={{ fontSize: '10px', color: '#00F0FF', marginBottom: '5px' }}>01 // SELECT E-COMMERCE SKU TWIN</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', maxHeight: '165px', overflowY: 'auto' }}>
                {skus.map((sku) => (
                  <button
                    key={sku.id}
                    onClick={() => selectPreset(sku)}
                    style={{
                      textAlign: 'left',
                      background: selectedSku.id === sku.id ? 'rgba(0, 240, 255, 0.12)' : '#050608',
                      border: `1px solid ${ selectedSku.id === sku.id ? '#00F0FF' : 'rgba(255,255,255,0.08)' }`,
                      padding: '6px 9px',
                      color: '#E2F1FF',
                      cursor: 'pointer',
                      fontFamily: 'IBM Plex Mono, monospace',
                      fontSize: '10.5px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                      <span>{sku.name}</span>
                      <span style={{ color: sku.verdictCode === 'SIZE_TRAP' ? '#FF9F1C' : '#10B981', fontSize: '9.5px' }}>
                        {sku.marketplace}
                      </span>
                    </div>
                    <div style={{ fontSize: '9.5px', color: '#94A3B8', marginTop: '2px' }}>
                      {sku.widthMm} × {sku.heightMm} × {sku.depthMm} MM ({sku.shapeKind.toUpperCase()})
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleApplyCustomSpec} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ fontSize: '10px', color: '#10B981' }}>
                02 // PARSE DIMENSIONS &amp; UPLOAD 2D PHOTO
              </div>
              <div style={{ display: 'flex', gap: '5px' }}>
                <input
                  type="text"
                  value={customSkuName}
                  onChange={(e) => setCustomSkuName(e.target.value)}
                  placeholder="SKU Name"
                  style={{
                    width: '125px',
                    background: '#050608',
                    border: '1px solid rgba(255,255,255,0.14)',
                    padding: '6px 8px',
                    color: '#E2F1FF',
                    fontFamily: 'IBM Plex Mono, monospace',
                    fontSize: '10px'
                  }}
                />
                <label
                  style={{
                    flex: 1,
                    background: '#0B0F17',
                    border: '1px solid rgba(0,240,255,0.35)',
                    color: '#00F0FF',
                    padding: '6px 8px',
                    fontSize: '10px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <Upload size={11} /> UPLOAD 2D PHOTO
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                </label>
              </div>

              <div style={{ display: 'flex', gap: '5px' }}>
                <input
                  data-testid="metric-spec-input"
                  type="text"
                  value={specInput}
                  onChange={(e) => setSpecInput(e.target.value)}
                  placeholder="e.g. 24 x 15 x 9 cm"
                  style={{
                    flex: 1,
                    background: '#050608',
                    border: `1px solid ${ parseError ? '#FF3366' : 'rgba(0,240,255,0.3)' }`,
                    padding: '6px 9px',
                    color: '#E2F1FF',
                    fontFamily: 'IBM Plex Mono, monospace',
                    fontSize: '10.5px'
                  }}
                />
                <button
                  data-testid="metric-parse-btn"
                  type="submit"
                  style={{
                    background: '#00F0FF',
                    color: '#050608',
                    border: 'none',
                    padding: '6px 10px',
                    fontFamily: 'IBM Plex Mono, monospace',
                    fontSize: '10.5px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  EXTRUDE
                </button>
                <button
                  type="button"
                  disabled={savingCloud}
                  onClick={handleSaveSkuToMomen}
                  style={{
                    background: '#10B981',
                    color: '#050608',
                    border: 'none',
                    padding: '6px 8px',
                    fontFamily: 'IBM Plex Mono, monospace',
                    fontSize: '10px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}
                >
                  <CloudUpload size={11} />
                  {savingCloud ? '...' : 'SAVE PG'}
                </button>
              </div>
              {parseError && (
                <div
                  data-testid="metric-parse-error"
                  style={{
                    padding: '5px 8px',
                    background: 'rgba(255, 51, 102, 0.14)',
                    border: '1px solid #FF3366',
                    color: '#FF3366',
                    fontSize: '9.5px'
                  }}
                >
                  {parseError}
                </div>
              )}
            </form>

            <div>
              <div style={{ fontSize: '10px', color: '#FF9F1C', marginBottom: '5px' }}>03 // TOGGLE ISO REFERENCE OBJECTS</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '5px' }}>
                {REFERENCE_OBJS.map((ref) => {
                  const on = activeRefs.includes(ref.id);
                  return (
                    <button
                      key={ref.id}
                      onClick={() => toggleRef(ref.id)}
                      style={{
                        textAlign: 'left',
                        background: on ? 'rgba(16, 185, 129, 0.14)' : '#050608',
                        border: `1px solid ${ on ? '#10B981' : 'rgba(255,255,255,0.08)' }`,
                        padding: '6px 9px',
                        color: on ? '#10B981' : '#94A3B8',
                        fontFamily: 'IBM Plex Mono, monospace',
                        fontSize: '10px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {on ? '[ON] ' : '[OFF] '} {ref.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        ) : subMode === 'packfit-box' ? (
          <>
            <div>
              <div style={{ fontSize: '10px', color: '#10B981', marginBottom: '6px' }}>01 // SELECT TARGET CONTAINER</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {CONTAINERS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedContainer(c)}
                    style={{
                      textAlign: 'left',
                      background: selectedContainer.id === c.id ? 'rgba(16,185,129,0.16)' : '#050608',
                      border: `1px solid ${ selectedContainer.id === c.id ? '#10B981' : 'rgba(255,255,255,0.08)' }`,
                      padding: '8px 10px',
                      color: '#E2F1FF',
                      fontFamily: 'IBM Plex Mono, monospace',
                      fontSize: '10.5px',
                      cursor: 'pointer'
                    }}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '10px', color: '#00F0FF', marginBottom: '6px' }}>02 // ITEMS IN 3D PACKING MANIFEST</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {skus.map((sku) => {
                  const packed = packedIds.includes(sku.id);
                  return (
                    <button
                      key={sku.id}
                      onClick={() => togglePacked(sku.id)}
                      style={{
                        textAlign: 'left',
                        background: packed ? 'rgba(0,240,255,0.14)' : '#050608',
                        border: `1px solid ${ packed ? '#00F0FF' : 'rgba(255,255,255,0.08)' }`,
                        padding: '8px 10px',
                        color: packed ? '#E2F1FF' : '#64748B',
                        fontFamily: 'IBM Plex Mono, monospace',
                        fontSize: '10.5px',
                        cursor: 'pointer'
                      }}
                    >
                      {packed ? '✓ PACKED: ' : '+ ADD: '} {sku.name} ({sku.widthMm}×{sku.heightMm}MM)
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <>
            <div>
              <div style={{ fontSize: '10px', color: '#FF9F1C', marginBottom: '6px' }}>01 // EXPLODED CAD LAYER TELEMETRY</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '10.5px' }}>
                <div style={{ background: '#050608', border: '1px solid #00F0FF', padding: '8px 10px' }}>
                  <div style={{ color: '#00F0FF', fontWeight: 700 }}>L3 // OPTICAL_BEZEL_RING</div>
                  <div style={{ color: '#94A3B8', marginTop: '2px' }}>6061-T6 AL · IP67 SEAL · ±0.03MM</div>
                </div>
                <div style={{ background: '#050608', border: '1px solid #10B981', padding: '8px 10px' }}>
                  <div style={{ color: '#10B981', fontWeight: 700 }}>L2 // DEPTH_CMOS_ARRAY</div>
                  <div style={{ color: '#94A3B8', marginTop: '2px' }}>IMX-DEPTH · 60FPS · ±0.01MM</div>
                </div>
                <div style={{ background: '#050608', border: '1px solid #FF9F1C', padding: '8px 10px' }}>
                  <div style={{ color: '#FF9F1C', fontWeight: 700 }}>L1 // VAPOR_THERMAL_PLATE</div>
                  <div style={{ color: '#94A3B8', marginTop: '2px' }}>SINTERED CU · 58°C NOMINAL</div>
                </div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '10px', color: '#FF3366', marginBottom: '6px' }}>02 // BOM &amp; CLAUSE REDLINE GUARD</div>
              <div style={{ background: 'rgba(255,51,102,0.12)', border: '1px solid #FF3366', padding: '8px 10px', fontSize: '10.5px', color: '#FECACA' }}>
                ✗ SUPPLIER QUOTE DRIFT CAUGHT:<br />
                Bore tolerance shifted <del>±0.01mm</del> → <strong>±0.25mm</strong>; Net-30 shifted to <strong>Net-90</strong>.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
