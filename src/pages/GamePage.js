import React, { useState } from 'react';
import MemoryGame from '../component/MemoryGame/MemoryGame';  // MemoryGame 컴포넌트 불러오기

const GamePage = () => {
  const [startGame, setStartGame] = useState(false);  // 게임 시작 여부 상태

  const handleStartGame = () => {
    setStartGame(true);  // 게임 시작
  };

  const handleResetGame = () => {
    setStartGame(false);  // 게임 리셋
  };

  return (
    <div className="game-page">
      <h1>게임 페이지</h1>
      {!startGame ? (
        <div className="start-game-container">
          <p>같은 그림 찾기 게임을 시작합니다!</p>
          <button onClick={handleStartGame}>게임 시작</button>
        </div>
      ) : (
        <div>
          <MemoryGame />
          <button onClick={handleResetGame}>게임 리셋</button>
        </div>
      )}
    </div>
  );
};

export default GamePage;
