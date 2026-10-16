import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CubeState, FaceName, ColorName, COLOR_HEX } from '../../core/cube/CubeState';
import { Cube2DNet } from './Cube2DNet';
import { RotateCw, ZoomIn, ZoomOut, Maximize2, RefreshCw } from 'lucide-react';

interface Cube3DProps {
  cube: CubeState;
  selectedSticker?: { face: FaceName; index: number } | null;
  highlightedStickers?: { face: FaceName; index: number }[];
  onStickerClick?: (face: FaceName, index: number) => void;
  interactive?: boolean;
  animatingMove?: string | null;
  animationProgress?: number; // 0 to 1
  autoRotate?: boolean;
  className?: string;
}

// Maps 3D coordinate and face normal to FaceName and 0-8 sticker index
function getStickerFromCoord(
  x: number,
  y: number,
  z: number,
  normal: THREE.Vector3
): { face: FaceName; index: number } | null {
  const roundX = Math.round(x);
  const roundY = Math.round(y);
  const roundZ = Math.round(z);

  // Normal +Y -> Up (U)
  if (normal.y > 0.5) {
    const row = roundZ + 1; // z: -1 -> 0, 0 -> 1, 1 -> 2
    const col = roundX + 1; // x: -1 -> 0, 0 -> 1, 1 -> 2
    return { face: 'U', index: row * 3 + col };
  }
  // Normal -Y -> Down (D)
  if (normal.y < -0.5) {
    const row = 1 - roundZ; // z: 1 -> 0, 0 -> 1, -1 -> 2
    const col = roundX + 1; // x: -1 -> 0, 0 -> 1, 1 -> 2
    return { face: 'D', index: row * 3 + col };
  }
  // Normal +Z -> Front (F)
  if (normal.z > 0.5) {
    const row = 1 - roundY; // y: 1 -> 0, 0 -> 1, -1 -> 2
    const col = roundX + 1; // x: -1 -> 0, 0 -> 1, 1 -> 2
    return { face: 'F', index: row * 3 + col };
  }
  // Normal -Z -> Back (B)
  if (normal.z < -0.5) {
    const row = 1 - roundY; // y: 1 -> 0, 0 -> 1, -1 -> 2
    const col = 1 - roundX; // x: 1 -> 0, 0 -> 1, -1 -> 2
    return { face: 'B', index: row * 3 + col };
  }
  // Normal +X -> Right (R)
  if (normal.x > 0.5) {
    const row = 1 - roundY; // y: 1 -> 0, 0 -> 1, -1 -> 2
    const col = 1 - roundZ; // z: 1 -> 0, 0 -> 1, -1 -> 2
    return { face: 'R', index: row * 3 + col };
  }
  // Normal -X -> Left (L)
  if (normal.x < -0.5) {
    const row = 1 - roundY; // y: 1 -> 0, 0 -> 1, -1 -> 2
    const col = roundZ + 1; // z: -1 -> 0, 0 -> 1, 1 -> 2
    return { face: 'L', index: row * 3 + col };
  }

  return null;
}

