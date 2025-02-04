import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import bgHome from "../assets/images/bg-home4.jpg";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page" style={{ backgroundImage: `url(${bgHome})` }}>
      <p className='home-msg'>Game Choice ♤</p>
      <div className='preview'>
        <div className='preview-card item'>
        <img onClick={()=>{navigate("/memory")}} src="/images/preview/img-memorygame.jpg" alt="이미지 맞추기 게임" />
        <Link className="preview-link" to="/memory">같은 그림 찾기</Link>
        </div>
        <div className='preview-card item'>
        <img onClick={()=>{navigate("/puzzle")}} src="/images/preview/img-puzzlegame.jpg" alt="이미지 맞추기 게임" />
        <Link className="preview-link" to="/puzzle">이미지 퍼즐 맞추기</Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;