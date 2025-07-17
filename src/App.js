import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import './App.css';
import { getSummarixLikeCount, getSummarixUsageCount, getSummarixUser, getTraceceptionLikeCount, getTraceceptionUsage, getTraceceptionUser } from './data-promise.js';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const ContentWrapper = styled.div`
  padding-top: 80px;
`;

function App() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasRun = useRef(false);
  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [
        traceceptionUsage,
        summarixUsage,
        traceceptionLikeCount,
        summarixLikeCount,
        summarixUser
      ] = await Promise.all([
        getTraceceptionUsage(),
        getSummarixUsageCount(),
        getTraceceptionLikeCount(),
        getSummarixLikeCount(),
        getSummarixUser()
      ]);
    // Convert traceceptionUsage.count to userDemographics-like format
    const traceceptionUsageData = [
      { name: 'Landed directly', value: traceceptionUsage.count.isDirectSearch, color: '#8884d8' },
      { name: 'Searched traceid', value: traceceptionUsage.count.isNotDirectSearch, color: '#82ca9d' }
    ];
    const summarixUsageData = [
      { name: 'Slack Bot', value: summarixUsage.count.slackCount, color: '#8884d8' },
      { name: 'Portal', value: summarixUsage.count.traceceptionPortal, color: '#82ca9d' }
    ];
    
    const summarixLikeCountData = {
        "countPositive": summarixLikeCount.countPositive,
        "countNegative": summarixLikeCount.countNegative
    }
    const traceceptionLikeCountData = {
        "count": traceceptionLikeCount.count,
    }
    const finalData = {
        TraceCeptionUsageData: traceceptionUsageData,
        SummarixUsageData: summarixUsageData,
        SummarixLikeCountData: summarixLikeCountData,
        TraceceptionLikeCountData: traceceptionLikeCountData,
        SummarixUserData: summarixUser?.sortedResults || [],
    }
      setDashboardData(finalData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };



  const refreshData = () => {
    fetchDashboardData();
  };

  return (
    <AppContainer>
      <Header onRefresh={refreshData} />
      <ContentWrapper>
        {loading ? (
          <div className="loading">Loading dashboard data...</div>
        ) : error ? (
          <div className="error">Error: {error}</div>
        ) : (
          <Dashboard data={dashboardData} />
        )}
      </ContentWrapper>
    </AppContainer>
  );
}

export default App;
