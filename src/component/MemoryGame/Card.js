import React from 'react';
import './Card.css';

const Card = ({ card, onClick }) => {
  return (
    <div 
      className={`card ${card.isFlipped ? 'flipped' : ''}`} 
      onClick={!card.isFlipped && !card.isMatched ? onClick : null}
    >
      {card.isFlipped ? card.image : "❓"}
    </div>
  );
};

export default Card;
