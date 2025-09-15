// board.js: マスを作成する関数
function createBoard(scene) {
  const board = new THREE.Group();
  const geometry = new THREE.BoxGeometry(1, 0.2, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0x00ffcc });

  const positions = [
    [0, 0, 0],[1.2, 0, 0],[2.4, 0, 0],[3.6, 0, 0],
    [3.6, 0, -1.2],[3.6, 0, -2.4],[3.6, 0, -3.6],
    [2.4, 0, -3.6],[1.2, 0, -3.6],[0, 0, -3.6],
    [0, 0,-2.4],[0, 0,-1.3]
  ];

  positions.forEach(pos => {
    const square = new THREE.Mesh(geometry, material);
    square.position.set(pos[0], pos[1], pos[2]);
    board.add(square);
  });

  scene.add(board);
  return board;
}
