import React, { useEffect, useState, useContext, useCallback } from 'react'; // Added useCallback here
import { useLocation, useNavigate } from 'react-router-dom';
import './FindEvents.css';
import { AiOutlineSearch, AiOutlineClose, AiOutlinePlus, AiOutlineMinus, AiOutlineDelete } from "react-icons/ai";
import { AuthContext } from '../../AuthContext';
import { SearchContext } from '../../SearchContext'; // Import SearchContext
import { db } from '../../firebaseConfig';
import { collection, addDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { RiRobot3Fill } from "react-icons/ri";

function FindEvents() {
  const { events, setEvents, selectedEvents, setSelectedEvents, filters, setFilters } = useContext(SearchContext); // Use SearchContext for state
  const { currentUser } = useContext(AuthContext);  // Use AuthContext for user
  const navigate = useNavigate();
  const searchLocation = useLocation();
  const [page, setPage] = useState(0);
  const [noMoreResults, setNoMoreResults] = useState(false);

  // Move fetchEvents before useEffect and wrap it in useCallback
  const fetchEvents = useCallback(async (query, filters, pageNumber) => {
    try {
      const apiKey = process.env.REACT_APP_TICKETM_KEY;

      // Format the date to the correct format "YYYY-MM-DDTHH:mm:ssZ"
      let startDateTime = filters.startDateTime
        ? new Date(filters.startDateTime).toISOString().split('.')[0] + "Z"
        : null;
      let endDateTime = filters.endDateTime
        ? new Date(filters.endDateTime).toISOString().split('.')[0] + "Z"
        : null;

      let url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&city=${query}&size=10&page=${pageNumber}`;

      // Add formatted date if available
      if (startDateTime) url += `&startDateTime=${startDateTime}`;
      if (endDateTime) url += `&endDateTime=${endDateTime}`;
      if (filters.keyword) url += `&keyword=${filters.keyword}`;
      if (filters.radius) url += `&radius=${filters.radius}&unit=${filters.unit}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data._embedded && data._embedded.events) {
        const eventsData = data._embedded.events.map(event => {
          const venue = event._embedded.venues[0];
          const addressLine = venue.address ? venue.address.line1 : "Address not available";
          const stateCode = venue.state ? venue.state.stateCode : "";
          const postalCode = venue.postalCode || "Postal code not available";

          return {
            id: event.id,
            name: event.name,
            date: event.dates.start.localDate,
            time: event.dates.start.localTime || 'TBD',
            address: `${addressLine}, ${venue.city.name}, ${stateCode} ${postalCode}`,
            url: event.url,
            image: event.images[0].url,
          };
        });

        setEvents(prevEvents => (pageNumber === 0 ? eventsData : [...prevEvents, ...eventsData]));
        setNoMoreResults(false);
      } else {
        setNoMoreResults(true);
        setTimeout(() => setNoMoreResults(false), 3000);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }, [setEvents, setNoMoreResults]);

  // useEffect now has fetchEvents wrapped in useCallback, ensuring it's stable across renders
  useEffect(() => {
    const params = new URLSearchParams(searchLocation.search);
    const query = params.get('location');
    if (query && query !== filters.location) {
      setFilters(prevFilters => ({ ...prevFilters, location: query }));
      fetchEvents(query, filters, 0);
    }
  }, [searchLocation, filters, setFilters, fetchEvents]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };

  const handleAddEvent = async (event) => {
    if (!currentUser) return;

    const eventExists = selectedEvents.find((e) => e.id === event.id && e.date === event.date);

    if (eventExists) {
      await removeEventFromStorage(event);
      setSelectedEvents(selectedEvents.filter((e) => e.id !== event.id || e.date !== event.date));
    } else {
      await addEventToStorage(event);
      setSelectedEvents([...selectedEvents, event]);
    }
  };

  const handleClearSelectedEvents = async () => {
    // Iterate over selected events and remove them from Firestore
    for (const event of selectedEvents) {
      await removeEventFromStorage(event);
    }

    // Clear selected events in the SearchContext
    setSelectedEvents([]);

    // Update the event buttons in the current search results
    const updatedEvents = events.map(event => {
      if (selectedEvents.find(e => e.id === event.id && e.date === event.date)) {
        return { ...event, isSelected: false }; // Update state to unselected
      }
      return event;
    });

    setEvents(updatedEvents); // Update the UI
  };


  const addEventToStorage = async (event) => {
    try {
      const userEventsRef = collection(db, 'users', currentUser.uid, 'events');
      await addDoc(userEventsRef, event);
    } catch (error) {
      console.error("Error adding event to Firestore: ", error);
    }
  };

  const removeEventFromStorage = async (event) => {
    try {
      const userEventsRef = collection(db, 'users', currentUser.uid, 'events');
      const q = query(userEventsRef, where('id', '==', event.id), where('date', '==', event.date));
      const snapshot = await getDocs(q);
      snapshot.forEach(async (docSnapshot) => {
        await deleteDoc(docSnapshot.ref);
      });
    } catch (error) {
      console.error("Error removing event from Firestore: ", error);
    }
  };

  const handleSearch = () => {
    setPage(0);
    setEvents([]); // Clear current events
    fetchEvents(filters.location, filters, 0);
  };

  const handleClearSearch = () => {
    // Reset the filters to empty values
    setFilters({
      location: '',  // Assuming you want to clear the location as well
      keyword: '',
      startDateTime: '',
      radius: '',
      unit: 'miles',
    });

    // Clear the search results by resetting the events state
    setEvents([]);

    // Reset the search bar input value (URL params) if necessary
    navigate('/find-events');  // This clears the search query from the URL

    // Reset pagination
    setPage(0);
  };


  const loadMoreResults = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchEvents(filters.location, filters, nextPage);
  };

  const goToAIRecc = () => {
    navigate('/ai-recc', { state: { selectedEvents } });
  };

  return (
    <div className="find-events-page">
      {filters.location ? (
        <>
          <h1 className="location">Events in {filters.location}</h1>

          {/* Search Filters */}
          <div className="search-filters">
            <input
              type="text"
              name="keyword"
              placeholder="Keyword"
              value={filters.keyword}
              onChange={handleInputChange}
            />
            <label>
              Start
              <input
                type="date"
                name="startDateTime"
                value={filters.startDateTime}
                onChange={handleInputChange}
              />
            </label>
            <label>
              End
              <input
                type="date"
                name="endDateTime"
                value={filters.endDateTime}
                onChange={handleInputChange}
              />
            </label>
            <label className="radius">
              Distance
              <input
                type="text"
                name="radius"
                placeholder="Radius"
                value={filters.radius}
                onChange={handleInputChange}
              />
              <select name="unit" value={filters.unit} onChange={handleInputChange}>
                <option value="miles">Miles</option>
                <option value="km">Kilometers</option>
              </select>
            </label>

            <button onClick={handleSearch} className='search-button'>
              <AiOutlineSearch /> Search
            </button>
          </div>

          {events.length > 0 ? (
            <div className='col'>
              <div className="button-row">
                <button onClick={handleClearSearch} className="clear">
                  <AiOutlineClose /> Clear Search
                </button>
                {selectedEvents.length > 0 && (
                  <>
                    <button onClick={handleClearSelectedEvents} className="clear">
                      <AiOutlineDelete /> Clear Selected Events
                    </button>
                  </>
                )}
              </div>
              <ul className="events-list">
                {events.map((event, index) => (
                  <li key={index} className="event-item">
                    <img src={event.image} alt={event.name} className="event-image" />
                    <div className="event-details">
                      <h2>
                        <a href={event.url} target="_blank" rel="noopener noreferrer">
                          {event.name}
                        </a>
                      </h2>
                      <p><strong>Date:</strong> {event.date} <strong>Time:</strong> {event.time}</p>
                      <p><strong>Address:</strong> {event.address}</p>
                    </div>
                    <div className="tooltip-wrapper">
                      <button
                        className={`add-event-button ${selectedEvents.find(e => e.id === event.id && e.date === event.date) ? 'selected' : ''}`}
                        onClick={() => handleAddEvent(event)}
                      >
                        {selectedEvents.find(e => e.id === event.id && e.date === event.date) ? <AiOutlineMinus /> : <AiOutlinePlus />}
                      </button>
                      <span className="tooltip-text">
                        {selectedEvents.find(e => e.id === event.id && e.date === event.date) ? 'Remove event from AI Recommender' : 'Add event to AI Recommender'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              {!noMoreResults && <button className="more-results-button" onClick={loadMoreResults}>Load More Results</button>}
            </div>
          ) : (
            <p>No events found in {filters.location}.</p>
          )}

          {noMoreResults && <p>No more results available.</p>}

          {/* Button to go to AI recommendations page */}
          {selectedEvents.length > 0 && (
            <>
              <button onClick={goToAIRecc} className="fab-button">
                <div className="fab-content">
                  <RiRobot3Fill className="robot-icon" size={24} />
                  <span>Get AI Insights</span>
                </div>
              </button>
            </>
          )}

        </>
      ) : (
        <>
          <h1>Find Events Near You</h1>
          <p>Use the search bar to discover events in your desired location.</p>
        </>
      )}
    </div>
  );
}

export default FindEvents;
