import React from 'react';

interface Unit {
  name: string;
}

interface CardProps {
  imageUrl: string;
  imageAlt: string;
  headerText: string;
  units?: Unit[];
}

const Card: React.FC<CardProps> = ({ imageUrl, imageAlt, headerText, units }) => {
  return (
    <div className="card">
      <img src={imageUrl} alt={imageAlt} />
      <h3 className="card-header">{headerText}</h3>
      <div className="flex-row-column">
        {units && units.map((unit, index) => (
          <div key={index}>
            <span>{unit.name}</span>
            <div className="icon-with-value">
              {/* Add any content you want to display */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Card;
