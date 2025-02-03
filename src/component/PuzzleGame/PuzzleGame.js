import React, { useState, useEffect } from 'react';
import './PuzzleGame.css';

// 이미지 분할 함수 (3x3)
const splitImage = (img, rows, cols) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const pieceWidth = img.width / cols;
  const pieceHeight = img.height / rows;
  const pieces = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      canvas.width = pieceWidth;
      canvas.height = pieceHeight;

      context.drawImage(
        img,
        col * pieceWidth,
        row * pieceHeight,
        pieceWidth,
        pieceHeight,
        0,
        0,
        pieceWidth,
        pieceHeight
      );

      pieces.push(canvas.toDataURL());
    }
  }

  return pieces;
};

const PuzzleGame = () => {
  const [pieces, setPieces] = useState([]);
  const [shuffledPieces, setShuffledPieces] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedPiece, setSelectedPiece] = useState(null); // 터치용 선택한 조각

  const imageList = [
    '/images/puzzlegame/토끼.jpg',
    '/images/puzzlegame/배에서.jpg',
    '/images/puzzlegame/고양이.jpg',
    '/images/puzzlegame/메리.jpg',
    '/images/puzzlegame/과일테이블.jpg',
    '/images/puzzlegame/부케.jpg',
    '/images/puzzlegame/해골.jpg',
  ];

  const loadNewPuzzle = () => {
    const randomImage = imageList[Math.floor(Math.random() * imageList.length)];
    setSelectedImage(randomImage);

    const img = new Image();
    img.src = randomImage;
    img.onload = () => {
      const pieces = splitImage(img, 3, 3);
      setPieces(pieces);
      setShuffledPieces([...pieces].sort(() => Math.random() - 0.5));
      setCompleted(false);
    };
  };

  useEffect(() => {
    loadNewPuzzle();
  }, []);

  // 퍼즐 조각 위치 변경 함수 (공통)
  const swapPieces = (fromIndex, toIndex) => {
    const newPieces = [...shuffledPieces];
    [newPieces[fromIndex], newPieces[toIndex]] = [newPieces[toIndex], newPieces[fromIndex]];
    setShuffledPieces(newPieces);
    checkCompletion(newPieces);
  };

  // 🖱️ 드래그 이벤트 (PC)
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('pieceIndex', index);
  };

  const handleDrop = (e, index) => {
    const pieceIndex = e.dataTransfer.getData('pieceIndex');
    swapPieces(pieceIndex, index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // 📱 터치 이벤트 (모바일)
  const handleTouchStart = (index) => {
    if (selectedPiece === null) {
      setSelectedPiece(index); // 첫 번째 조각 선택
    } else {
      swapPieces(selectedPiece, index);
      setSelectedPiece(null); // 선택 해제
    }
  };

  // 게임 완료 체크
  const checkCompletion = (newPieces) => {
    if (newPieces.every((piece, idx) => piece === pieces[idx])) {
      setCompleted(true);
    }
  };

  return (
    <div className='game-container'>
      <h1>이미지 퍼즐 맞추기</h1>
      <p>현재 퍼즐: {selectedImage.split('/').pop().replace('.jpg', '')}</p>
      <div className="puzzle">
        {shuffledPieces.map((piece, index) => (
          <div
            key={index}
            className={`puzzle-piece ${selectedPiece === index ? 'selected' : ''}`}
            style={{ backgroundImage: `url(${piece})` }}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragOver={handleDragOver}
            onTouchStart={() => handleTouchStart(index)} // 📱 터치 지원 추가
          />
        ))}
      </div>
      {completed && <p>🎉 게임 완료! 축하합니다! 🎉</p>}

      {/* 🔄 리셋 버튼 */}
      <button className="reset-button" onClick={loadNewPuzzle}>게임 리셋</button>
    </div>
  );
};

export default PuzzleGame;
