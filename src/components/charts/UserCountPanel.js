import React from 'react';
import styled from 'styled-components';

const PanelContainer = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  height: 400px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  color: white;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 20px 0;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const UserList = styled.div`
  flex: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }
`;

const UserItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateX(4px);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Username = styled.span`
  color: white;
  font-weight: 500;
  font-size: 14px;
  flex: 1;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const Count = styled.span`
  color: #ffd700;
  font-weight: 700;
  font-size: 16px;
  background: rgba(255, 215, 0, 0.1);
  padding: 4px 8px;
  border-radius: 12px;
  min-width: 40px;
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const TotalCount = styled.div`
  margin-top: 16px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  text-align: center;
  color: white;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const UserCountPanel = ({ title = "User Activity", data = [], showTotal = true }) => {
  // Sort data by count in descending order
  const sortedData = data.sort((a, b) => b.count - a.count);
  
  // Calculate total count
  const totalCount = data.reduce((sum, item) => sum + item.count, 0);

  if (!data || data.length === 0) {
    return (
      <PanelContainer>
        <Title>{title}</Title>
        <EmptyState>
          <EmptyIcon>👥</EmptyIcon>
          <div>No user data available</div>
        </EmptyState>
      </PanelContainer>
    );
  }

  return (
    <PanelContainer>
      <Title>{title}</Title>
      <UserList>
        {sortedData.map((item, index) => (
          <UserItem key={item.userName || index}>
            <Username>{item.userName}</Username>
            <Count>{item.count}</Count>
          </UserItem>
        ))}
      </UserList>
      
      {showTotal && (
        <TotalCount>
          Total: {totalCount} interactions from {data.length} users
        </TotalCount>
      )}
    </PanelContainer>
  );
};

export default UserCountPanel;
