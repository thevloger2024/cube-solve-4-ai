import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { CubeState, COLOR_HEX } from '../../core/cube/CubeState';

interface MiniCube3DProps {
  cube: CubeState;
  size?: number;
  autoRotate?: boolean;
}

export const MiniCube3D: React.FC<MiniCube3DProps> = ({
  cube,
  size = 140,
  autoRotate = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cubiesRef = useRef<THREE.Mesh[]>([]);
  const animRef = useRef<number | null>(null);
  const [webGlFailed, setWebGlFailed] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;
    const mount = mountRef.current;

    try {
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
      camera.position.set(4.2, 3.8, 5.0);
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(size, size);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      mount.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 1.6);
      dirLight.position.set(5, 8, 6);
      scene.add(dirLight);

      const geom = new THREE.BoxGeometry(0.92, 0.92, 0.92);
      const blackMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.6 });

      const cubies: THREE.Mesh[] = [];
      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          for (let z = -1; z <= 1; z++) {
            const materials = Array(6).fill(blackMat);
            const mesh = new THREE.Mesh(geom, materials);
            mesh.position.set(x, y, z);
            mesh.userData = { x, y, z };
            scene.add(mesh);
            cubies.push(mesh);
          }
        }
      }
      cubiesRef.current = cubies;

      const animate = () => {
        animRef.current = requestAnimationFrame(animate);
        if (autoRotate && scene) {
          scene.rotation.y += 0.012;
        }
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        if (animRef.current) cancelAnimationFrame(animRef.current);
        renderer.dispose();
        if (mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement);
        }
        cubiesRef.current = [];
      };
    } catch (e) {
      console.warn('MiniCube3D WebGL fallback triggered:', e);
      setWebGlFailed(true);
    }
  }, [size, autoRotate]);

  // Update sticker colors
  useEffect(() => {
    if (webGlFailed || cubiesRef.current.length === 0) return;

    for (const mesh of cubiesRef.current) {
      const { x, y, z } = mesh.userData;
      const materials = (mesh.material as THREE.Material[]).slice();

      const getMat = (hex: string) =>
        new THREE.MeshStandardMaterial({ color: new THREE.Color(hex), roughness: 0.35 });

      if (x === 1) {
        const row = 1 - y;
        const col = 1 - z;
        materials[0] = getMat(COLOR_HEX[cube.R[row * 3 + col]]);
      }
      if (x === -1) {
        const row = 1 - y;
        const col = z + 1;
        materials[1] = getMat(COLOR_HEX[cube.L[row * 3 + col]]);
      }
      if (y === 1) {
        const row = z + 1;
        const col = x + 1;
        materials[2] = getMat(COLOR_HEX[cube.U[row * 3 + col]]);
      }
      if (y === -1) {
        const row = 1 - z;
        const col = x + 1;
        materials[3] = getMat(COLOR_HEX[cube.D[row * 3 + col]]);
      }
      if (z === 1) {
        const row = 1 - y;
        const col = x + 1;
        materials[4] = getMat(COLOR_HEX[cube.F[row * 3 + col]]);
      }
      if (z === -1) {
        const row = 1 - y;
        const col = 1 - x;
        materials[5] = getMat(COLOR_HEX[cube.B[row * 3 + col]]);
      }

      mesh.material = materials;
    }
  }, [cube, webGlFailed]);

  if (webGlFailed) {
    // 2D SVG preview fallback
    return (
      <div style={{ width: size, height: size }} className="flex items-center justify-center p-2">
        <div className="grid grid-cols-3 gap-0.5 p-1 bg-gray-950 rounded-lg">
          {cube.F.map((c, i) => (
            <div
              key={i}
              style={{ backgroundColor: COLOR_HEX[c] }}
              className="w-5 h-5 rounded-sm"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      style={{ width: size, height: size }}
      className="flex items-center justify-center select-none pointer-events-none"
    />
  );
};
