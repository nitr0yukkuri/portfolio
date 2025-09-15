import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'; 
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
// 開発者ツールを開いたときに表示されるメッセージ
console.log("%cなにみてんねん", "color: black; font-size: 24px; font-weight: bold;");
console.log("ソースコード見てもええけど、優しくしてな…");


// === 専門家（モジュール）のインポート ===
import { createBoard, positions } from './board.js'; // ボード担当
import { createPlayer } from './player.js'; // プレイヤー担当
import { setupInteractions } from './interactions.js'; // イベント担当

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
  (texture) => { // OnLoad
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;
    document.getElementById('loader-overlay').classList.add('hidden');
  },
  undefined, 
  (error) => { // OnError
    console.error('3D背景(HDRI)の読み込みに失敗しました:', error);
    document.getElementById('loader-overlay').classList.add('hidden');
  }
);


// === ボードとプレイヤーの作成 ===
const board = createBoard(scene); // ボード担当を呼ぶ
const player = createPlayer(); // プレイヤー担当を呼ぶ
player.position.set(positions[0][0], positions[0][1], positions[0][2]); // スタート地点に配置
scene.add(player);


// === Camera & Controls ===
camera.position.set(4,5,6);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(1.8,0,-1.8);
controls.enableDamping = true;

// === エフェクト（Bloom）のセットアップ ===
const composer = new EffectComposer( renderer );
const renderPass = new RenderPass( scene, camera );
composer.addPass( renderPass );
const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
bloomPass.strength = 0.4; // 強度を調整
composer.addPass( bloomPass );
const outputPass = new OutputPass();
composer.addPass( outputPass );


// === アニメーションループ ===
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  composer.render(); // エフェクト合成機を描画
}
animate(); // ループ開始


// === すべてのイベント処理をセットアップ ===
// (イベント担当を呼び出し、必要な3Dオブジェクトや設定を渡す)
setupInteractions(camera, renderer, composer, bloomPass, board, player);