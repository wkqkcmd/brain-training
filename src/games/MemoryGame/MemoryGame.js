import React, { useState, useEffect, useRef } from "react";
import Card from "./Card";
import "./MemoryGame.css";
import bgMemory from "../../assets/images/bg-memory.jpg";

const images = ["🍎", "🍌", "🍇", "🍉", "🍓", "🍒", "🥑", "🥕"];

const shuffleCards = () => {
  return [...images, ...images]
    .sort(() => Math.random() - 0.5)
    .map((image, index) => ({
      id: index,
      image,
      isFlipped: true, // 처음에는 보이게 설정
      isMatched: false,
    }));
};

const MemoryGame = () => {
  const [cards, setCards] = useState(shuffleCards());
  const [selectedCards, setSelectedCards] = useState([]);
  const [isGameActive, setIsGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameTime, setGameTime] = useState(0);
  const [isGameFinished, setIsGameFinished] = useState(false);

  const gameTimer = useRef(null); // 🟢 useRef 사용 (중복 실행 방지)

  // 10초 동안 준비 시간 카운트다운
  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(countdown);
          setCards((prevCards) =>
            prevCards.map((card) => ({ ...card, isFlipped: false }))
          );
          setIsGameActive(true);
          startGameTimer();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  // 게임 시간 타이머 시작
  const startGameTimer = () => {
    if (gameTimer.current) return; // 🟢 중복 실행 방지
    gameTimer.current = setInterval(() => {
      setGameTime((prevTime) => prevTime + 1);
    }, 1000);
  };

  // 게임 종료 시 타이머 멈추기
  useEffect(() => {
    if (isGameActive && cards.every((card) => card.isMatched)) {
      clearInterval(gameTimer.current);
      gameTimer.current = null; // 🛑 타이머 참조 해제
      setIsGameActive(false);
      setIsGameFinished(true);
    }
  }, [cards, isGameActive]);

  // 카드 클릭 핸들러
  const handleCardClick = (id) => {
    if (!isGameActive || isGameFinished) return; // 게임이 끝나면 클릭 방지

    const updatedCards = cards.map((card) =>
      card.id === id ? { ...card, isFlipped: true } : card
    );
    setCards(updatedCards);

    const selected = updatedCards.filter(
      (card) => card.isFlipped && !card.isMatched
    );
    if (selected.length === 2) checkMatch(selected);
  };

  // 카드 매칭 확인
  const checkMatch = (selected) => {
    if (selected[0].image === selected[1].image) {
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.image === selected[0].image ? { ...card, isMatched: true } : card
        )
      );
    } else {
      setTimeout(() => {
        setCards((prevCards) =>
          prevCards.map((card) =>
            !card.isMatched ? { ...card, isFlipped: false } : card
          )
        );
      }, 1000);
    }
    setSelectedCards([]);
  };

  // 게임 리셋 함수
  const resetGame = () => {
    clearInterval(gameTimer.current); // 기존 타이머 종료
    gameTimer.current = null; // 🛑 타이머 참조 해제
    setCards(shuffleCards()); // 새로 섞인 카드 설정
    setSelectedCards([]);
    setIsGameActive(false);
    setTimeLeft(10);
    setGameTime(0);
    setIsGameFinished(false);

    // 다시 10초 카운트다운 시작
    const countdown = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(countdown);
          setCards((prevCards) =>
            prevCards.map((card) => ({ ...card, isFlipped: false }))
          );
          setIsGameActive(true);
          startGameTimer();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  return (
    <div
      className="game-container"
      style={{ backgroundImage: `url(${bgMemory})` }}
    >
      <h1>같은 그림 찾기</h1>
      <div className="game-info">
        {!isGameActive && !isGameFinished && (
          <h2>카드를 기억하세요! 남은 시간: {timeLeft}초</h2>
        )}
        {isGameActive && <h2>게임 진행 시간: {gameTime}초</h2>}
        {isGameFinished && (
          <h2 className="success-message">🎉 성공! 총 {gameTime}초!</h2>
        )}

        <div className="grid">
          {cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              onClick={() => handleCardClick(card.id)}
            />
          ))}
        </div>

        {isGameFinished && (
          <button className="reset-button" onClick={resetGame}>
            🔄 다시 시작
          </button>
        )}
      </div>
    </div>
  );
};

export default MemoryGame;
