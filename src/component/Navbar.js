import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="nav">
      {/* 네비게이션 링크 */}
      <nav>
        <ul>
          <li>
            <Link to="/">홈</Link>
          </li>
          <li>
            <Link to="/memory">같은 그림 찾기</Link>
          </li>
          <li>
            <Link to="/puzzle">퍼즐 게임</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
