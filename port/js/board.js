import * as THREE from 'three';

// マスの座標データを export (main.jsで駒の移動に使うため)
export const positions = [
  [0,0,0],[1.2,0,0],[2.4,0,0],[3.6,0,0],
  [3.6,0,-1.2],[3.6,0,-2.4],[3.6,0,-3.6],
  [2.4,0,-3.6],[1.2,0,-3.6],[0,0,-3.6],
  [0,0,-2.4],[0,0,-1.2]
];

// ボード生成関数を export
export function createBoard(scene) {
  const board = new THREE.Group();
  const geometry = new THREE.BoxGeometry(1, 0.2, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0x00ffcc });

  // マスをループで生成
  positions.forEach((pos, index) => {
    const square = new THREE.Mesh(geometry, material);
    square.position.set(pos[0], pos[1], pos[2]);
    
    // マス識別のためのIDと名前を埋め込む (main.jsのクリック判定で使う)
    square.name = `board_square_${index}`;
    square.userData = { type: 'board_square', id: index };

    board.add(square);
  });

  scene.add(board);
  return board;
}