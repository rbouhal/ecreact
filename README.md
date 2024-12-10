![Logo](https://github.com/rbouhal/EventCrawler-AI/blob/main/ecreact/public/images/eclogo.png?raw=true)
# EventCrawl - Event Discovery and AI Market Insights

EventCrawl is a web application designed to assist hotels in promoting local events and optimizing their pricing strategies using AI-powered insights. Users can search for local events, generate AI-driven marketing content, and visualize event data on a calendar to make informed decisions.

## Features

1. **Event Discovery**:  
   EventCrawl fetches events from the Ticketmaster API, allowing users to search for local events based on specific criteria. Users can select events for further analysis and AI-generated insights.

2. **Market Insights**:  
   The Market Insights feature provides a calendar view of events with a price grid to help hotels adjust their pricing. It analyzes event data to optimize room rates based on local demand and occupancy rates.

3. **AI Recommendations**:  
   Using the OpenAI API, EventCrawl generates customized advertisements and marketing content for selected events. These insights help hotels target potential customers by promoting local events.

## Requirements

To run this project, you will need:
- **Firebase credentials**: For user authentication and Firestore integration.
- **OpenAI API key**: For generating AI recommendations.
- **Ticketmaster API key**: For fetching event data.

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/EventCrawl.git
   cd EventCrawl

2. **Install Frontend Dependencies**:
   Navigate to the ecreact folder and install the required npm packages:
   ```bash
   cd ecreact
   npm install

3. **Install Backend Dependencies**:
   Navigate to the server folder and install the required Python packages:
   ```bash
   cd ../server
   pip install -r requirements.txt

4. **Set up environment variables**:
   Create a ```.env``` file in the root directory and add the following:
   ```bash
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
   REACT_APP_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
   REACT_APP_TICKETM_KEY=your_ticketmaster_api_key
   OPENAI_KEY=your_openai_api_key

5. **Run the Application**

    - Frontend:
        ```bash
        cd ecreact
        npm start
        ```

    - Backend:
        ```bash
        cd ../server
        python app.py
        ```

