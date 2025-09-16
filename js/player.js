import * as THREE from 'three';

// プレイヤー（駒）を作成して返す専門の関数
export function createPlayer() {

  const playerMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
  const player = new THREE.Group();
  const boardTopY = 0.1; // ボードの上面の高さ

  // Base
  const baseHeight = 0.1;
  const baseRadius = 0.25;
  const baseGeo = new THREE.CylinderGeometry(baseRadius, baseRadius, baseHeight, 32);
  const baseMesh = new THREE.Mesh(baseGeo, playerMaterial);
  baseMesh.position.y = boardTopY + baseHeight / 2;
  baseMesh.userData = { type: 'PLAYER' }; // 識別データ
  player.add(baseMesh);

  // Body
  const bodyHeight = 0.3;
  const bodyGeo = new THREE.CylinderGeometry(0.1, 0.2, bodyHeight, 32);
  const bodyMesh = new THREE.Mesh(bodyGeo, playerMaterial);
  bodyMesh.position.y = boardTopY + baseHeight + bodyHeight / 2;
  bodyMesh.userData = { type: 'PLAYER' }; // 識別データ
  player.add(bodyMesh);

  // Head
  const headRadius = 0.15;
  const headGeo = new THREE.SphereGeometry(headRadius, 32, 32);
  const headMesh = new THREE.Mesh(headGeo, playerMaterial);
  headMesh.position.y = boardTopY + baseHeight + bodyHeight + headRadius;
  headMesh.userData = { type: 'PLAYER' }; // 識別データ
  player.add(headMesh);

  // 作成した駒（グループ）を返す
  return player;
}