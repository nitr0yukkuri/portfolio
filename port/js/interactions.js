import * as THREE from 'three';
import * as TWEEN from 'tween.js';
import { positions } from './board.js';
import { profileData, eventData } from './data.js';

let currentPlayerIndex = 0; 
let isMoving = false; 

export function setupInteractions(camera, renderer, composer, bloomPass, board, player) {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  window.addEventListener('DOMContentLoaded', () => {
    const infoBox = document.getElementById('info-box');
    const infoTitle = document.getElementById('info-title');
    const infoDescription = document.getElementById('info-description');
    const closeBtn = document.getElementById('info-close-btn');

    function showSidePanel(data) {
      infoTitle.innerText = data.title;
      infoDescription.innerHTML = data.description;

      if (data.image) {
        infoDescription.innerHTML += `<br><img src="${data.image}" alt="${data.title}" style="width:100%; max-width:250px; margin-top:20px;">`;
      }
      if (data.url) {
        infoDescription.innerHTML += `<br><a href="${data.url}" target="_blank">詳細はこちら</a>`;
      }

      infoBox.classList.add('visible'); 
    }
    
    function hideSidePanel() {
      infoBox.classList.remove('visible');
    }
    
    // === 閉じるボタンのイベントリスナーを修正 ===
    // 初回表示時と通常時でイベントリスナーを分ける
    
    infoBox.addEventListener('click', (event) => event.stopPropagation()); 

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
        performRaycast(event); 
      }
    });

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
          showSidePanel( profileData );
        } 
        else if ( clickedObject.userData.type === 'board_square' ) {
          const eventId = clickedObject.userData.id;
          const data = eventData[eventId];
          showSidePanel( data );
        }
      }
    }
    
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth/window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
      bloomPass.setSize(window.innerWidth, window.innerHeight);
    });

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

      const jumpHeight = 0.8; 
      const jumpDuration = 200; 
      const moveDuration = 400; 

      new TWEEN.Tween(player.position)
        .to({ y: currentPos.y + jumpHeight }, jumpDuration) 
        .easing(TWEEN.Easing.Quadratic.Out) 
        .onComplete(() => {
          new TWEEN.Tween(player.position)
            .to({ x: targetPos[0], y: targetPos[1], z: targetPos[2] }, moveDuration) 
            .easing(TWEEN.Easing.Quadratic.In) 
            .onComplete(() => {
              isMoving = false; 
              const data = eventData[currentPlayerIndex];
              showSidePanel(data);
            })
            .start(); 
        })
        .start(); 
    }
    
    window.addEventListener('keydown', (event) => {
      if (isMoving) { 
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

    // === ページ読み込み時に最初のマスの情報を表示し、クローズ時にプロフィールを表示する ===
    const initialData = eventData[0];
    showSidePanel(initialData);

    const initialCloseHandler = () => {
      hideSidePanel();
      showSidePanel(profileData);
      // 初回のみ実行されるように、このリスナーを削除
      closeBtn.removeEventListener('click', initialCloseHandler);
      // 以降は通常のhideSidePanelを使用
      closeBtn.addEventListener('click', hideSidePanel);
    };

    closeBtn.addEventListener('click', initialCloseHandler);
  });
}