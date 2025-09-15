import * as THREE from 'three';

// === ★ ここが変更点 ===
// マスの座標データを関数（createBoard）の外に出し、export（公開）する
// これにより main.js が「マスの順番と座標リスト」を読み込めるようになる
export const positions = [
  [0,0,0],[1.2,0,0],[2.4,0,0],[3.6,0,0],
  [3.6,0,-1.2],[3.6,0,-2.4],[3.6,0,-3.6],
  [2.4,0,-3.6],[1.2,0,-3.6],[0,0,-3.6],
  [0,0,-2.4],[0,0,-1.2]
];
// ====================


// ボード生成関数を export
export function createBoard(scene) {
  const board = new THREE.Group();
  const geometry = new THREE.BoxGeometry(1, 0.2, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0x00ffcc });

  // (関数の中では、上で export した positions 配列を参照するように変更)
  positions.forEach((pos, index) => {
    const square = new THREE.Mesh(geometry, material);
    square.position.set(pos[0], pos[1], pos[2]);
    
    square.name = `board_square_${index}`;
    square.userData = { type: 'board_square', id: index };

    board.add(square);
  });

  scene.add(board);
  return board;
}