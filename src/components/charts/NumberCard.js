import React from 'react';
import styled from 'styled-components';

const CardPanel = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 150px;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
`;

const CardTitle = styled.h3`
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
  opacity: 0.8;
`;

const CardNumber = styled.div`
  font-size: 48px;
  font-weight: bold;
  margin: 8px 0;
`;

const CardSubtext = styled.div`
  color: #666;
  font-size: 14px;
  margin-top: 8px;
  opacity: 0.7;
`;

const NumberCard = ({ title, number, subtext, color = '#667eea' }) => {
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  return (
    <CardPanel>
      <CardTitle>{title}</CardTitle>
      <CardNumber style={{ color }}>
        {formatNumber(number)}
      </CardNumber>
      {subtext && <CardSubtext>{subtext}</CardSubtext>}
    </CardPanel>
  );
};

export default NumberCard;
