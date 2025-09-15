import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// ★ HDRI(.hdrファイル)を読み込むためのローダーを追加
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'; 
import { createBoard, positions } from './board.js';

// === ポートフォリオ用のデータ ===
const profileData = { title: "俺のプロフィール", description: "名前：〇〇。やりたいこと：〇〇。スキル：〇〇。" };
const eventData = [
  { title: "スタート地点", description: "俺のポートフォリオへようこそ！" }, // 0
  { title: "〇〇ハッカソン", description: "ここで「〇〇賞」を優勝しました！" }, // 1
  { title: "イベント 2", description: "ここに実績2が入ります。" }, // 2
  // ( ... 他のイベントデータ ... )
  { title: "ゴール！", description: "最後まで見てくれてありがとう！" } // 11
];
let currentPlayerIndex = 0; 

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
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); 
scene.add(ambientLight);


// === ★★★ これが今回の修正点 (3D背景の読み込み) ★★★ ===
// ↓↓↓ このURLを差し替える
const hdriURL = 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/qwantani_night_puresky_1k.hdr'; // 無料のHDRIアセット
const loader = new RGBELoader();
loader.load(hdriURL, (texture) => {
  // 読み込んだテクスチャを360度の球体としてマッピングする設定
  texture.mapping = THREE.EquirectangularReflectionMapping;
  
  // シーンの背景 (Background) として設定
  scene.background = texture;
  
  // シーンの環境光 (Environment) としても設定
  // (これにより、HDRIの光が駒やマスを照らし、リアルな反射が生まれる)
  scene.environment = texture;
});
// ===============================================


// === Board ===
const board = createBoard(scene); 

// === Player ===
// ( ... 駒のパーツ作成コード（省略） ... )
const playerMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
const player = new THREE.Group();
const boardTopY = 0.1;
const baseHeight = 0.1;
const baseRadius = 0.25;
const baseGeo = new THREE.CylinderGeometry(baseRadius, baseRadius, baseHeight, 32);
const baseMesh = new THREE.Mesh(baseGeo, playerMaterial);
baseMesh.position.y = boardTopY + baseHeight / 2;
baseMesh.userData = { type: 'PLAYER' }; 
player.add(baseMesh);
const bodyHeight = 0.3;
const bodyGeo = new THREE.CylinderGeometry(0.1, 0.2, bodyHeight, 32);
const bodyMesh = new THREE.Mesh(bodyGeo, playerMaterial);
bodyMesh.position.y = boardTopY + baseHeight + bodyHeight / 2;
bodyMesh.userData = { type: 'PLAYER' };
player.add(bodyMesh);
const headRadius = 0.15;
const headGeo = new THREE.SphereGeometry(headRadius, 32, 32);
const headMesh = new THREE.Mesh(headGeo, playerMaterial);
headMesh.position.y = boardTopY + baseHeight + bodyHeight + headRadius;
headMesh.userData = { type: 'PLAYER' };
player.add(headMesh);
player.position.set(positions[0][0], positions[0][1], positions[0][2]);
scene.add(player);


// === Camera & Controls ===
camera.position.set(4,5,6);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(1.8,0,-1.8);
controls.enableDamping = true;

// === Raycaster ===
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

// === Animate Loop ===
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// === HTML/CSSの読み込み完了後に実行する処理 ===
window.addEventListener('DOMContentLoaded', () => {

  // HTML要素取得
  const infoBox = document.getElementById('info-box');
  const infoTitle = document.getElementById('info-title');
  const infoDescription = document.getElementById('info-description');
  const closeBtn = document.getElementById('info-close-btn');

  // ポップアップ関数
  function showInfoBox(title, description) {
    infoTitle.innerText = title;
    infoDescription.innerText = description;
    infoBox.classList.add('visible'); 
  }
  function hideInfoBox() {
    infoBox.classList.remove('visible');
  }
  
  // ポップアップのイベントリスナー
  closeBtn.addEventListener('click', hideInfoBox);
  infoBox.addEventListener('click', (event) => event.stopPropagation()); 

  // 3D空間のクリック判定
  function onWindowClick( event ) {
    if (infoBox.classList.contains('visible')) { return; }
    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    raycaster.setFromCamera( pointer, camera );
    const objectsToCheck = [ ...board.children, ...player.children ];
    const intersects = raycaster.intersectObjects( objectsToCheck );
    if ( intersects.length > 0 ) {
      const clickedObject = intersects[0].object;
      if ( clickedObject.userData.type === 'PLAYER' ) {
        showInfoBox( profileData.title, profileData.description );
      } else if ( clickedObject.userData.type === 'board_square' ) {
        const eventId = clickedObject.userData.id;
        const data = eventData[eventId];
        showInfoBox( data.title, data.description );
      }
    }
  }
  window.addEventListener( 'click', onWindowClick );
  
  // Window Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // キーボード操作のロジック
  function movePlayerToIndex(index) {
    if (index >= 0 && index < positions.length) {
      currentPlayerIndex = index; 
      const newPos = positions[currentPlayerIndex]; 
      player.position.set(newPos[0], newPos[1], newPos[2]);
    } else {
      console.log("それ以上進めません（ゴールまたはスタート）");
    }
  }
  window.addEventListener('keydown', (event) => {
    if (infoBox.classList.contains('visible')) { return; }
    if (event.key === 'ArrowRight') {
      movePlayerToIndex(currentPlayerIndex + 1); 
    }
  });

});