import React, {useState} from 'react';
import CreateEventForm from '../components/CreateEventForm';

export default function AdminDashboard(){
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <CreateEventForm />
      <p>Reports: (use API endpoints /api/reports/... )</p>
    </div>
  );
}
