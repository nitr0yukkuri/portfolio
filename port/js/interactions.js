import * as THREE from 'three';
import * as TWEEN from 'tween.js'; // TWEENをインポート
import { positions } from './board.js'; // マスの座標データ
import { profileData, eventData } from './data.js'; // テキストデータ

let currentPlayerIndex = 0; 
let isMoving = false; // 移動中は true

// === すべてのイベント処理をセットアップするメイン関数 ===
export function setupInteractions(camera, renderer, composer, bloomPass, board, player) {

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

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
    infoBox.addEventListener('click', (event) => event.stopPropagation()); // クリック突き抜け防止

    
    // === 高精度クリック判定（ドラッグとクリックの分離） ===
    const mouseDownPos = new THREE.Vector2();
    renderer.domElement.addEventListener('mousedown', (event) => {
      mouseDownPos.x = event.clientX;
      mouseDownPos.y = event.clientY;
    });

    renderer.domElement.addEventListener('mouseup', (event) => {
      const deltaX = Math.abs(mouseDownPos.x - event.clientX);
      const deltaY = Math.abs(mouseDownPos.y - event.clientY);
      const dragThreshold = 5; 

      if (deltaX < dragThreshold && deltaY < dragThreshold) {
        performRaycast(event); // クリック判定を実行
      }
    });

    // レイキャスト実行関数 (クリック時にマスと駒の両方に反応する)
    function performRaycast( event ) {
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
        } 
        else if ( clickedObject.userData.type === 'board_square' ) {
          const eventId = clickedObject.userData.id;
          const data = eventData[eventId];
          showInfoBox( data.title, data.description );
        }
      }
    }
    
    
    // === Window Resize (ブルーム対応版) ===
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth/window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
      bloomPass.setSize(window.innerWidth, window.innerHeight);
    });


    // === 矢印キー移動のロジック ===
    function movePlayerToIndex(index) {
      if (index >= positions.length) {
        currentPlayerIndex = positions.length - 1; 
      } else if (index < 0) {
        currentPlayerIndex = 0; 
      } else {
        currentPlayerIndex = index;
      }
      
      const targetPos = positions[currentPlayerIndex]; 
      const currentPos = { x: player.position.x, y: player.position.y, z: player.position.z };

      isMoving = true; 

      // 1. 上昇アニメーション
      const jumpHeight = 0.8; 
      const jumpDuration = 200; 
      const moveDuration = 400; 

      new TWEEN.Tween(player.position)
        .to({ y: currentPos.y + jumpHeight }, jumpDuration) 
        .easing(TWEEN.Easing.Quadratic.Out) 
        .onComplete(() => {
          // 2. 移動と下降アニメーション
          new TWEEN.Tween(player.position)
            .to({ x: targetPos[0], y: targetPos[1], z: targetPos[2] }, moveDuration) 
            .easing(TWEEN.Easing.Quadratic.In) 
            .onComplete(() => {
              isMoving = false; // アニメーション完了
              
              // === ★★★ これが今回の修正点 ★★★ ===
              // 移動が完了したら、そのマスのイベントを自動で表示する
              const data = eventData[currentPlayerIndex];
              showInfoBox(data.title, data.description);
              // ===================================
            })
            .start(); 
        })
        .start(); 
    }
    
    window.addEventListener('keydown', (event) => {
      if (infoBox.classList.contains('visible') || isMoving) { 
        return; 
      } 
      
      if (event.key === 'ArrowRight') {
        if (currentPlayerIndex < positions.length - 1) { 
          movePlayerToIndex(currentPlayerIndex + 1); 
        }
      }
      if (event.key === 'ArrowLeft') {
        if (currentPlayerIndex > 0) { 
          movePlayerToIndex(currentPlayerIndex - 1); 
        }
      }
    });

  }); // DOMContentLoaded 閉じ
}