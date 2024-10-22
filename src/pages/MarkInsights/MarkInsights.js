import React from 'react';
import { useLocation } from 'react-router-dom';
import Calendar from 'react-calendar'
import './/Calendar.css';
import { useState, useEffect } from 'react'
import './/MarkInsights.css'
import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';



function calculatePriceIncrease(events, occupancy, averageRate) {
  if (!averageRate || averageRate < 0) {
    console.log("here")
    return 0; // Return 0% if the average rate is invalid
  }

  // Step 1: Calculate the average price of local events
  // const totalEventPrice = events.reduce((sum, event) => sum + event[1], 0);
  var sum = 0;
  events.forEach(event => {
    sum += (Math.min(...event[2].priceRanges.map((range) => range.min)) + Math.max(...event[2].priceRanges.map((range) => range.max))) / 2
  })
  const averageEventPrice = sum / events.length;

  // Step 2: Set a multiplier based on occupancy levels
  let occupancyMultiplier = 1;
  switch (occupancy) {
    case 'Low':
      occupancyMultiplier = 1.1;  // 10% increase for low occupancy
      break;
    case 'Medium':
      occupancyMultiplier = 1.2;  // 20% increase for medium occupancy
      break;
    case 'High':
      occupancyMultiplier = 1.3;  // 30% increase for high occupancy
      break;
    default:
      occupancyMultiplier = 1;    // No increase if occupancy is not set
  }

  // Step 3: Calculate the price increase percentage
  const eventImpact = averageEventPrice / averageRate;
  // console.log("Event Impact: " + eventImpact + ", Occupancy Mult: " + occupancyMultiplier)
  const priceIncreasePercent = (eventImpact * 0.5 + occupancyMultiplier * 0.5) * 100;

  // Ensure the price increase is reasonable (min 0%, max 100%)
  return Math.max(0, priceIncreasePercent);
}
// const eventPrices = events.map((event, index) => ({
//   name: event[2].name,
//   priceRange: [event[1], event[3]], // Assuming event[1] is the min price and event[3] is the max price
// }));

function scaleToHexColor(value) {
  // Cap the value at 1000
  if (value === 0) {
    return `#fff`
  }

  value = Math.min(value, 200);

  // Define the hex colors at both ends
  const startColor = { r: 165, g: 255, b: 138 }; // #a5ff8a
  const endColor = { r: 14, g: 61, b: 0 };       // #0e3d00

  // Normalize the input value to a scale of 0 to 1
  const ratio = value / 200;

  // Interpolate each color channel (r, g, b)
  const r = Math.round(startColor.r + (endColor.r - startColor.r) * ratio);
  const g = Math.round(startColor.g + (endColor.g - startColor.g) * ratio);
  const b = Math.round(startColor.b + (endColor.b - startColor.b) * ratio);

  // Convert the RGB values to a hex code
  const toHex = (num) => num.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}


function Sidebar({ selectedDate, events, onClose, rate, occupancy }) {
  
  // Handle the case where 'events' is not defined
  if (!events) {
    return <p>No events data available</p>;
  }

  // Prepare the data for the chart
  const eventPrices = events.map((event) => ({
    name: event[2]?.name || 'Unknown Event',
    minPrice: event[1] || 0,  // Min price
    maxPrice: event[3] || 0,  // Max price
  }));

  // Calculate event price averages
  const averageEventPrice = eventPrices.reduce((sum, event) => sum + (event.minPrice + event.maxPrice) / 2, 0) / eventPrices.length;

  // Calculate price increase percentage
  const priceIncreasePercentage = calculatePriceIncrease(events, occupancy, rate);

  // Calculate new recommended price
  const recommendedPrice = rate + ((priceIncreasePercentage / 100) * rate);

  // Prepare the data for the bar chart
  const analysisData = [
    { name: 'Current Hotel Price', price: rate },
    { name: 'Recommended Price', price: recommendedPrice },
    { name: 'Average Event Price', price: averageEventPrice }
  ];

  return (
    <div className={`sidebar ${selectedDate ? 'open' : ''}`}>
      <button className="close-btn" onClick={onClose}>Close</button>
      <h2>Events on {selectedDate?.toLocaleDateString()}</h2>
      {events.length > 0 ? (
        <div>
          <ul>
            {events.map((event, index) => (
              <li key={index}>
                <strong>{event[2].name}:</strong>
                <p>${event[1]}-${event[3]}</p>
              </li>
            ))}
          </ul>

          <h2>Price Analysis</h2>

          {rate > 0 && occupancy !== 'Select an option' ? (
            <div>
              <p>Recommended Price: ${recommendedPrice.toFixed(2)}</p>
              <p>Price Increase: {priceIncreasePercentage.toFixed(2)}%</p>

              {/* Bar Chart to compare hotel price, recommended price, and event price */}
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analysisData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="price" fill="#DB6948" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p>Enter an average price and local occupancy to see analysis.</p>
          )}
        </div>
      ) : (
        <p>No events found on this day.</p>
      )}
    </div>
  );
}




