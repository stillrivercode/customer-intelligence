import React from 'react'

interface DashboardProps {
  title?: string
  className?: string
}

const Dashboard: React.FC<DashboardProps> = ({ 
  title = "Customer Intelligence Dashboard",
  className = ""
}) => {
  return (
    <div className={`dashboard ${className}`.trim()}>
      <h1>{title}</h1>
      <div className="dashboard-content">
        <p>Welcome to your Customer Intelligence Dashboard</p>
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Customers</h3>
            <p>Loading...</p>
          </div>
          <div className="stat-card">
            <h3>Active Sessions</h3>
            <p>Loading...</p>
          </div>
          <div className="stat-card">
            <h3>Conversion Rate</h3>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard