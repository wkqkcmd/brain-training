import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MemoryGame from "./games/MemoryGame/MemoryGame"; // 같은 그림 찾기 게임 컴포넌트
import PuzzleGame from "./games/PuzzleGame/PuzzleGame"; // 퍼즐 게임 컴포넌트
import WordGame from "./games/WordGame/WordGame";
import "./App.css"; // 스타일을 추가할 수 있습니다
import HomePage from "./pages/HomePage";
import Navbar from "./component/Navbar";
import MazeGame from "./games/MazeGame/MazeGame";
import SichuanGame from "./games/SichuanGame/SichuanGame";

const App = () => {
  return (
    <div>
      <Router>
      <Navbar />
        {/* 라우팅 경로 설정 */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/memory" element={<MemoryGame />} />
          <Route path="/puzzle" element={<PuzzleGame />} />
          <Route path="/word" element={<WordGame />} />
          <Route path="/maze" element={<MazeGame />} />
          <Route path="/sichuan" element={<SichuanGame />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;

//https://brain-training-wkqk.netlify.app/