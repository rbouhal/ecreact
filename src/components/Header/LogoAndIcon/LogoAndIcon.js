import React from 'react';
import { Link } from 'react-router-dom';
import './LogoAndIcon.css';

function LogoAndIcon() {
  return (
    <div className="nav-logo-and-icon">
      <img src='/images/eventcrawllogo.png' alt='Logo Icon' className='nav-icon' />
      <Link to="/" className="nav-logo">EventCrawl</Link>
    </div>
  );
}

export default LogoAndIcon;
