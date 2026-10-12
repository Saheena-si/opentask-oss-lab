import React from 'react';

export default function Navbar({ onOpenCreate, backendStatus }) {
  return (
    <header className="app-navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-logo" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <path d="m9 15 2 2 4-4"></path>
            </svg>
          </div>
          <div className="brand-titles">
            <h1 className="brand-name">OpenTask</h1>
            <span className="brand-tag">OSS Lab Mini Project</span>
          </div>
        </div>

        <div className="navbar-actions">
          <div className="server-status" title={`Backend Server: ${backendStatus}`}>
            <span className={`status-indicator ${backendStatus === 'online' ? 'status-online' : 'status-offline'}`}></span>
            <span className="status-text">
              {backendStatus === 'online' ? 'Backend Connected' : 'Server Offline'}
            </span>
          </div>

          <a
            href="https://github.com/saheena-si/opentask-oss-lab"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-github-link"
            title="View Repository on GitHub"
          >
            GitHub
          </a>

          <button
            type="button"
            className="btn btn-primary btn-navbar-create"
            onClick={onOpenCreate}
          >
            ➕ New Task
          </button>
        </div>
      </div>
    </header>
  );
}
