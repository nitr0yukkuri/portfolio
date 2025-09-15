// ★ この行が https://... のURLになっているか確認してください
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

// ボード生成関数を export
export function createBoard(scene) {
  const board = new THREE.Group();
  const geometry = new THREE.BoxGeometry(1, 0.2, 1);

  // (あなたの最新の positions 配列)
  const positions = [
    [0,0,0],[1.2,0,0],[2.4,0,0],[3.6,0,0],
    [3.6,0,-1.2],[3.6,0,-2.4],[3.6,0,-3.6],
    [2.4,0,-3.6],[1.2,0,-3.6],[0,0,-3.6],
    [0,0,-2.4],[0,0,-1.2]
  ];

  // (単色に戻したマテリアル)
  const material = new THREE.MeshStandardMaterial({ color: 0x00ffcc });

  positions.forEach(pos => {
    const square = new THREE.Mesh(geometry, material);
    square.position.set(pos[0], pos[1], pos[2]);
    board.add(square);
  });

  scene.add(board);
  return board;
}