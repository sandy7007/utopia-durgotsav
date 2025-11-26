import styled from 'styled-components';
import PieChartPanel from './charts/PieChartPanel';
import NumberCard from './charts/NumberCard';
import UserCountPanel from './charts/UserCountPanel';

const DashboardContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
`;

const DashboardTitle = styled.h1`
  color: white;
  font-size: 32px;
  font-weight: 300;
  margin-bottom: 30px;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const WidePanel = styled.div`
  grid-column: 1 / -1;
`;

const Dashboard = ({ data }) => {
  if (!data) {
    return (
      <DashboardContainer>
        <DashboardTitle>Loading Dashboard...</DashboardTitle>
      </DashboardContainer>
    );
  }

return (
    <DashboardContainer>
        
        <DashboardGrid>
            <NumberCard 
                title="Total Traceception Usage"
                number={data.TraceCeptionUsageData?.reduce((sum, item) => sum + item.value, 0) || 0}
                subtext="Last 24 hrs active usage"
                color="#3498db"
            />

            <NumberCard 
                title="Total Summarix Usage"
                number={data.SummarixUsageData?.reduce((sum, item) => sum + item.value, 0) || 0}
                subtext="Total interactions (Slack + Portal)"
                color="#2ecc71"
            />
            
            <PieChartPanel 
                title="Traceception Usage (Last 24 hrs)"
                data={data.TraceCeptionUsageData}
            />

            <PieChartPanel 
                title="Summarix Usage"
                data={data.SummarixUsageData}
            />
            <UserCountPanel 
                title="Top Summarix Users"
                data={data.SummarixUserData || []}
                showTotal={true}
            />
            
            <NumberCard 
                title="Total Summarix Like Count 👍 "
                number={data.SummarixLikeCountData?.countPositive || 0}
                subtext="Total positive interactions"
                color="#2ecc71"
            />
            <NumberCard 
                title="Total Summarix Dislike Count � "
                number={data.SummarixLikeCountData?.countNegative || 0}
                subtext="Total negative interactions"
                color="#e74c3c"
            />
            
            <NumberCard 
                title="Total Traceception Like Count 👍 "
                number={data.TraceceptionLikeCountData?.count || 0}
                subtext="Total interactions"
                color="#2ecc71"
            />

            <NumberCard 
                title="Total Copycurl Button Hits 📋"
                number={data.CopycurlButtonHitCountData || "NA"}
                subtext="Times copied to clipboard"
                color="#f39c12"
            />

        </DashboardGrid>
    </DashboardContainer>
);
};

export default Dashboard;
