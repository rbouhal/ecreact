import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './NavLinks.css';

function NavLinks({ isNavOpen, isMobileView, searchTerm, setSearchTerm, handleSearchSubmit, closeNav }) {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 575);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 575);
    };
  
    window.addEventListener('resize', handleResize);
  
    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <ul className={`nav-links ${isNavOpen ? 'open' : ''}`}>
      {isNavOpen && (isMobileView || isSmallScreen) && (
        <div className="small-search-form">
          <input
            type="text"
            placeholder="Search..."
            className="small-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearchSubmit} className="small-search-button">Go</button>
        </div>
      )}
      <li><Link to="/find-events" onClick={closeNav}>Find Events</Link></li>
      <li><Link to="/mark-insights" onClick={closeNav}>Marketing Insights</Link></li>
      <li><Link to="/ai-recc" onClick={closeNav}>Ai Rec</Link></li>
    </ul>
  );
}

export default NavLinks;
