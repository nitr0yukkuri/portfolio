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

  // ご要望に合わせてホワイトをパステルレッドに変更した配色
  const colors = [
    0xb9fbc0, // パステルグリーン
    0xa7c7e7, // パステルブルー
    0xfdfd96, // パステルゴールド
    0xffadad  // パステルレッド
  ];

  // マスをループで生成
  positions.forEach((pos, index) => {
    // ループの中で、マス一つ一つのマテリアル（色と質感）を作成
    const material = new THREE.MeshStandardMaterial({ 
      color: colors[index % 4], // 4色を順番に繰り返す
      roughness: 0.9,           // 光沢を抑える（0に近いほどツルツル、1に近いほどザラザラ）
      metalness: 0.1          // 金属っぽさを抑える
    });
    
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