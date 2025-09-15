import * as THREE from 'three';
import { positions } from './board.js'; // マスの座標データだけインポート
import { profileData, eventData } from './data.js'; // テキストデータだけインポート

// プレイヤーの現在の位置（マス番号）を管理する変数
let currentPlayerIndex = 0; 

// === すべてのイベント処理をセットアップするメイン関数 ===
export function setupInteractions(camera, renderer, composer, bloomPass, board, player) {

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  // HTMLの読み込み完了を待つ (この関数自体が main.js の最後で呼ばれるため DOMContentLoaded は不要な場合もあるが、安全策として残す)
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
      const dragThreshold = 5; // 5ピクセル以上の移動はドラッグとみなす

      if (deltaX < dragThreshold && deltaY < dragThreshold) {
        performRaycast(event); // クリック判定を実行
      }
    });

    // レイキャスト実行関数
    function performRaycast( event ) {
      if (infoBox.classList.contains('visible')) { return; } 

      pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
      raycaster.setFromCamera( pointer, camera );
      
      // 判定対象（ボードの子とプレイヤーの子）
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
      const newPos = positions[currentPlayerIndex]; 
      player.position.set(newPos[0], newPos[1], newPos[2]);
    }
    
    window.addEventListener('keydown', (event) => {
      if (infoBox.classList.contains('visible')) { return; } 
      if (event.key === 'ArrowRight') {
        movePlayerToIndex(currentPlayerIndex + 1); 
      }
      if (event.key === 'ArrowLeft') {
        movePlayerToIndex(currentPlayerIndex - 1); 
      }
    });

  }); // DOMContentLoaded 閉じ
}