import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'; 
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import * as TWEEN from 'tween.js'; 

// === 専門家（モジュール）のインポート ===
import { createBoard, positions } from './board.js'; 
import { createPlayer } from './player.js'; 
import { setupInteractions } from './interactions.js'; 

// === Scene, Camera, Renderer ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias:true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// === ライト調整 ===


// === 3D背景の読み込み (HDRI) ===
const hdriURL = 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/citrus_orchard_road_puresky_1k.hdr';
const loader = new RGBELoader();
loader.load(
  hdriURL, 
  (texture) => { 
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;

    scene.backgroundIntensity = 0.5;
    scene.environmentIntensity = 0.5;
    
    document.getElementById('loader-overlay').classList.add('hidden');
  },
  undefined, 
  (error) => { 
    console.error('3D背景(HDRI)の読み込みに失敗しました:', error);
    document.getElementById('loader-overlay').classList.add('hidden');
  }
);


// === ボードとプレイヤーの作成 ===
const board = createBoard(scene); 
const player = createPlayer(); 
player.position.set(positions[0][0], positions[0][1], positions[0][2]); 
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

bloomPass.strength = 0.4;

composer.addPass( bloomPass );
const outputPass = new OutputPass();
composer.addPass( outputPass );


// === アニメーションループ (TWEEN対応) ===
function animate(time) {
  requestAnimationFrame(animate); 
  controls.update();
  TWEEN.update(time); 
  composer.render(); 
}
animate(); 


// === すべてのイベント処理をセットアップ ===
setupInteractions(camera, renderer, composer, bloomPass, board, player);