export const Cube3D: React.FC<Cube3DProps> = ({
  cube,
  selectedSticker,
  highlightedStickers = [],
  onStickerClick,
  interactive = false,
  autoRotate = false,
  className = 'w-full h-80 sm:h-96 md:h-[450px]',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cubiesRef = useRef<THREE.Mesh[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const [isRotating, setIsRotating] = useState(autoRotate);
  const [webGlFailed, setWebGlFailed] = useState(false);

  const CUBIE_SIZE = 0.94;
  const SPACING = 1.0;
  const BLACK_COLOR = 0x18181b;

  // Material cache to prevent GPU memory leaks
  const colorMaterialsRef = useRef<Record<string, THREE.MeshStandardMaterial>>({});

  const getMaterial = useCallback((colorHex: string, roughness = 0.35, metalness = 0.05) => {
    if (!colorMaterialsRef.current[colorHex]) {
      colorMaterialsRef.current[colorHex] = new THREE.MeshStandardMaterial({
        color: new THREE.Color(colorHex),
        roughness,
        metalness,
      });
    }
    return colorMaterialsRef.current[colorHex];
  }, []);

  // Update cubie face materials based on current CubeState
  const updateCubeMaterials = useCallback(() => {
    if (cubiesRef.current.length === 0) return;

    const blackMaterial = getMaterial('#18181b', 0.8, 0.1);
    const selectedGlowMaterial = getMaterial('#3B82F6', 0.1, 0.5);
    const warningGlowMaterial = getMaterial('#EF4444', 0.1, 0.5);

    for (const mesh of cubiesRef.current) {
      const x = Math.round(mesh.position.x);
      const y = Math.round(mesh.position.y);
      const z = Math.round(mesh.position.z);

      const materials = (mesh.material as THREE.Material[]).slice();

      // Materials order in Three.js BoxGeometry:
      // [0]: +X (Right, R)
      // [1]: -X (Left, L)
      // [2]: +Y (Up, U)
      // [3]: -Y (Down, D)
      // [4]: +Z (Front, F)
      // [5]: -Z (Back, B)

      // +X (Right)
      if (x === 1) {
        const info = getStickerFromCoord(x, y, z, new THREE.Vector3(1, 0, 0));
        if (info) {
          const isSel = selectedSticker?.face === info.face && selectedSticker?.index === info.index;
          const isHigh = highlightedStickers.some(h => h.face === info.face && h.index === info.index);
          const col = isSel ? '#3B82F6' : isHigh ? '#EF4444' : COLOR_HEX[cube[info.face][info.index]];
          materials[0] = getMaterial(col);
        }
      } else {
        materials[0] = blackMaterial;
      }

      // -X (Left)
      if (x === -1) {
        const info = getStickerFromCoord(x, y, z, new THREE.Vector3(-1, 0, 0));
        if (info) {
          const isSel = selectedSticker?.face === info.face && selectedSticker?.index === info.index;
          const isHigh = highlightedStickers.some(h => h.face === info.face && h.index === info.index);
          const col = isSel ? '#3B82F6' : isHigh ? '#EF4444' : COLOR_HEX[cube[info.face][info.index]];
          materials[1] = getMaterial(col);
        }
      } else {
        materials[1] = blackMaterial;
      }

      // +Y (Up)
      if (y === 1) {
        const info = getStickerFromCoord(x, y, z, new THREE.Vector3(0, 1, 0));
        if (info) {
          const isSel = selectedSticker?.face === info.face && selectedSticker?.index === info.index;
          const isHigh = highlightedStickers.some(h => h.face === info.face && h.index === info.index);
          const col = isSel ? '#3B82F6' : isHigh ? '#EF4444' : COLOR_HEX[cube[info.face][info.index]];
          materials[2] = getMaterial(col);
        }
      } else {
        materials[2] = blackMaterial;
      }

      // -Y (Down)
      if (y === -1) {
        const info = getStickerFromCoord(x, y, z, new THREE.Vector3(0, -1, 0));
        if (info) {
          const isSel = selectedSticker?.face === info.face && selectedSticker?.index === info.index;
          const isHigh = highlightedStickers.some(h => h.face === info.face && h.index === info.index);
          const col = isSel ? '#3B82F6' : isHigh ? '#EF4444' : COLOR_HEX[cube[info.face][info.index]];
          materials[3] = getMaterial(col);
        }
      } else {
        materials[3] = blackMaterial;
      }

      // +Z (Front)
      if (z === 1) {
        const info = getStickerFromCoord(x, y, z, new THREE.Vector3(0, 0, 1));
        if (info) {
          const isSel = selectedSticker?.face === info.face && selectedSticker?.index === info.index;
          const isHigh = highlightedStickers.some(h => h.face === info.face && h.index === info.index);
          const col = isSel ? '#3B82F6' : isHigh ? '#EF4444' : COLOR_HEX[cube[info.face][info.index]];
          materials[4] = getMaterial(col);
        }
      } else {
        materials[4] = blackMaterial;
      }

      // -Z (Back)
      if (z === -1) {
        const info = getStickerFromCoord(x, y, z, new THREE.Vector3(0, 0, -1));
        if (info) {
          const isSel = selectedSticker?.face === info.face && selectedSticker?.index === info.index;
          const isHigh = highlightedStickers.some(h => h.face === info.face && h.index === info.index);
          const col = isSel ? '#3B82F6' : isHigh ? '#EF4444' : COLOR_HEX[cube[info.face][info.index]];
          materials[5] = getMaterial(col);
        }
      } else {
        materials[5] = blackMaterial;
      }

      mesh.material = materials;
    }
  }, [cube, selectedSticker, highlightedStickers, getMaterial]);

  // Initial Scene Setup
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 360;
    const height = container.clientHeight || 360;

    let renderer: THREE.WebGLRenderer | null = null;
    let handleResize: (() => void) | null = null;

    try {
      // Scene
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // Camera
      const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
      camera.position.set(4.5, 4.0, 5.5);
      cameraRef.current = camera;

      // Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.shadowMap.enabled = true;
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.minDistance = 4;
      controls.maxDistance = 14;
      controls.enablePan = false;
      controlsRef.current = controls;

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
      scene.add(ambientLight);

      const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.8);
      dirLight1.position.set(6, 10, 8);
      scene.add(dirLight1);

      const dirLight2 = new THREE.DirectionalLight(0xffffff, 1.1);
      dirLight2.position.set(-8, -6, -6);
      scene.add(dirLight2);

      const dirLight3 = new THREE.DirectionalLight(0xffffff, 0.7);
      dirLight3.position.set(0, -8, 8);
      scene.add(dirLight3);

      // Build the 27 cubie meshes
      const cubies: THREE.Mesh[] = [];
      const geom = new THREE.BoxGeometry(CUBIE_SIZE, CUBIE_SIZE, CUBIE_SIZE);

      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          for (let z = -1; z <= 1; z++) {
            const materials: THREE.MeshStandardMaterial[] = Array(6)
              .fill(null)
              .map(() => getMaterial('#18181b', 0.8, 0.1));

            const cubie = new THREE.Mesh(geom, materials);
            cubie.position.set(x * SPACING, y * SPACING, z * SPACING);
            cubie.userData = { x, y, z };
            scene.add(cubie);
            cubies.push(cubie);
          }
        }
      }
      cubiesRef.current = cubies;

      // Animation Loop
      const animate = () => {
        animFrameRef.current = requestAnimationFrame(animate);
        if (isRotating && controlsRef.current) {
          scene.rotation.y += 0.006;
        }
        controls.update();
        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }
      };
      animate();

      // Handle Window Resize
      handleResize = () => {
        if (!container || !renderer || !camera) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', handleResize);
    } catch (err) {
      console.warn('Cube3D WebGL initialization failed, switching to 2D net:', err);
      setWebGlFailed(true);
    }

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (handleResize) window.removeEventListener('resize', handleResize);
      if (renderer) {
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
      cubiesRef.current = [];
    };
  }, []);

  // Update materials when cube state changes
  useEffect(() => {
    updateCubeMaterials();
  }, [cube, selectedSticker, highlightedStickers, updateCubeMaterials]);

  // Handle Raycasting for sticker clicks
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !onStickerClick || !containerRef.current || !cameraRef.current || !sceneRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    const intersects = raycaster.intersectObjects(cubiesRef.current);
    if (intersects.length > 0) {
      const hit = intersects[0];
      const mesh = hit.object as THREE.Mesh;
      const normal = hit.face?.normal?.clone();

      if (normal) {
        normal.transformDirection(mesh.matrixWorld);
        const info = getStickerFromCoord(mesh.position.x, mesh.position.y, mesh.position.z, normal);
        if (info) {
          onStickerClick(info.face, info.index);
        }
      }
    }
  };

  const resetCamera = () => {
    if (cameraRef.current && controlsRef.current && sceneRef.current) {
      cameraRef.current.position.set(4.5, 4.0, 5.5);
      controlsRef.current.target.set(0, 0, 0);
      sceneRef.current.rotation.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  if (webGlFailed) {
    return (
      <div className={`flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-900 border border-gray-800 ${className}`}>
        <div className="text-xs text-gray-400 mb-2 font-medium">2D Compatibility Mode Active</div>
        <Cube2DNet
          cube={cube}
          interactive={interactive}
          selectedSticker={selectedSticker}
          highlightedStickers={highlightedStickers}
          onStickerClick={onStickerClick}
        />
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center select-none overflow-hidden rounded-2xl bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 border border-gray-800/80 shadow-2xl ${className}`}>
      {/* 3D Canvas Container */}
      <div
        ref={containerRef}
        onClick={handleClick}
        className={`w-full h-full ${interactive ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'}`}
      />

      {/* Floating Toolbar Controls */}
      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 p-1 bg-gray-900/80 backdrop-blur-md rounded-xl border border-gray-700/60 shadow-lg z-10">
        <button
          type="button"
          onClick={() => setIsRotating(prev => !prev)}
          title={isRotating ? 'Stop Auto-Rotate' : 'Start Auto-Rotate'}
          className={`p-2 rounded-lg text-sm transition-colors ${
            isRotating ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
          }`}
        >
          <RotateCw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} />
        </button>

        <button
          type="button"
          onClick={resetCamera}
          title="Reset Camera View"
          className="p-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {controlsRef.current && (
          <>
            <button
              type="button"
              onClick={() => {
                if (cameraRef.current) {
                  cameraRef.current.position.multiplyScalar(0.85);
                  controlsRef.current?.update();
                }
              }}
              title="Zoom In"
              className="p-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                if (cameraRef.current) {
                  cameraRef.current.position.multiplyScalar(1.15);
                  controlsRef.current?.update();
                }
              }}
              title="Zoom Out"
              className="p-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Orientation Helper Watermark */}
      <div className="absolute top-3 left-3 pointer-events-none flex items-center gap-2 px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-sm border border-white/5 text-[11px] text-gray-400 font-mono">
        <span className="w-2 h-2 rounded-full bg-white inline-block" /> Top: White
        <span className="w-2 h-2 rounded-full bg-green-500 inline-block ml-1" /> Front: Green
      </div>
    </div>
  );
};
