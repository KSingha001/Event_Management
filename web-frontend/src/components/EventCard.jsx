import React from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export default function EventCard({event}) {
  async function handleRegister(){
    const student = { college_id: 1, name: 'Test Student', email: 'test1@example.com', roll_no: '123' };
    const res = await fetch(`${API}/events/${event.id}/register`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ student })
    });
    const data = await res.json();
    alert(JSON.stringify(data));
  }
  return (
    <div style={{border:'1px solid #ddd', padding:12}}>
      <h3>{event.title}</h3>
      <p>{event.event_type} • {new Date(event.start_time).toLocaleString()}</p>
      <button onClick={handleRegister}>Register (demo)</button>
    </div>
  );
}
