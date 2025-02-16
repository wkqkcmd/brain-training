import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import bgHome from "../assets/images/bg-home4.jpg";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page game-container" style={{ backgroundImage: `url(${bgHome})` }}>
      <p className='home-msg'>Game Choice ♤</p>
      <div className='preview'>
        <div className='preview-card item'>
        <img onClick={()=>{navigate("/memory")}} src="/images/preview/img-memorygame.jpg" alt="같은 그림 찾기" />
        <Link className="preview-link" to="/memory">같은 그림 찾기</Link>
        </div>
        <div className='preview-card item'>
        <img onClick={()=>{navigate("/puzzle")}} src="/images/preview/img-puzzlegame.jpg" alt="이미지 퍼즐 맞추기" />
        <Link className="preview-link" to="/puzzle">이미지 퍼즐 맞추기</Link>
        </div>
        <div className='preview-card item'>
        <img onClick={()=>{navigate("/word")}} src="/images/preview/img-wordgame.jpg" alt="초성 퀴즈" />
        <Link className="preview-link" to="/word">초성 퀴즈</Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;