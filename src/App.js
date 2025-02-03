import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MemoryGame from './component/MemoryGame/MemoryGame'; // 같은 그림 찾기 게임 컴포넌트
import PuzzleGame from './component/PuzzleGame/PuzzleGame'; // 퍼즐 게임 컴포넌트
import './App.css';  // 스타일을 추가할 수 있습니다

const App = () => {
  return (
    <Router>
      <div className="App">
        {/* 네비게이션 링크 */}
        <nav>
          <ul>
            <li>
              <Link to="/">같은 그림 찾기</Link>
            </li>
            <li>
              <Link to="/puzzle">퍼즐 게임</Link>
            </li>
          </ul>
        </nav>

        {/* 라우팅 경로 설정 */}
        <Routes>
          <Route path="/" element={<MemoryGame />} />
          <Route path="/puzzle" element={<PuzzleGame />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
