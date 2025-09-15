// board.js: マスを作成する関数
function createBoard(scene) {
  const board = new THREE.Group();
  const geometry = new THREE.BoxGeometry(1, 0.2, 1);

  // マスの位置
  const positions = [
    [0, 0, 0],[1.2, 0, 0],[2.4, 0, 0],[3.6, 0, 0],
    [3.6, 0, -1.2],[3.6, 0, -2.4],[3.6, 0, -3.6],
    [2.4, 0, -3.6],[1.2, 0, -3.6],[0, 0, -3.6],
    [0, 0,-2.4],[0, 0,-1.3]
  ];

  // ★マスごとの色を配列で定義（すべて同じ色に設定）
  const colors = [
    0x00ffcc, 0x00ffcc, 0x00ffcc, 0x00ffcc,
    0x00ffcc, 0x00ffcc, 0x00ffcc, 0x00ffcc,
    0x00ffcc, 0x00ffcc, 0x00ffcc, 0x00ffcc
  ];

  // positions配列をループ処理。forEachの2番目の引数(index)で配列の番号を取得
  positions.forEach((pos, index) => {
    // ループの中で、colors配列から色を取り出してマテリアルを個別に作成
    const material = new THREE.MeshStandardMaterial({ color: colors[index] });
    
    // マスを作成
    const square = new THREE.Mesh(geometry, material);
    square.position.set(pos[0], pos[1], pos[2]);
    board.add(square);
  });

  scene.add(board);
  return board;
}