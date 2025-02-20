import React, { useState, useEffect } from "react";
import "./PuzzleGame.css";
import bgPuzzle from "../../assets/images/bg-puzzle.jpg";

const preprocessImage = (img, targetWidth, targetHeight) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  // 원본 이미지 비율 계산
  const aspectRatio = img.width / img.height;
  const targetRatio = targetWidth / targetHeight;

  let sx, sy, sw, sh;

  if (aspectRatio > targetRatio) {
    // 원본이 더 가로로 긴 경우 → 좌우 일부를 잘라야 함
    sw = img.height * targetRatio;
    sh = img.height;
    sx = (img.width - sw) / 2; // 중앙 정렬
    sy = 0;
  } else {
    // 원본이 더 세로로 긴 경우 → 위아래 일부를 잘라야 함
    sw = img.width;
    sh = img.width / targetRatio;
    sx = 0;
    sy = (img.height - sh) / 2; // 중앙 정렬
  }

  // 캔버스를 원하는 크기로 설정
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  // 잘라낸 부분을 캔버스에 그리기
  context.drawImage(img, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight);

  return canvas;
};

// 이미지 분할 함수 (3x3)
const splitImage = (img, rows, cols) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  // const pieceWidth = Math.floor(img.width / cols);
  // const pieceHeight = Math.floor(img.height / rows);
  // 마지막 조각 등에서는 남은 픽셀을 추가로 고려할 수 있음.

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
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedPiece, setSelectedPiece] = useState(null); // 터치용 선택한 조각
  const [gameLevel, setGameLevel] = useState(3);

  const imageList = [
    "/images/puzzlegame/배에서.jpg",
    "/images/puzzlegame/고양이.jpg",
    "/images/puzzlegame/과일테이블.jpg",
    "/images/puzzlegame/부케.jpg",
    "/images/puzzlegame/해골.jpg",
    "/images/puzzlegame/자화상.jpg",
    "/images/puzzlegame/연꽃.jpg",
    "/images/puzzlegame/장식컵.jpg",
    "/images/puzzlegame/진저맨쿠키.jpg",
    "/images/puzzlegame/크로아상.jpg",
    "/images/puzzlegame/케이크.jpg",
    "/images/puzzlegame/머그커피.jpg",
    "/images/puzzlegame/회중시계.jpg",
    "/images/puzzlegame/책.jpg",
    "/images/puzzlegame/구슬.jpg",
    "/images/puzzlegame/강아지.jpg",
    "/images/puzzlegame/토끼.jpg",
  ];

  const loadNewPuzzle = () => {
    const randomImage = imageList[Math.floor(Math.random() * imageList.length)];
    setSelectedImage(randomImage);

    const img = new Image();
    img.src = randomImage;
    img.onload = () => {
      // 이미지 크기를 고정한 후 조각으로 분할
      const fixedCanvas = preprocessImage(img, 300, 300); // 300x300 크기로 고정
      const pieces = splitImage(fixedCanvas, gameLevel, gameLevel);

      // const pieces = splitImage(img, 3, 3);
      setPieces(pieces);
      setShuffledPieces([...pieces].sort(() => Math.random() - 0.5));
      setCompleted(false);
    };
  };

  useEffect(() => {
    loadNewPuzzle();
  }, [gameLevel]);

  // 퍼즐 조각 위치 변경 함수 (공통)
  const swapPieces = (fromIndex, toIndex) => {
    const newPieces = [...shuffledPieces];
    [newPieces[fromIndex], newPieces[toIndex]] = [
      newPieces[toIndex],
      newPieces[fromIndex],
    ];
    setShuffledPieces(newPieces);
    checkCompletion(newPieces);
  };

  // 🖱️ 드래그 이벤트 (PC)
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("pieceIndex", index);
  };

  const handleDrop = (e, index) => {
    const pieceIndex = e.dataTransfer.getData("pieceIndex");
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
    <div
      className="game-container"
      style={{ backgroundImage: `url(${bgPuzzle})` }}
    >
      <h1>이미지 퍼즐 맞추기</h1>
      <div>
        <button onClick={() => setGameLevel(3)}>3x3</button>
        <button onClick={() => setGameLevel(4)}>4x4</button>
      </div>
      <div className="puzzle-board">

      <h3 className="img-title"> {selectedImage.split("/").pop().replace(".jpg", "")}</h3>
      <div
        className={gameLevel == 3 ? "puzzle-3x3" : "puzzle-4x4"}
        style={completed ? { pointerEvents: "none" } : {}}
      >
        {shuffledPieces.map((piece, index) => (
          <div
          key={index}
          className={`puzzle-piece ${
              selectedPiece === index ? "selected" : ""
            }`}
            style={{ backgroundImage: `url(${piece})` }}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragOver={handleDragOver}
            onTouchStart={() => handleTouchStart(index)} // 📱 터치 지원 추가
            />
          ))}
      </div>
      <div style={{ visibility: completed ? "visible" : "hidden" }}>🎉 Game Clear! 🎉</div>
          </div>

      {/* 🔄 리셋 버튼 */}
      <button className="reset-button" onClick={loadNewPuzzle}>
        게임 리셋
      </button>
    </div>
  );
};

export default PuzzleGame;
