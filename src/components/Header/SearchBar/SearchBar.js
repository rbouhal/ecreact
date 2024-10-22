import React from 'react';
import './SearchBar.css';

function SearchBar({ searchTerm, setSearchTerm, handleSearchSubmit }) {
  return (
    <div className="nav-search">
      <form onSubmit={handleSearchSubmit} className="search-form">
        <div className="search-container">
          <input
            type="text"
            placeholder="Enter a city..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <img 
            src = "images/icons8-search.svg" 
            alt = "Search Icon" 
            class = "search-icon"/>
        </div> 
      </form>
    </div>
  );
}

export default SearchBar;
