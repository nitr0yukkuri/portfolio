import * as THREE from 'three';

// ボード生成関数を export
export function createBoard(scene) {
  const board = new THREE.Group();
  const geometry = new THREE.BoxGeometry(1, 0.2, 1);

  const positions = [
    [0,0,0],[1.2,0,0],[2.4,0,0],[3.6,0,0],
    [3.6,0,-1.2],[3.6,0,-2.4],[3.6,0,-3.6],
    [2.4,0,-3.6],[1.2,0,-3.6],[0,0,-3.6],
    [0,0,-2.4],[0,0,-1.2]
  ];

  const material = new THREE.MeshStandardMaterial({ color: 0x00ffcc });

  // ★ positions.forEach の2番目の引数 (index) を使います
  positions.forEach((pos, index) => {
    const square = new THREE.Mesh(geometry, material);
    square.position.set(pos[0], pos[1], pos[2]);
    
    // === ★ ここが変更点 ===
    // クリックされた時に「どのマスか」を識別するためのデータを埋め込む
    square.name = `board_square_${index}`;
    square.userData = { type: 'board_square', id: index };
    // ======================

    board.add(square);
  });

  scene.add(board);
  return board;
}