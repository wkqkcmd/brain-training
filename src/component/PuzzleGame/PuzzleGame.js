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

      // 이미지를 자르기
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

      // 자른 이미지 조각을 배열에 저장
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

  const imageList = [
    '/images/puzzlegame/토끼.jpg',
    '/images/puzzlegame/배에서.jpg',
    '/images/puzzlegame/고양이.jpg',
    '/images/puzzlegame/메리.jpg',
    '/images/puzzlegame/과일테이블.jpg',
    '/images/puzzlegame/부케.jpg',
    '/images/puzzlegame/해골.jpg',
  ]; // 퍼즐에 사용할 이미지 목록

  const loadNewPuzzle = () => {
    const randomImage = imageList[Math.floor(Math.random() * imageList.length)];
    setSelectedImage(randomImage);

    const img = new Image();
    img.src = randomImage;
    img.onload = () => {
      const pieces = splitImage(img, 3, 3); // 3x3 퍼즐로 나누기
      setPieces(pieces);
      setShuffledPieces([...pieces].sort(() => Math.random() - 0.5)); // 랜덤으로 섞기
      setCompleted(false);
    };
  };

  useEffect(() => {
    loadNewPuzzle(); // 게임 시작 시 퍼즐 로드
  }, []);

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('pieceIndex', index);
  };

  const handleDrop = (e, index) => {
    const pieceIndex = e.dataTransfer.getData('pieceIndex');
    const newPieces = [...shuffledPieces];
    [newPieces[index], newPieces[pieceIndex]] = [newPieces[pieceIndex], newPieces[index]];
    setShuffledPieces(newPieces);
    checkCompletion(newPieces);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const checkCompletion = (newPieces) => {
    if (newPieces.every((piece, idx) => piece === pieces[idx])) {
      setCompleted(true);
    }
  };

  // 🔄 게임 리셋 함수
  const resetGame = () => {
    loadNewPuzzle(); // 새로운 퍼즐 로드
  };

  return (
    <div className='game-container'>
      <h1>이미지 퍼즐</h1>
      <p>현재 퍼즐: {selectedImage.split('/').pop().replace('.jpg', '')}</p>
      <div className="puzzle">
        {shuffledPieces.map((piece, index) => (
          <div
          key={index}
          className="puzzle-piece"
          style={{ backgroundImage: `url(${piece})` }}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDrop={(e) => handleDrop(e, index)}
          onDragOver={handleDragOver}
          />
        ))}
      </div>
      {completed && <p>🎉 게임 완료! 축하합니다! 🎉</p>}

      {/* 🔄 리셋 버튼 추가 */}
        <button className="reset-button" onClick={resetGame}>게임 리셋</button>
    </div>
  );
};

export default PuzzleGame;
