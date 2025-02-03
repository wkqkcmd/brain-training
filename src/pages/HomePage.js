import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="home-page">
      <h1>뇌 운동 게임</h1>
      <p>원하는 게임을 선택하세요.</p>
      <div>
        <Link to="/game/memory" className="game-link">같은 그림 찾기</Link>
        <Link to="/game/puzzle" className="game-link">퍼즐 게임</Link>
      </div>
    </div>
  );
}

export default HomePage;