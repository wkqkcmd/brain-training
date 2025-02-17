import React, { useState, useEffect } from "react";
import "./SichuanGame.css";
import bgSichuan from "../../assets/images/bg-sichuan.jpg";

const TILE_TYPES = ["🐱", "🦊", "🐶", "🦁", "🐭", "🦄", "🐻", "🐸"];
const COLORS = [
  "#FFDDC1",
  "#FFC0CB",
  "#B0E0E6",
  "#FFD700",
  "#C0C0C0",
  "#ADFF2F",
  "#FFA07A",
  "#98FB98",
];

const ROWS = 8;
const COLS = 8;
const CELL_SIZE = 40; // 각 셀의 크기 (px)
const BOARD_PADDING = 10; // .board의 padding 값

// Fisher-Yates 셔플 알고리즘
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const generateBoard = () => {
  const board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  const SHAPES = [
    {
      name: "square",
      mask: [
        [true, true, true, true, true, true],
        [true, true, true, true, true, true],
        [true, true, true, true, true, true],
        [true, true, true, true, true, true],
        [true, true, true, true, true, true],
        [true, true, true, true, true, true],
      ],
    },
    {
      name: "box",
      mask: [
        [true, true, true, true, true, true],
        [true, true, true, true, true, true],
        [true, false, false, false, false, true],
        [true, false, false, false, false, true],
        [true, true, true, true, true, true],
        [true, true, true, true, true, true],
      ],
    },
    {
      name: "s",
      mask: [
        [false, true, true, true, true, false],
        [true, true, false, false, true, true],
        [true, false, true, true, false, true],
        [true, false, true, true, false, true],
        [true, true, false, false, true, true],
        [false, true, true, true, true, false],
      ],
    },
  ];

  const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  const mask = shape.mask;
  let playableCount = 0;
  for (let r = 0; r < mask.length; r++) {
    for (let c = 0; c < mask[r].length; c++) {
      if (mask[r][c]) playableCount++;
    }
  }
  if (playableCount % 2 !== 0) {
    console.error("플레이 영역의 셀 수는 짝수여야 합니다.");
    return board;
  }
  const numPairs = playableCount / 2;
  const pairs = [];
  for (let i = 0; i < numPairs; i++) {
    const randIndex = Math.floor(Math.random() * TILE_TYPES.length);
    const tile = { type: TILE_TYPES[randIndex], color: COLORS[randIndex] };
    pairs.push(tile, tile);
  }
  shuffleArray(pairs);
  let index = 0;
  for (let r = 1; r < ROWS - 1; r++) {
    for (let c = 1; c < COLS - 1; c++) {
      if (mask[r - 1][c - 1]) {
        board[r][c] = pairs[index++];
      }
    }
  }
  return board;
};

const isClearRow = (board, row, col1, col2) => {
  const start = Math.min(col1, col2);
  const end = Math.max(col1, col2);
  for (let c = start + 1; c < end; c++) {
    if (board[row][c] !== null) return false;
  }
  return true;
};

const isClearCol = (board, col, row1, row2) => {
  const start = Math.min(row1, row2);
  const end = Math.max(row1, row2);
  for (let r = start + 1; r < end; r++) {
    if (board[r][col] !== null) return false;
  }
  return true;
};

const getPath = (board, pos1, pos2) => {
  const [r1, c1] = pos1;
  const [r2, c2] = pos2;
  if (r1 === r2 && isClearRow(board, r1, c1, c2)) return [pos1, pos2];
  if (c1 === c2 && isClearCol(board, c1, r1, r2)) return [pos1, pos2];
  if (
    !board[r1][c2] &&
    isClearRow(board, r1, c1, c2) &&
    isClearCol(board, c2, r1, r2)
  )
    return [pos1, [r1, c2], pos2];
  if (
    !board[r2][c1] &&
    isClearCol(board, c1, r1, r2) &&
    isClearRow(board, r2, c1, c2)
  )
    return [pos1, [r2, c1], pos2];
  for (let r = 0; r < ROWS; r++) {
    if (
      !board[r][c1] &&
      !board[r][c2] &&
      isClearCol(board, c1, Math.min(r1, r), Math.max(r1, r)) &&
      isClearRow(board, r, c1, c2) &&
      isClearCol(board, c2, Math.min(r2, r), Math.max(r2, r))
    ) {
      return [pos1, [r, c1], [r, c2], pos2];
    }
  }
  for (let c = 0; c < COLS; c++) {
    if (
      !board[r1][c] &&
      !board[r2][c] &&
      isClearRow(board, r1, Math.min(c1, c), Math.max(c1, c)) &&
      isClearCol(board, c, r1, r2) &&
      isClearRow(board, r2, Math.min(c2, c), Math.max(c2, c))
    ) {
      return [pos1, [r1, c], [r2, c], pos2];
    }
  }
  return null;
};

const canConnect = (board, pos1, pos2) => {
  return getPath(board, pos1, pos2) !== null;
};

