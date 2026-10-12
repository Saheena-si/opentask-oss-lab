import React from 'react';

export default function SearchBar({ value, onChange, onClear }) {
  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        <span className="search-icon" aria-hidden="true">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search tasks by title..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Search tasks by title"
        />
        {value && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={onClear}
            title="Clear search"
            aria-label="Clear search input"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
