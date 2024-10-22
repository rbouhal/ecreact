import React, { createContext, useState } from 'react';

// Create the context
export const SearchContext = createContext();

// Create the provider component
export const SearchProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [filters, setFilters] = useState({
    keyword: '',
    startDateTime: '',
    radius: '',
    unit: 'miles',
  });

  return (
    <SearchContext.Provider value={{ events, setEvents, selectedEvents, setSelectedEvents, filters, setFilters }}>
      {children}
    </SearchContext.Provider>
  );
};
