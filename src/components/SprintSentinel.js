import React, { useState, useMemo } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  color: white;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.5rem;
  font-weight: bold;
`;

const SearchContainer = styled.div`
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
`;

const SearchInput = styled.input`
  padding: 12px 20px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  outline: none;
  
  &:focus {
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.2);
  }
  
  @media (max-width: 768px) {
    width: 90%;
    max-width: 300px;
  }
`;

const DirectorSection = styled.div`
  margin-bottom: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(10px);
`;

const DirectorTitle = styled.h2`
  color: white;
  margin-bottom: 20px;
  font-size: 1.8rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
  padding-bottom: 10px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const TableHeader = styled.th`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px;
  text-align: left;
  font-weight: 600;
  font-size: 16px;
  
  &:first-child {
    width: 60px;
    text-align: center;
  }
  
  @media (max-width: 768px) {
    padding: 10px;
    font-size: 14px;
    
    &:first-child {
      width: 40px;
    }
  }
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8f9fa;
  }
  
`;

const TableCell = styled.td`
  padding: 12px 15px;
  border-bottom: 1px solid #dee2e6;
  font-size: 14px;
  
  @media (max-width: 768px) {
    padding: 8px 10px;
    font-size: 12px;
  }
`;

const NoResults = styled.div`
  text-align: center;
  color: white;
  font-size: 18px;
  margin-top: 40px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
`;

