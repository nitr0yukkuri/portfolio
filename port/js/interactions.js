import * as THREE from 'three';
import * as TWEEN from 'tween.js';
import { positions } from './board.js';
import { profileData, eventData } from './data.js';

let currentPlayerIndex = 0; 
let isMoving = false; 

// メインのインタラクション設定関数
export function setupInteractions(camera, renderer, composer, bloomPass, board, player) {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  // HTMLドキュメントの読み込み完了を待つ
  window.addEventListener('DOMContentLoaded', () => {
    // UI要素の取得
    const infoBox = document.getElementById('info-box');
    const infoTitle = document.getElementById('info-title');
    const infoDescription = document.getElementById('info-description');
    const closeBtn = document.getElementById('info-close-btn');

    // モバイル操作ボタンの取得
    const moveLeftBtn = document.getElementById('move-left-btn');
    const moveRightBtn = document.getElementById('move-right-btn');
    
    // ナビゲーションボタンの取得
    const showProfileBtn = document.getElementById('show-profile-btn');
    const showEventsBtn = document.getElementById('show-events-btn');
    
    // サイドパネルにデータを表示する共通関数
    function showSidePanel(data) {
      infoTitle.innerText = data.title;
      infoDescription.innerHTML = data.description;

      // 画像パスが存在すれば画像を追加
      if (data.image) {
        infoDescription.innerHTML += `<br><img src="${data.image}" alt="${data.title}" style="width:100%; max-width:250px; margin-top:20px;">`;
      }
      // URLが存在すればリンクを追加
      if (data.url) {
        infoDescription.innerHTML += `<br><a href="${data.url}" target="_blank">詳細はこちら</a>`;
      }

      infoBox.classList.add('visible'); 
    }
    
    // サイドパネルを非表示にする共通関数
    function hideSidePanel() {
      infoBox.classList.remove('visible');
    }
    
    // 閉じるボタンにイベントリスナーを設定
    closeBtn.addEventListener('click', hideSidePanel);
    // パネル内でのクリックが3Dシーンに影響しないようにする
    infoBox.addEventListener('click', (event) => event.stopPropagation()); 

    // ドラッグとクリックを区別するためのロジック
    const downPos = new THREE.Vector2();
    let isDragging = false;
    
    // マウス/タッチ開始時のイベントハンドラ
    function onPointerDown(event) {
      event.preventDefault();
      isDragging = false;
      const clientX = event.clientX || event.touches[0].clientX;
      const clientY = event.clientY || event.touches[0].clientY;
      downPos.set(clientX, clientY);
    }

    // マウス/タッチ移動時のイベントハンドラ
    function onPointerMove(event) {
      const clientX = event.clientX || event.touches[0].clientX;
      const clientY = event.clientY || event.touches[0].clientY;
      const deltaX = Math.abs(downPos.x - clientX);
      const deltaY = Math.abs(downPos.y - clientY);
      // 一定以上動いたらドラッグと判定
      if (deltaX > 5 || deltaY > 5) {
        isDragging = true;
      }
    }

    // マウス/タッチ終了時のイベントハンドラ
    function onPointerUp(event) {
      // ドラッグでなければレイキャストを実行
      if (!isDragging) {
        performRaycast(event);
      }
    }

    // イベントリスナーの追加
    renderer.domElement.addEventListener('mousedown', onPointerDown);
    renderer.domElement.addEventListener('mouseup', onPointerUp);
    renderer.domElement.addEventListener('mousemove', onPointerMove);
    renderer.domElement.addEventListener('touchstart', onPointerDown, { passive: false });
    renderer.domElement.addEventListener('touchend', onPointerUp);
    renderer.domElement.addEventListener('touchmove', onPointerMove, { passive: false });


    // クリックされたオブジェクトを判定し、パネルを表示する関数
    function performRaycast( event ) {
      // パネルが表示中の場合は新しいクリックを無視
      if (infoBox.classList.contains('visible')) { return; } 

      const clientX = event.clientX || event.changedTouches[0].clientX;
      const clientY = event.clientY || event.changedTouches[0].clientY;
      
      pointer.x = ( clientX / window.innerWidth ) * 2 - 1;
      pointer.y = - ( clientY / window.innerHeight ) * 2 + 1;
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
    
    // ウィンドウリサイズ時の処理
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth/window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
      bloomPass.setSize(window.innerWidth, window.innerHeight);
    });

    // プレイヤー（駒）を移動させる関数
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

      const jumpHeight = 1; 
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
    
    // キーボード操作のイベントリスナー
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

    // モバイルボタンのクリックイベント
    moveLeftBtn.addEventListener('click', () => {
      if (!isMoving) {
        movePlayerToIndex(currentPlayerIndex - 1);
      }
    });
    moveRightBtn.addEventListener('click', () => {
      if (!isMoving) {
        movePlayerToIndex(currentPlayerIndex + 1);
      }
    });

    // === ナビゲーションUIのイベント ===
    // プロフィールボタン
    showProfileBtn.addEventListener('click', () => {
      showSidePanel(profileData);
    });
    // 実績一覧ボタン（最初の実績を表示する例）
    showEventsBtn.addEventListener('click', () => {
      showSidePanel(eventData[1]);
    });


    // ページ読み込み時に最初のマスの情報を表示
    const initialData = eventData[0];
    showSidePanel(initialData);

    // 最初のパネルのクローズイベントに特別な処理を設定
    const initialCloseHandler = () => {
      hideSidePanel();
      showSidePanel(profileData); // プロフィールパネルを表示
      // このリスナーを削除し、通常のクローズ処理に戻す
      closeBtn.removeEventListener('click', initialCloseHandler);
      closeBtn.addEventListener('click', hideSidePanel);
    };

    closeBtn.addEventListener('click', initialCloseHandler);

  }); 
}