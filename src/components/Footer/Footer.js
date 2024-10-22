import React from 'react';
import { NavLink } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-nav-links">
        <NavLink to="/" className="footer-link" activeClassName="active">
          Home
        </NavLink>
        <span className="footer-separator">|</span>
        <NavLink to="/find-events" className="footer-link" activeClassName="active">
          Find Events
        </NavLink>
        <span className="footer-separator">|</span>
        <NavLink to="/mark-insights" className="footer-link" activeClassName="active">
          Marketing Insights
        </NavLink>
        <span className="footer-separator">|</span>
        <NavLink to="/ai-recc" className="footer-link" activeClassName="active">
          AI Reccomendations
        </NavLink>
      </div>
    </footer>
  );
}

export default Footer;
