import React from 'react';
import SummaryCard from './SummaryCard';

export default function Dashboard({ tasks, currentStatusFilter, onStatusFilterChange }) {
  const total = tasks.length;
  const pending = tasks.filter((t) => t.status === 'Pending').length;
  const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
  const completed = tasks.filter((t) => t.status === 'Completed').length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <section className="dashboard-section" aria-label="Dashboard Overview">
      <div className="dashboard-header">
        <div>
          <h2 className="section-title">Dashboard Overview</h2>
          <p className="section-subtitle">Real-time breakdown of all workflow tasks</p>
        </div>
        <div className="progress-overview">
          <div className="progress-label">
            <span>Overall Progress</span>
            <span className="progress-percentage">{completionRate}%</span>
          </div>
          <div className="progress-bar-bg" role="progressbar" aria-valuenow={completionRate} aria-valuemin="0" aria-valuemax="100">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>

      <div className="summary-cards-grid">
        <SummaryCard
          title="Total Tasks"
          count={total}
          subtitle="All recorded tasks"
          icon="📋"
          colorClass="card-indigo"
          isActive={currentStatusFilter === 'All'}
          onClick={() => onStatusFilterChange('All')}
        />
        <SummaryCard
          title="Pending"
          count={pending}
          subtitle="Awaiting start"
          icon="⏳"
          colorClass="card-amber"
          isActive={currentStatusFilter === 'Pending'}
          onClick={() => onStatusFilterChange(currentStatusFilter === 'Pending' ? 'All' : 'Pending')}
        />
        <SummaryCard
          title="In Progress"
          count={inProgress}
          subtitle="Actively underway"
          icon="⚡"
          colorClass="card-blue"
          isActive={currentStatusFilter === 'In Progress'}
          onClick={() => onStatusFilterChange(currentStatusFilter === 'In Progress' ? 'All' : 'In Progress')}
        />
        <SummaryCard
          title="Completed"
          count={completed}
          subtitle="Successfully closed"
          icon="✅"
          colorClass="card-emerald"
          isActive={currentStatusFilter === 'Completed'}
          onClick={() => onStatusFilterChange(currentStatusFilter === 'Completed' ? 'All' : 'Completed')}
        />
      </div>
    </section>
  );
}
