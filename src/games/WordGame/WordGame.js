import React, { useState, useEffect } from "react";
import wordsData from "../../data/words.json"; // JSON 파일 가져오기
import "./WordGame.css";
import bgWord from "../../assets/images/bg-word.jpg";
import bgWordQuiz from "../../assets/images/bg-word-quiz.jpg";

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
      // 타이머가 0이 되면 정답 공개
      setCompleted(true);
      // 2초 후에 다음 문제로 자동 전환
      const autoNextTimer = setTimeout(() => {
        loadNewQuestion();
      }, 2000);
      return () => clearTimeout(autoNextTimer);
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
    <div
      className="game-container game-container-word"
      style={{ backgroundImage: `url(${bgWord})` }}
    >
      <div className="overlay"></div>
      <h1>초성 퀴즈</h1>

      {currentQuestion && (
        <>
          <p className="hint" style={{ backgroundImage: `url(${bgWordQuiz})` }}>
            <div className="quiz-title">문제</div>{" "}
            <div className="quiz-question">{currentQuestion.설명}</div>
            <p>
              <strong className="quiz-answer">
                {completed ? currentQuestion.정답 : currentQuestion.초성}
              </strong>
            </p>
          </p>
          <p className="timer">⌛{timeLeft}초</p>

          {/* 다음 문제 버튼 클릭 시 남은 시간을 0으로 만들어 타이머 effect를 통해 자동 전환 */}
          <button className="reset-button" onClick={() => setTimeLeft(0)}>
            다음 문제
          </button>
        </>
      )}
    </div>
  );
};

export default WordGame;
