import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createBoard } from './board.js';

// === Scene, Camera, Renderer ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias:true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// === Light ===
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 10, 5);
scene.add(light);

// === Board ===
const board = createBoard(scene); // board.children にマスのメッシュ配列が入る

// === Player ===
const playerMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
const player = new THREE.Group();
const boardTopY = 0.1;
// Base
const baseHeight = 0.1;
const baseRadius = 0.25;
const baseGeo = new THREE.CylinderGeometry(baseRadius, baseRadius, baseHeight, 32);
const baseMesh = new THREE.Mesh(baseGeo, playerMaterial);
baseMesh.position.y = boardTopY + baseHeight / 2;
baseMesh.userData = { type: 'PLAYER' }; // ★ 識別データを追加
player.add(baseMesh);
// Body
const bodyHeight = 0.3;
const bodyGeo = new THREE.CylinderGeometry(0.1, 0.2, bodyHeight, 32);
const bodyMesh = new THREE.Mesh(bodyGeo, playerMaterial);
bodyMesh.position.y = boardTopY + baseHeight + bodyHeight / 2;
bodyMesh.userData = { type: 'PLAYER' }; // ★ 識別データを追加
player.add(bodyMesh);
// Head
const headRadius = 0.15;
const headGeo = new THREE.SphereGeometry(headRadius, 32, 32);
const headMesh = new THREE.Mesh(headGeo, playerMaterial);
headMesh.position.y = boardTopY + baseHeight + bodyHeight + headRadius;
headMesh.userData = { type: 'PLAYER' }; // ★ 識別データを追加
player.add(headMesh);
player.position.set(0,0,0);
scene.add(player);

// === Camera & Controls ===
camera.position.set(4,5,6);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(1.8,0,-1.8);
controls.enableDamping = true;


// === ★ ここから Raycaster（クリック判定）のセットアップ ===
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onClick( event ) {
  // 画面のどこをクリックしたか(-1 ~ +1の範囲で)計算
  pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  // レイ（光線）をカメラの位置からクリックした方向へ飛ばす
  raycaster.setFromCamera( pointer, camera );

  // 判定対象のオブジェクト配列（ボードの全ての子メッシュと、プレイヤーの全ての子メッシュ）
  const objectsToCheck = [ ...board.children, ...player.children ];
  
  // 光線が当たったオブジェクトをすべて取得
  const intersects = raycaster.intersectObjects( objectsToCheck );

  // もし何かに当たっていたら
  if ( intersects.length > 0 ) {
    
    const clickedObject = intersects[0].object; // 一番手前にあるオブジェクト

    // 当たったオブジェクトの userData を確認
    if ( clickedObject.userData.type === 'PLAYER' ) {
      console.log( '【クリック】: 駒（プレイヤー）が押されました！' );
      // TODO: ここでプロフィールを表示する処理（ステップ4）
    }
    else if ( clickedObject.userData.type === 'board_square' ) {
      console.log( `【クリック】: マス ${clickedObject.userData.id} が押されました！ ( ${clickedObject.name} )` );
      // TODO: ここでマスごとのイベントを表示する処理（ステップ4）
    }
  }
}
// window にクリックイベントを登録
window.addEventListener( 'click', onClick );
// === ★ クリック判定ここまで ===


// === Animate Loop ===
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// === Window Resize 対応 ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});