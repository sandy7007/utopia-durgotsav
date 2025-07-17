import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import styled from 'styled-components';
import { PieChartIcon } from '../Icons';

const ChartPanel = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
`;

const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const ChartTitle = styled.h3`
  color: #2c3e50;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`;

const ChartIcon = styled.div`
  color: #e74c3c;
`;

const COLORS = ['#3498db', '#2ecc71', '#f39c12', '#e74c3c', '#9b59b6', '#1abc9c'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: 'white',
        padding: '12px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      }}>
        <p style={{ margin: 0, fontWeight: 'bold' }}>{`${payload[0].name}`}</p>
        <p style={{ margin: 0, color: payload[0].color }}>
          {`Value: ${payload[0].value}`}
        </p>
      </div>
    );
  }
  return null;
};

const PieChartPanel = ({ title, data, height = 250 }) => {
  return (
    <ChartPanel>
      <ChartHeader>
        <ChartIcon>
          <PieChartIcon />
        </ChartIcon>
        <ChartTitle>{title}</ChartTitle>
      </ChartHeader>
      
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color || COLORS[index % COLORS.length]} 
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartPanel>
  );
};

export default PieChartPanel;
