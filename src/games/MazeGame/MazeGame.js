import React, { useState, useEffect } from "react";
import "./MazeGame.css";

// 미로 크기 설정
const GRID_SIZE = 10;

// 미로 생성 (DFS 알고리즘)
const generateMaze = (size) => {
  const maze = Array.from({ length: size }, () => Array(size).fill(1));
  const stack = [[1, 1]];
  maze[1][1] = 0;

  const directions = [
    [0, -2],
    [0, 2],
    [-2, 0],
    [2, 0]
  ];

  while (stack.length) {
    const [x, y] = stack[stack.length - 1];
    const shuffledDirs = directions.sort(() => Math.random() - 0.5);

    let moved = false;
    for (let [dx, dy] of shuffledDirs) {
      const nx = x + dx, ny = y + dy;
      if (nx > 0 && ny > 0 && nx < size - 1 && ny < size - 1 && maze[nx][ny] === 1) {
        maze[nx][ny] = 0;
        maze[x + dx / 2][y + dy / 2] = 0;
        stack.push([nx, ny]);
        moved = true;
        break;
      }
    }

    if (!moved) stack.pop();
  }

  return maze;
};

const MazeGame = () => {
  const [maze, setMaze] = useState([]);
  const [playerPos, setPlayerPos] = useState({ x: 1, y: 1 });
  const [goalPos, setGoalPos] = useState({ x: GRID_SIZE - 2, y: GRID_SIZE - 2 });
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    setMaze(generateMaze(GRID_SIZE));
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
    }
  }, [timeLeft, gameOver]);

  // 플레이어 이동 함수
  const movePlayer = (dx, dy) => {
    if (gameOver) return;
  
    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;
  
    // 🚀 🔥 배열 경계를 벗어나지 않도록 체크
    if (
      newX >= 0 &&
      newX < maze.length && // X축 범위 체크
      newY >= 0 &&
      newY < maze[0].length && // Y축 범위 체크
      maze[newX][newY] === 0 // 이동 가능한 길인지 확인
    ) {
      setPlayerPos({ x: newX, y: newY });
  
      // 🏆 목표 지점 도착 체크
      if (newX === goalPos.x && newY === goalPos.y) {
        setGameOver(true);
      }
    }
  };
  
  

  // 키보드 이벤트 (WASD)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") movePlayer(-1, 0);
      if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") movePlayer(1, 0);
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") movePlayer(0, -1);
      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") movePlayer(0, 1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playerPos, gameOver]);

  return (
    <div className="maze-container">
      <h1>길 찾기 게임</h1>
      <p>🔵 출발점 → 🏁 도착점</p>
      <p>남은 시간: {timeLeft}초</p>
      
      <div className="maze">
        {maze.map((row, rowIndex) => (
          <div key={rowIndex} className="maze-row">
            {row.map((cell, colIndex) => {
              let className = "maze-cell";
              if (rowIndex === playerPos.x && colIndex === playerPos.y) className += " player";
              if (rowIndex === goalPos.x && colIndex === goalPos.y) className += " goal";
              if (cell === 1) className += " wall";
              return <div key={colIndex} className={className}></div>;
            })}
          </div>
        ))}
      </div>

      {gameOver && (
        <div className="game-over">
          {playerPos.x === goalPos.x && playerPos.y === goalPos.y ? "🎉 성공!" : "⏳ 시간 초과!"}
        </div>
      )}
    </div>
  );
};

export default MazeGame;
