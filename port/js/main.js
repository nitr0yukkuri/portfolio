// main.js: メイン処理
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias:true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ライト
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 10, 5);
scene.add(light);

// ボード作成
const board = createBoard(scene);


// === 駒の定義 ===

// プレイヤー駒 (チェス・ポーン風)
// ★共通のマテリアル（材質）の色を青に変更
const playerMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff }); // 0xff0000 から変更
// 駒全体をまとめるグループを作成
const player = new THREE.Group();

// ボードの上面の高さ (BoxGeometry(height: 0.2)がY:0に配置されているため上面は 0.1)
const boardTopY = 0.1;

// 1. ベース (平たい円柱)
const baseHeight = 0.1;
const baseRadius = 0.25;
const baseGeo = new THREE.CylinderGeometry(baseRadius, baseRadius, baseHeight, 32);
const baseMesh = new THREE.Mesh(baseGeo, playerMaterial); // 共通マテリアルを使用
baseMesh.position.y = boardTopY + (baseHeight / 2); 
player.add(baseMesh); 

// 2. 胴体 (先細の円柱)
const bodyHeight = 0.3;
const bodyGeo = new THREE.CylinderGeometry(0.1, 0.2, bodyHeight, 32); 
const bodyMesh = new THREE.Mesh(bodyGeo, playerMaterial); // 共通マテリアルを使用
const baseTopY = boardTopY + baseHeight; 
bodyMesh.position.y = baseTopY + (bodyHeight / 2); 
player.add(bodyMesh); 

// 3. 頭 (球)
const headRadius = 0.15;
const headGeo = new THREE.SphereGeometry(headRadius, 32, 32);
const headMesh = new THREE.Mesh(headGeo, playerMaterial); // 共通マテリアルを使用
const bodyTopY = baseTopY + bodyHeight; 
headMesh.position.y = bodyTopY; 
player.add(headMesh); 

// グループ全体をシーンに追加
player.position.set(0, 0, 0); 
scene.add(player);

// === ここまで駒の定義 ===


// カメラ
camera.position.set(4, 5, 6);
camera.lookAt(board.position);

// アニメーション
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();