// Onboarded Team data
const onboardedTeamData = [
  // Arunesh Joshi
  { team: 'Lists Gemini', manager: 'Parth Shah', director: 'Arunesh Joshi', slackChannel: '#subscriptions-sprint-sentinel' },
  { team: 'Subscriptions Apollo', manager: 'Suhasini Jeyakumar', director: 'Arunesh Joshi', slackChannel: '#subscriptions-sprint-sentinel' },
  { team: 'Subscriptions Gemini', manager: 'Parth Shah', director: 'Arunesh Joshi', slackChannel: '#subscriptions-sprint-sentinel' },
  { team: 'Subscriptions Voyager', manager: 'Nicklesh Madoori', director: 'Arunesh Joshi', slackChannel: '#subscriptions-sprint-sentinel' },
  
  // Bharadwaja Dasari
  { team: 'US TXN Core Cart', manager: 'Mrunmayi Dhume', director: 'Bharadwaja Dasari', slackChannel: '#txn-us-sprint-sentinel' },
  
  // Karthik Cherukuri
  { team: 'US HP', manager: 'Bhawna Bhandari', director: 'Karthik Cherukuri', slackChannel: '#homepage-sprint-sentinel' },
  { team: 'US HP Web', manager: 'Bhawna Bhandari', director: 'Karthik Cherukuri', slackChannel: '#homepage-sprint-sentinel' },
    
  // Nagaraja Rao Daivam
  { team: 'Return Experience', manager: 'Ratnaraj Krishnaswamy', director: 'Nagaraja Rao Daivam', slackChannel: '#returns-sprint-sentinel' },
  { team: 'Return Methods', manager: 'Abhijit Banerjee', director: 'Nagaraja Rao Daivam', slackChannel: '#returns-sprint-sentinel' },
  { team: 'Return Receipts and Recommerce', manager: 'Ravi Dutta', director: 'Nagaraja Rao Daivam', slackChannel: '#returns-sprint-sentinel' },
  
  // Neelesh Khanna
  { team: 'Adtech MLE', manager: 'Nitish Varshney', director: 'Neelesh Khanna', slackChannel: '#adtech-mle-sprint-sentinel' },
  
  // Nirmala Venkatesh
  { team: 'ESP Ajax', manager: 'Muhil Rajamanickam', director: 'Nirmala Venkatesh', slackChannel: '#esp-sprint-sentinel' },
  { team: 'ESP Online', manager: 'Anusha Sharma', director: 'Nirmala Venkatesh', slackChannel: '#esp-sprint-sentinel' },
  { team: 'ESP Phoenix', manager: 'Anusha Sharma', director: 'Nirmala Venkatesh', slackChannel: '#esp-sprint-sentinel' },
  { team: 'ESP Zenith', manager: 'Muhil Rajamanickam', director: 'Nirmala Venkatesh', slackChannel: '#esp-sprint-sentinel' },
  { team: 'In Store Services BPO', manager: 'Amit Das', director: 'Nirmala Venkatesh', slackChannel: '#drs-sprint-sentinel' },
  { team: 'In Store Services SIM', manager: 'Amit Das', director: 'Nirmala Venkatesh', slackChannel: '#drs-sprint-sentinel' },
  { team: 'Omni Services ACC', manager: 'Priyadarshini Ramasamy', director: 'Nirmala Venkatesh', slackChannel: '#acc-sprint-sentinel' },
  { team: 'WARP Online', manager: 'Muhil Rajamanickam', director: 'Nirmala Venkatesh', slackChannel: '#warp-sprint-sentinel' },
  
  // Pralhad Lakshmanachar
  { team: 'TXN ACC Onepay', manager: 'Sanjay Krishnan', director: 'Pralhad Lakshmanachar', slackChannel: '#txn-sprint-sentinel' },
  { team: 'TXN Cart', manager: 'Sneha Sharma', director: 'Pralhad Lakshmanachar', slackChannel: '#txn-sprint-sentinel' },
  { team: 'TXN Core', manager: 'Shubhakeerti Alagundagi', director: 'Pralhad Lakshmanachar', slackChannel: '#txn-sprint-sentinel' },
  { team: 'TXN CXO', manager: 'Jayakumar Ananthan', director: 'Pralhad Lakshmanachar', slackChannel: '#txn-sprint-sentinel' },
  { team: 'TXN Tender Plan', manager: 'Jayakumar Ananthan', director: 'Pralhad Lakshmanachar', slackChannel: '#txn-sprint-sentinel' },
  { team: 'TXN Wplus', manager: 'Raj Kumar Gupta', director: 'Pralhad Lakshmanachar', slackChannel: '#txn-sprint-sentinel' },
  
  // Prashant Kumar Kaushik
  { team: 'CPH', manager: 'Yesudas S', director: 'Prashant Kumar Kaushik', slackChannel: '#cph-sprint-sentinel' },
  { team: 'POST TXN Android', manager: 'Balaji Maasala', director: 'Prashant Kumar Kaushik', slackChannel: '#post-txn-sprint-sentinel' },
  { team: 'POST TXN iOS', manager: 'Balaji Maasala', director: 'Prashant Kumar Kaushik', slackChannel: '#post-txn-sprint-sentinel' },
  { team: 'POST TXN Web', manager: 'Balaji Maasala', director: 'Prashant Kumar Kaushik', slackChannel: '#post-txn-sprint-sentinel' },
  
  // Ramu Malur
  { team: 'CNNT Transformer', manager: 'Sumeet Kumar', director: 'Ramu Malur', slackChannel: '#cnnt-sprint-sentinel' },
  
  // Santos Kumar Das
  { team: 'IMS Display Forecasting', manager: 'Ilavarasu Jayabalan', director: 'Santos Kumar Das', slackChannel: '#ims-display-forecasting-sprint-sentinel' },

  // Santosh Kolur
  { team: 'Discovery CX Tools', manager: 'ThirumalaiNatarajan Deivanayagam', director: 'Santosh Kolur', slackChannel: '#discovery-sprint-sentinel' },
  { team: 'Discovery E2E', manager: 'Chethana HB', director: 'Santosh Kolur', slackChannel: '#discovery-sprint-sentinel' },
  { team: 'Discovery Home Page', manager: 'Shadab Ahmad', director: 'Santosh Kolur', slackChannel: '#discovery-sprint-sentinel' },
  { team: 'Discovery Item Page', manager: 'Abhishek K N', director: 'Santosh Kolur', slackChannel: '#discovery-sprint-sentinel' },
  { team: 'Discovery OL', manager: 'Rashmi Yadavalli', director: 'Santosh Kolur', slackChannel: '#discovery-sprint-sentinel' },
  { team: 'Discovery Search', manager: 'Pradeepa Sekar', director: 'Santosh Kolur', slackChannel: '#discovery-sprint-sentinel' },
  { team: 'Discovery UGC SHIELD', manager: 'Ramaraj Bijur', director: 'Santosh Kolur', slackChannel: '#discovery-sprint-sentinel' },
  { team: 'Discovery UGC SORAYA', manager: 'Ramaraj Bijur', director: 'Santosh Kolur', slackChannel: '#discovery-sprint-sentinel' },
  { team: 'Discovery UGC TBL', manager: 'Ramaraj Bijur', director: 'Santosh Kolur', slackChannel: '#discovery-sprint-sentinel' },
  { team: 'Discovery UGC TITAN', manager: 'Ramaraj Bijur', director: 'Santosh Kolur', slackChannel: '#discovery-sprint-sentinel' },
  { team: 'Discovery Verticals Replenishment', manager: 'Chethana HB', director: 'Santosh Kolur', slackChannel: '#discovery-sprint-sentinel' },
  { team: 'Wplus ACQ Core', manager: 'Karthikraj Duraisamy', director: 'Santosh Kolur', slackChannel: '#wplus-acquistion-sprint-sentinel' },
  { team: 'Wplus Mer Pod1', manager: 'Karthikraj Duraisamy', director: 'Santosh Kolur', slackChannel: '#wplus_sprint_health' },
  { team: 'Wplus Mer Pod2', manager: 'Rajat Gupta', director: 'Santosh Kolur', slackChannel: '#wplus_sprint_health' },
  
  // Zia Hasan
  { team: 'Auto Care Glacier', manager: 'Robert Jones', director: 'Zia Hasan', slackChannel: '#acc-auto-care-sprint-sentinel' },
];

