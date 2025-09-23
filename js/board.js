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

  // 通常マスの配色
  const colors = [
    0xb9fbc0, // パステルグリーン
    0xa7c7e7, // パステルブルー
    0xfdfd96, // パステルゴールド
    0xffadad  // パステルレッド
  ];

  // マスをループで生成
  positions.forEach((pos, index) => {
    let material;

    // ★アイデア①：スタートとゴールのマスだけ色を特別にする
    if (index === 0) {
      // スタートマスは虹色のような特別な色に
      material = new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0xcca000, roughness: 0.4, metalness: 0.8 });
    } else if (index === positions.length - 1) {
      // ゴールマスは豪華なゴールドに
      material = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.2, metalness: 0.8 });
    } else {
      // それ以外の通常マス
      material = new THREE.MeshStandardMaterial({ 
        color: colors[(index - 1) % 4], // スタートマスを除外して4色を繰り返す
        roughness: 0.9,
        metalness: 0.1
      });
    }
    
    const square = new THREE.Mesh(geometry, material);
    square.position.set(pos[0], pos[1], pos[2]);

    // ★アイデア②：マスに白い枠線を追加する
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 }); // 線の色を白に
    const line = new THREE.LineSegments(edges, lineMaterial);
    square.add(line); // 作成した枠線をマスに追加
    
    // マス識別のためのIDと名前を埋め込む
    square.name = `board_square_${index}`;
    square.userData = { type: 'board_square', id: index };

    board.add(square);
  });

  scene.add(board);
  return board;
}