import React, {useEffect, useState} from 'react';
import EventCard from '../components/EventCard';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export default function StudentEvents(){
  const [events, setEvents] = useState([]);
  useEffect(()=> {
    fetch(`${API}/events?event_type=Workshop`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          setEvents([]); // or handle error
          console.error('API did not return an array:', data);
        }
      })
      .catch(err => {
        setEvents([]);
        console.error('Fetch error:', err);
      });
  },[]);
  return (
    <div>
      <h2>Events</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
        {events.map(e => <EventCard key={e.id} event={e} />)}
      </div>
    </div>
  );
}