const SprintSentinel = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter data
  const filteredData = useMemo(() => {
    return onboardedTeamData.filter(item => 
      item.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.slackChannel.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Group filtered data by director and calculate rowSpan
  const groupedData = useMemo(() => {
    const directorCounts = {};
    filteredData.forEach(item => {
      directorCounts[item.director] = (directorCounts[item.director] || 0) + 1;
    });

    return filteredData.map((item, index) => {
      const isFirstInGroup = index === 0 || filteredData[index - 1].director !== item.director;
      return {
        ...item,
        isFirstInGroup,
        rowSpan: isFirstInGroup ? directorCounts[item.director] : 0
      };
    });
  }, [filteredData]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Container>
      <Title>Sprint Sentinel Dashboard</Title>
      
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search by team name, manager, director, or slack channel..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </SearchContainer>

      {filteredData.length === 0 ? (
        <NoResults>
          No results found for "{searchTerm}"
        </NoResults>
      ) : (
        <DirectorSection>
          <DirectorTitle>Onboarded Teams ({filteredData.length} teams)</DirectorTitle>
          <Table>
            <thead>
              <tr>
                <TableHeader>#</TableHeader>
                <TableHeader>Director</TableHeader>
                <TableHeader>Team</TableHeader>
                <TableHeader>Manager</TableHeader>
                <TableHeader>Slack Channel</TableHeader>
              </tr>
            </thead>
            <tbody>
              {groupedData.map((team, index) => (
                <TableRow key={index}>
                  <TableCell style={{ fontWeight: 'bold', color: '#667eea', textAlign: 'center' }}>
                    {index + 1}
                  </TableCell>
                  {team.isFirstInGroup && (
                    <TableCell 
                      rowSpan={team.rowSpan}
                      style={{ 
                        verticalAlign: 'middle', 
                        fontWeight: 'bold',
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #dee2e6'
                      }}
                    >
                      {team.director}
                    </TableCell>
                  )}
                  <TableCell>{team.team}</TableCell>
                  <TableCell>{team.manager}</TableCell>
                  <TableCell style={{ fontFamily: 'monospace', color: '#495057' }}>
                    {team.slackChannel}
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </DirectorSection>
      )}
    </Container>
  );
};

export default SprintSentinel;