function MarkInsights() {
  const searchLocation = useLocation();
  const params = useMemo(() => new URLSearchParams(searchLocation.search), [searchLocation.search]);
  const [city, setCity] = useState(params.get('location')); // Extract the searched city
  const [date, setDate] = useState(new Date());
  const [eventsList, setEventsList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [rate, setRate] = useState(-1);
  const [occupancy, setOccupancy] = useState("Select an option")

  useEffect(() => {
    const locationParam = params.get('location'); // Extract the location parameter into a variable
    setCity(locationParam);
  }, [params]);

  useEffect(() => {
    const fetchEvents = async () => {
      const apiKey = process.env.REACT_APP_TICKETM_KEY;
      const formattedStartDate = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-01T00:00:01Z`;
      const formattedEndDate = `${date.getUTCMonth() + 2 === 13 ? date.getUTCFullYear() + 1 : date.getUTCFullYear()}-${String(date.getUTCMonth() + 2 === 13 ? 1 : (date.getUTCMonth() + 2)).padStart(2, '0')}-01T00:00:01Z`;
      const formatCity = city.replace(' ', '%20')
      let url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&city=${formatCity}&startDateTime=${formattedStartDate}&endDateTime=${formattedEndDate}`;
      let set_list = [];

      if (city) {
        const response = await fetch(url);
        const data = await response.json();
        if (data._embedded && data._embedded.events) {
          const eventsData = data._embedded.events;
          eventsData.forEach((event) => {
            if (event.dates.start.localDate && event.priceRanges && Math.max(...event.priceRanges.map((range) => range.max))) {
              set_list.push([event.dates.start.localDate, Math.min(...event.priceRanges.map((range) => range.min)), event, Math.max(...event.priceRanges.map((range) => range.max))]);
            }
          });
        }
        setEventsList(set_list);
      }
    };

    if (city) {
      fetchEvents();
    }
  }, [city, date]);

  // Function to generate background color for each day
  const tileClassName = ({ date, view }) => {
    let sum_lows = 0;


    eventsList.forEach(function (event) {
      if (event[0] === date.toISOString().split('T')[0]) {
        sum_lows += event[1]
      }
    })

    if (view === 'month') { // Only apply background to days in the current month view
      const bgColor = scaleToHexColor(sum_lows); // Scale the day (max 31 days)
      const styleSheet = document.styleSheets[0];
      var num = getRandomInt(100000);
      styleSheet.insertRule(`.tile${num} { background:${bgColor}; }`, styleSheet.cssRules.length);

      return (`tile${num}`);
    }
    return null;
  };

  const handleDateClick = (date) => {
    setDate(date);
    const eventsForDay = eventsList.filter(event => event[0] === date.toISOString().split('T')[0]);
    setFilteredEvents(eventsForDay);
    setSelectedDate(date); // Open the sidebar
  };

  const closeSidebar = () => {
    setSelectedDate(null); // Close the sidebar
  };

  const handleMonthChange = ({ activeStartDate }) => {
    // Set date to the first of the active month
    setDate(new Date(activeStartDate.getFullYear(), activeStartDate.getMonth(), 1));
  };

  const handleRateChange = (event) => {
    setRate(parseFloat(event.target.value) || -1)
  }

  const handleOccupancyChange = (event) => {
    setOccupancy(event.target.value);
  };

  return (
    <div class="container">
      <h1>Marketing Insights</h1>
      {city ? <p>Searched City: {city}</p> : <p>Use the search bar to discover events in your desired location.</p>} {/* Display the searched city */}
      <div className="search-filters">
        <label>
          $
          <input
            type="text"
            name="Average rate"
            placeholder="Price per Night (Avg)"
            onChange={handleRateChange}
          />
        </label>

        <label className="radius-mi">
          Local Occupancy
          <select name="Local Occupancy" onChange={handleOccupancyChange}>
            <option value="Select">Select an option</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">HIgh</option>
          </select>
        </label>

        {/* <button onClick={handleSearch} className='search-button'>
              <AiOutlineSearch /> Search
            </button> */}
      </div>
      <div class="container inner_container">
        {city && <Calendar onChange={handleDateClick} value={date} tileClassName={tileClassName} onActiveStartDateChange={handleMonthChange} />}
        {/* Sidebar */}
        <Sidebar
          selectedDate={selectedDate}
          events={filteredEvents}
          onClose={closeSidebar}
          rate={rate}
          occupancy={occupancy}
        />
      </div>
    </div>
  );
}

export default MarkInsights;