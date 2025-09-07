import React, {useState} from 'react';
const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export default function CreateEventForm(){
  const [form,setForm]=useState({
    college_id:1, title:'', description:'', event_type:'Workshop', start_time:'', end_time:'', location:'', capacity:50
  });
  async function submit(e){
    e.preventDefault();
    const res = await fetch(`${API}/events`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(form)
    });
    const data = await res.json();
    alert('Created: '+ JSON.stringify(data));
  }
  return (
    <form onSubmit={submit}>
      <input placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required />
      <select value={form.event_type} onChange={e=>setForm({...form, event_type:e.target.value})}>
        <option>Workshop</option><option>Seminar</option><option>Fest</option><option>Hackathon</option>
      </select>
      <input type="datetime-local" onChange={e=>setForm({...form, start_time:e.target.value})} required />
      <input type="datetime-local" onChange={e=>setForm({...form, end_time:e.target.value})} required />
      <input placeholder="Location" value={form.location} onChange={e=>setForm({...form, location:e.target.value})} />
      <button type="submit">Create Event</button>
    </form>
  );
}
