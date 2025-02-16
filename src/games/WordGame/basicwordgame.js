import React, { useState, useEffect } from 'react';
import wordsData from '../../data/words.json'; // JSON 파일 가져오기
import './WordGame.css';

const WordGame = () => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10); // 10초 타이머

  useEffect(() => {
    loadNewQuestion();
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCompleted(true); // 시간이 다 되면 자동 정답 공개
    }
  }, [timeLeft]);

  // 랜덤 문제 출제
  const loadNewQuestion = () => {
    const randomIndex = Math.floor(Math.random() * wordsData.length);
    const question = wordsData[randomIndex];

    setCurrentQuestion(question);
    setTimeLeft(10); // 타이머 초기화
    setCompleted(false);
  };

  return (
    <div className="game-container">
      <h1>초성 퀴즈</h1>
  
      {currentQuestion && (
        <>
          <p className="question">
            {completed ? "정답:" : "초성:"} <strong>{completed ? currentQuestion.정답 : currentQuestion.초성}</strong>
          </p>
          <p className="hint">{currentQuestion.설명}</p>
          <p className="timer">남은 시간: {timeLeft}초</p>
  
          <button className="reset-button" onClick={loadNewQuestion}>
            다음 문제
          </button>
        </>
      )}
    </div>
  );
  
};

export default WordGame;
