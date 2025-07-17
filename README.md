# Traceception Dashboard

A modern React dashboard application with multiple data visualization panels that connects to Azure Cosmos DB for dynamic data retrieval and display.

## Features

- **Multiple Chart Types**: Bar charts, pie charts, line charts, and metrics panels
- **Azure Cosmos DB Integration**: Real-time data fetching from Cosmos DB
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, modern interface with smooth animations
- **Real-time Updates**: Refresh button to fetch latest data
- **Mock Data Fallback**: Works without Cosmos DB for development

## Chart Types Included

1. **Bar Chart Panel**: Sales and profit trends over time
2. **Pie Chart Panel**: User demographics breakdown
3. **Line Chart Panel**: System performance monitoring (CPU/Memory)
4. **Metrics Panel**: Revenue analysis with key metrics

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Azure Cosmos DB account (optional for development)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd traceception-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your Cosmos DB credentials:
   ```
   COSMOS_DB_ENDPOINT=https://your-cosmos-account.documents.azure.com:443/
   COSMOS_DB_KEY=your-cosmos-db-primary-key
   COSMOS_DB_DATABASE_ID=DashboardDB
   COSMOS_DB_CONTAINER_ID=DashboardData
   PORT=5000
   ```

## Running the Application

### Development Mode (with backend)
```bash
npm run dev
```
This will start both the React frontend and the Express backend server.

### Frontend Only
```bash
npm start
```
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Backend Only
```bash
npm run server
```
The backend API will be available at [http://localhost:5000](http://localhost:5000).

## API Endpoints

- `GET /api/dashboard-data` - Retrieve all dashboard data
- `GET /api/health` - Health check endpoint
- `POST /api/seed-data` - Insert sample data into Cosmos DB

## Project Structure

```
traceception-dashboard/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── charts/
│   │   │   ├── BarChartPanel.js
│   │   │   ├── PieChartPanel.js
│   │   │   ├── LineChartPanel.js
│   │   │   └── MetricsPanel.js
│   │   ├── Dashboard.js
│   │   ├── Header.js
│   │   └── Icons.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── server/
│   └── index.js
├── package.json
├── .env.example
└── README.md
```

## Cosmos DB Setup

1. Create an Azure Cosmos DB account
2. Create a database named `DashboardDB`
3. Create a container named `DashboardData` with partition key `/category`
4. Use the `/api/seed-data` endpoint to insert sample data

## Data Structure

The application expects data in the following format in Cosmos DB:

### Sales Data
```json
{
  "id": "sales_1",
  "category": "sales",
  "month": "Jan",
  "sales": 4000,
  "profit": 2400
}
```

### Demographics Data
```json
{
  "id": "demographics_1",
  "category": "demographics",
  "name": "18-25",
  "value": 400,
  "color": "#8884d8"
}
```

### Performance Data
```json
{
  "id": "performance_1",
  "category": "performance",
  "time": "00:00",
  "cpu": 65,
  "memory": 45
}
```

### Revenue Data
```json
{
  "id": "revenue_1",
  "category": "revenue",
  "quarter": "Q1",
  "revenue": 125000
}
```

## Technologies Used

- **Frontend**: React, Recharts, Styled Components, Material-UI
- **Backend**: Node.js, Express.js, Azure Cosmos DB SDK
- **Styling**: Styled Components, CSS3
- **Charts**: Recharts library for responsive charts

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
