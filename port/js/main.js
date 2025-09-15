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

// プレイヤー駒
const playerGeometry = new THREE.SphereGeometry(0.3, 32, 32);
const playerMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.set(0, 0.3, 0);
scene.add(player);

// カメラ
camera.position.set(4, 5, 6);
camera.lookAt(board.position);

// アニメーション
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
