import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../AuthContext';
import { db } from '../../firebaseConfig';  // Firestore database
import { collection, getDocs } from 'firebase/firestore';  // Firebase Firestore functions
import { jsPDF } from "jspdf";  // PDF generation library
import { Oval } from 'react-loader-spinner';  // Import the spinner
import './AIRecc.css';  // Import the external CSS file

function AIRecc() {
  const [ads, setAds] = useState([]);  // To store generated ads
  const [loading, setLoading] = useState(true);  // Loading state
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (currentUser) {
      const fetchEvents = async () => {
        try {
          const eventsRef = collection(db, 'users', currentUser.uid, 'events');
          const snapshot = await getDocs(eventsRef);
          const eventsData = snapshot.docs.map(doc => doc.data());

          // Only call the API if there are events
          if (eventsData.length > 0) {
            const response = await fetch('https://ecflask.azurewebsites.net/generate-ad', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ events: eventsData })
            });

            if (response.ok) {
              const data = await response.json();
              setAds(data);  // Set the generated ads
            } else {
              console.error("Failed to generate ads");
            }
          } else {
            console.log("No events to generate ads for.");
          }
        } catch (error) {
          console.error("Error fetching events:", error);
        } finally {
          setLoading(false);  // Set loading to false after ads are fetched
        }
      };

      fetchEvents();
    }
  }, [currentUser]);

  const downloadPDF = async (ad) => {
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'in', format: 'letter' });

    // PDF generation logic
    pdf.addImage("images/eclogo.png", 'PNG', 0.29, 0.24, 3.67, 0.82);
    pdf.setTextColor(219, 105, 72);
    pdf.setFillColor(219, 105, 72);
    pdf.rect(1.52, 1.16, 5.5, 5.5, 'F');
    pdf.addImage(ad.image, 'JPG', 1.8, 1.4, 5, 5);
    pdf.setFontSize(22);
    pdf.text(ad.name, 1.9, 7.17);
    pdf.setFontSize(16);
    const wrappedText = pdf.splitTextToSize(ad.ad_text, 6);
    pdf.text(wrappedText, 1.3, 7.47);
    pdf.save(`${ad.name}.pdf`);
  };

  return (
    <div className='ai-rec-page'>
      <h1>AI Recommendations</h1>
      {loading ? (
        <div className="loading-container">
          <Oval 
            height={100} 
            width={100} 
            color="#ffffff"
            secondaryColor="#DB6948"
            ariaLabel="loading"
          />
          <p>Loading</p>
        </div>
      ) : ads.length > 0 ? (
        <div className="ad-cards-container">
          {ads.map((ad, index) => (
            <div
              key={index}
              id={`ad-card-${ad.id}`}  // Assign unique ID to each ad card for rendering
              className="ad-card"
              onClick={() => downloadPDF(ad)}  // Download PDF on click
            >
              <img src={ad.image} alt={ad.name} /> {/* Event image */}
              <h2>{ad.name}</h2>
              <p>{ad.ad_text}</p> {/* Display the generated ad text */}
              <div className="hover-message">Click to download as PDF</div>
            </div>
          ))}
        </div>
      ) : (
        <p>No events added yet.</p>
      )}
    </div>
  );
}

export default AIRecc;
