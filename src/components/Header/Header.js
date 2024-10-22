import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import LogoAndIcon from './LogoAndIcon/LogoAndIcon';
import SearchBar from './SearchBar/SearchBar';
import NavLinks from './NavLinks/NavLinks';
import Hamburger from './Hamburger/Hamburger';
import { AuthContext } from '../../AuthContext';  // Import your AuthContext
import { signOut } from 'firebase/auth';  // Import Firebase signOut
import { auth } from '../../firebaseConfig';  // Import Firebase auth
import { AiOutlineUser } from 'react-icons/ai';  // Import a user icon
import { SearchContext } from '../../SearchContext';

function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 500);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useContext(AuthContext);  // Use AuthContext to get the current user
  const { setFilters, setEvents, setSelectedEvents } = useContext(SearchContext);

  useEffect(() => {
    if (location.pathname !== '/find-events' && location.pathname !== '/mark-insights') {
      setSearchTerm('');
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 500);
      if (window.innerWidth > 500 && isNavOpen) {
        setIsNavOpen(false); 
      }
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [isNavOpen]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      if (location.pathname === '/') {
        navigate(`/find-events?location=${searchTerm}`);
      } else if (location.pathname === '/mark-insights') {
        navigate(`/mark-insights?location=${searchTerm}`);
      }
      else if (location.pathname === '/find-events') {
        navigate(`/find-events?location=${searchTerm}`);
      }
      else if (location.pathname === '/ai-recc') {
        navigate(`/find-events?location=${searchTerm}`);
      }
      setIsNavOpen(false);
    }
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    
    if (confirmLogout) {
      try {
        // Clear search-related state and localStorage
        setFilters({
          keyword: '',
          startDateTime: '',
          radius: '',
          unit: 'miles',
        });
        setEvents([]); // Clear search results
        setSelectedEvents([]); // Clear selected events
        localStorage.removeItem('location');   // Clear search-related data from localStorage
        localStorage.removeItem('events');
        localStorage.removeItem('selectedEvents');

        await signOut(auth);
        navigate('/login');  // Redirect to login page
      } catch (error) {
        console.error("Error logging out: ", error);
      }
    }
  };
  
  const handleLoginOrLogout = () => {
    if (currentUser) {
      handleLogout();  // Log out if a user is logged in
    } else {
      navigate('/login');  // Navigate to login if no user is logged in
    }
  };

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const closeNav = () => {
    setIsNavOpen(false);
  };

  return (
    <header className="header">
      <nav className="navbar">
        <LogoAndIcon />
        {!isMobileView && (
          <SearchBar 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleSearchSubmit={handleSearchSubmit}
          />
        )}
        <Hamburger toggleNav={toggleNav} />
        <NavLinks
          isNavOpen={isNavOpen}
          isMobileView={isMobileView}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearchSubmit={handleSearchSubmit}
          closeNav={closeNav}
        />
        {/* User Icon for login/logout */}
        <AiOutlineUser
          className="user-icon"
          onClick={handleLoginOrLogout}
          style={{ cursor: 'pointer', fontSize: '24px', marginLeft: '20px' }}
        />
      </nav>
    </header>
  );
}

export default Header;
