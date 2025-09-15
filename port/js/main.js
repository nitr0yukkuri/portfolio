import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'; 
import { createBoard, positions } from './board.js';

// === ブルーム（Bloom）エフェクトに必要な部品をインポート ===
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';


// === ポートフォリオ用のデータ ===
const profileData = { title: "俺のプロフィール", description: "名前：〇〇。やりたいこと：〇〇。スキル：〇〇。" };
const eventData = [
  { title: "スタート地点", description: "俺のポートフォリオへようこそ！" }, // 0
  { title: "〇〇ハッカソン", description: "ここで「〇〇賞」を優勝しました！" }, // 1
  { title: "イベント 2", description: "ここに実績2が入ります。" }, // 2
  { title: "イベント 3", description: "ここに実績3が入ります。" }, // 3
  { title: "イベント 4", description: "ここに実績4が入ります。" }, // 4
  { title: "イベント 5", description: "ここに実績5が入ります。" }, // 5
  { title: "イベント 6", description: "ここに実績6が入ります。" }, // 6
  { title: "イベント 7", description: "ここに実績7が入ります。" }, // 7
  { title: "イベント 8", description: "ここに実績8が入ります。" }, // 8
  { title: "イベント 9", description: "ここに実績9が入ります。" }, // 9
  { title: "イベント 10", description: "ここに実績10が入ります。" }, // 10
  { title: "ゴール！", description: "最後まで見てくれてありがとう！" } // 11
];

// プレイヤーの現在の位置（マス番号）を管理する変数
let currentPlayerIndex = 0; 

// === Scene, Camera, Renderer ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias:true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// === Light ===
const light = new THREE.DirectionalLight(0xffffff, 1.5); 
light.position.set(10, 10, 5);
scene.add(light);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); 
scene.add(ambientLight);

// === 3D背景の読み込み (HDRI) ===
const hdriURL = 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/qwantani_night_puresky_1k.hdr';
const loader = new RGBELoader();

loader.load(
  hdriURL, 
  (texture) => { // 2. onLoad (成功時)
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;
    document.getElementById('loader-overlay').classList.add('hidden');
  },
  undefined, // 3. onProgress (不要)
  (error) => { // 4. onError (失敗時)
    console.error('3D背景(HDRI)の読み込みに失敗しました:', error);
    document.getElementById('loader-overlay').classList.add('hidden');
  }
);


// === Board ===
const board = createBoard(scene); 

// === Player ===
const playerMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
const player = new THREE.Group();
const boardTopY = 0.1;
// ( ... 駒のパーツ作成（省略） ... )
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


// === エフェクト（Bloom）のセットアップ ===
const composer = new EffectComposer( renderer );
const renderPass = new RenderPass( scene, camera );
composer.addPass( renderPass );
const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
bloomPass.strength = 0.4; // ★ 強度を抑えた状態
composer.addPass( bloomPass );
const outputPass = new OutputPass();
composer.addPass( outputPass );


// === Animate Loop (ブルーム対応版) ===
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  composer.render(); // エフェクト合成機を描画
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

  // === ★★★ ここからが今回の修正点（高精度クリック判定） ★★★ ===

  // マウスを押し下げた座標を記録する変数
  const mouseDownPos = new THREE.Vector2();

  // マウスが押された時の処理
  renderer.domElement.addEventListener('mousedown', (event) => {
    mouseDownPos.x = event.clientX;
    mouseDownPos.y = event.clientY;
  });

  // マウスが離された時の処理
  renderer.domElement.addEventListener('mouseup', (event) => {
    // 押した場所と離した場所の座標を比較
    const deltaX = Math.abs(mouseDownPos.x - event.clientX);
    const deltaY = Math.abs(mouseDownPos.y - event.clientY);
    const dragThreshold = 5; // 5ピクセル以上動いたら「ドラッグ」とみなす閾値

    // もし移動量が閾値より小さい場合（＝ドラッグではなく「クリック」）の場合のみ、判定を実行
    if (deltaX < dragThreshold && deltaY < dragThreshold) {
      performRaycast(event); // クリック判定を実行
    }
    // (移動量が大きければ、それは OrbitControls の視点移動（ドラッグ）とみなし、何もしない)
  });

  // 3D空間のクリック判定（レイキャスト）を実行する関数
  function performRaycast( event ) {
    if (infoBox.classList.contains('visible')) { return; } 

    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    raycaster.setFromCamera( pointer, camera );
    const objectsToCheck = [ ...board.children, ...player.children ];
    const intersects = raycaster.intersectObjects( objectsToCheck );
    
    if ( intersects.length > 0 ) {
      const clickedObject = intersects[0].object;
      
      // ★ 駒(PLAYER)がクリックされた時の処理
      if ( clickedObject.userData.type === 'PLAYER' ) {
        showInfoBox( profileData.title, profileData.description );
      } 
      // ★ マス(board_square)がクリックされた時の処理 (復活)
      else if ( clickedObject.userData.type === 'board_square' ) {
        const eventId = clickedObject.userData.id;
        const data = eventData[eventId];
        showInfoBox( data.title, data.description );
      }
    }
  }
  
  // (古い window への 'click' イベントリスナーは削除しました)
  // window.addEventListener( 'click', onWindowClick );
  // ===================================
  
  // Window Resize (ブルーム対応版)
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
    bloomPass.setSize(window.innerWidth, window.innerHeight);
  });

  // 矢印キー移動のロジック
  function movePlayerToIndex(index) {
    if (index >= positions.length) {
      currentPlayerIndex = positions.length - 1; 
    } else if (index < 0) {
      currentPlayerIndex = 0; 
    } else {
      currentPlayerIndex = index;
    }
    const newPos = positions[currentPlayerIndex]; 
    player.position.set(newPos[0], newPos[1], newPos[2]);
  }
  
  // キーボード操作のロジック
  window.addEventListener('keydown', (event) => {
    if (infoBox.classList.contains('visible')) { return; } 
    if (event.key === 'ArrowRight') {
      movePlayerToIndex(currentPlayerIndex + 1); 
    }
    if (event.key === 'ArrowLeft') {
      movePlayerToIndex(currentPlayerIndex - 1); 
    }
  });

});