const SichuanGame = () => {
  const [board, setBoard] = useState(generateBoard());
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState("");
  const [path, setPath] = useState([]);

  // 게임 리셋 함수
  const resetGame = () => {
    setBoard(generateBoard());
    setSelected([]);
    setMessage("");
    setPath([]);
  };
  const handleTileClick = (r, c) => {
    if (!board[r][c]) return; // 클릭한 셀이 빈 칸이면 무시
  
    // 이미 선택된 좌표인지 확인
    if (selected.some(([sr, sc]) => sr === r && sc === c)) return;
  
    if (selected.length === 0) {
      setSelected([[r, c]]);
    } else if (selected.length === 1) {
      const first = selected[0];
      // 첫 번째 타일이 이미 제거된 경우 선택을 초기화하고 리턴
      if (!board[first[0]][first[1]]) {
        setSelected([]);
        return;
      }
  
      const second = [r, c];
      const tile1 = board[first[0]][first[1]];
      const tile2 = board[r][c];
  
      // 두 타일이 유효한지 확인 (안전 체크)
      if (!tile1 || !tile2) {
        setSelected([]);
        return;
      }
  
      if (tile1.type !== tile2.type) {
        setMessage("타일이 일치하지 않습니다!");
        setTimeout(() => {
          setMessage("");
          setSelected([]);
        }, 1000);
      } else {
        if (canConnect(board, first, second)) {
          const connectingPath = getPath(board, first, second);
          setPath(connectingPath);
          // 500ms 동안 경로 선 표시 후 타일 제거
          setTimeout(() => {
            const newBoard = board.map(row => row.slice());
            newBoard[first[0]][first[1]] = null;
            newBoard[r][c] = null;
            setBoard(newBoard);
            setPath([]);
            setMessage("타일 제거 성공!");
            setTimeout(() => setMessage(""), 1000);
          }, 500);
        } else {
          setMessage("연결할 수 없습니다!");
          setTimeout(() => setMessage(""), 1000);
        }
        setSelected([]);
      }
    }
  };
  
//   const handleTileClick = (r, c) => {
//     if (!board[r][c]) return;
//     if (selected.some(([sr, sc]) => sr === r && sc === c)) return;
//     if (selected.length === 0) {
//       setSelected([[r, c]]);
//     } else if (selected.length === 1) {
//       const first = selected[0];
//       const second = [r, c];
//       const tile1 = board[first[0]][first[1]];
//       const tile2 = board[r][c];
//       if (tile1.type !== tile2.type) {
//         setMessage("타일이 일치하지 않습니다!");
//         setTimeout(() => {
//           setMessage("");
//           setSelected([]);
//         }, 1000);
//       } else {
//         if (canConnect(board, first, second)) {
//           const connectingPath = getPath(board, first, second);
//           setPath(connectingPath);
//           // 500ms 동안 경로 선 표시 후 타일 제거
//           setTimeout(() => {
//             const newBoard = board.map((row) => row.slice());
//             newBoard[first[0]][first[1]] = null;
//             newBoard[r][c] = null;
//             setBoard(newBoard);
//             setPath([]);
//             setMessage("타일 제거 성공!");
//             setTimeout(() => setMessage(""), 1000);
//           }, 500);
//         } else {
//           setMessage("연결할 수 없습니다!");
//           setTimeout(() => setMessage(""), 1000);
//         }
//         setSelected([]);
//       }
//     }
//   };

  // 각 셀의 중앙 좌표 계산 (보드 패딩 및 셀 크기 고려)
  const getCellCenter = (r, c) => {
    return {
      x: BOARD_PADDING + c * CELL_SIZE + CELL_SIZE / 2,
      y: BOARD_PADDING + r * CELL_SIZE + CELL_SIZE / 2,
    };
  };

  const polylinePoints = path
    .map(([r, c]) => {
      const { x, y } = getCellCenter(r, c);
      return `${x},${y}`;
    })
    .join(" ");
      
  return (
    <div
      className="game-container"
      style={{ backgroundImage: `url(${bgSichuan})` }}
    >
      <h1>사천성 게임</h1>
      <div className="message">{message || "\u00A0"}</div>
      <div className="board">
        {board.map((row, r) => (
          <div key={r} className="row">
            {row.map((cell, c) => (
              <div
              tabIndex={0}
                key={c}
                className={`cell ${cell ? "tile" : "empty"}`}
                onClick={() => handleTileClick(r, c)}
                style={cell ? { backgroundColor: cell.color } : {}}
              >
                {cell ? cell.type : ""}
              </div>
            ))}
          </div>
        ))}
        {path.length > 0 && (
          <svg
            className="path-svg"
            width={COLS * CELL_SIZE + BOARD_PADDING * 2}
            height={ROWS * CELL_SIZE + BOARD_PADDING * 2}
          >
            <polyline
              points={polylinePoints}
              stroke="yellow"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      <button className="reset-game-button" onClick={resetGame}>
        게임 리셋
      </button>
    </div>
  );
};

export default SichuanGame;
