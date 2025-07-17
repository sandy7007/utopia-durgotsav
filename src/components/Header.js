import React, { useState } from 'react';
import styled from 'styled-components';
import { RefreshIcon, DashboardIcon } from './Icons';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 15px 30px;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
`;

const Actions = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #3498db;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;

  &:hover {
    background: #2980b9;
  }

  &:active {
    transform: translateY(1px);
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.hasErrors ? '#f39c12' : '#27ae60'};
  font-size: 14px;
  cursor: ${props => props.hasErrors ? 'pointer' : 'default'};
  position: relative;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    background: ${props => props.hasErrors ? '#f39c12' : '#27ae60'};
    border-radius: 50%;
    animation: ${props => props.hasErrors ? 'pulse 2s infinite' : 'pulse 2s infinite'};
  }

  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

const ErrorTooltip = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 250px;
  z-index: 1000;
  font-size: 12px;
  
  &::before {
    content: '';
    position: absolute;
    top: -6px;
    right: 20px;
    width: 12px;
    height: 12px;
    background: white;
    border: 1px solid #e0e0e0;
    border-bottom: none;
    border-right: none;
    transform: rotate(45deg);
  }
`;

const LastUpdated = styled.div`
  font-size: 12px;
  color: #666;
  margin-left: 15px;
`;

const Header = ({ onRefresh, apiErrors = [], lastUpdated }) => {
  const [showErrorTooltip, setShowErrorTooltip] = useState(false);
  const hasErrors = apiErrors.length > 0;

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <HeaderContainer>
      <Logo>
        <DashboardIcon />
        Traceception Dashboard
      </Logo>
      <Actions>
        <StatusIndicator 
          hasErrors={hasErrors}
          onMouseEnter={() => hasErrors && setShowErrorTooltip(true)}
          onMouseLeave={() => setShowErrorTooltip(false)}
        >
          {hasErrors ? 'Partial Data Mode' : 'All APIs Connected'}
          {hasErrors && showErrorTooltip && (
            <ErrorTooltip>
              <strong>API Status Issues:</strong>
              <ul style={{ margin: '8px 0 0 0', paddingLeft: '16px' }}>
                {apiErrors.map((error, index) => (
                  <li key={index} style={{ margin: '4px 0' }}>
                    <strong>{error.endpoint}:</strong> {error.error}
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: '8px', fontStyle: 'italic' }}>
                Using fallback data for affected panels
              </div>
            </ErrorTooltip>
          )}
        </StatusIndicator>
        
        {lastUpdated && (
          <LastUpdated>
            Last updated: {formatTime(lastUpdated)}
          </LastUpdated>
        )}
        
        <RefreshButton onClick={onRefresh}>
          <RefreshIcon />
          Refresh Data
        </RefreshButton>
      </Actions>
    </HeaderContainer>
  );
};

export default Header;
