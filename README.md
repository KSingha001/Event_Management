# Event Management System

This is a full-stack Event Management System with a Node.js/Express backend, a React web frontend, and a React Native (Expo) mobile app.

## Project Structure

- `backend/` — Node.js + Express + MySQL backend API
- `web-frontend/` — React web app (Vite)
- `mobile-app/` — React Native mobile app (Expo)

---

## Getting Started

### Prerequisites
- Node.js (v18 or later recommended)
- npm
- MySQL
- (For mobile) Expo CLI: `npm install -g expo-cli`

---

## Backend Setup (`backend/`)

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```
2. **Configure environment:**
   - Copy `.env.exampe` to `.env` and fill in your MySQL credentials.
3. **Set up the database:**
   - Create a MySQL database (e.g., `campus_events`).
   - Run the schema:
     ```bash
     mysql -u <user> -p < src/migrations/schema.sql
     ```
4. **Start the backend server:**
   ```bash
   npm start
   ```
   The server runs on `http://localhost:4000` by default.

---

## Web Frontend Setup (`web-frontend/`)

1. **Install dependencies:**
   ```bash
   cd web-frontend
   npm install
   ```
2. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app runs on `http://localhost:5173` by default.

---

## Mobile App Setup (`mobile-app/`)

1. **Install dependencies:**
   ```bash
   cd mobile-app
   npm install
   ```
2. **Start the Expo development server:**
   ```bash
   npx expo start
   ```
3. **Run on device/emulator:**
   - Use Expo Go app (scan QR code) or run on Android/iOS emulator.
   - Make sure your backend API URL in `EventListScreen.js` points to your PC's LAN IP (e.g., `http://192.168.x.x:4000/api`).

---

## How the Project Works

- **Backend:**
  - Provides RESTful API endpoints for events, students, and reports.
  - Connects to a MySQL database.
  - Handles authentication, event creation, registration, and reporting.

- **Web Frontend:**
  - Allows admins and students to view and manage events.
  - Communicates with the backend API.

- **Mobile App:**
  - Lets users view and register for events on mobile devices.
  - Communicates with the backend API.

---

## Notes
- Update `.env` files with your own credentials and secrets.
- For mobile, ensure your device and PC are on the same network and the backend is accessible from your device.
- For any issues, check backend logs and network configuration.

---


## Database Schema & Table Relationships

The backend uses a MySQL database with the following main tables:

### 1. `colleges`
- Stores college information.
- **Columns:** `id` (PK), `name`, `code`

### 2. `events`
- Stores event details for each college.
- **Columns:** `id` (PK), `college_id` (FK), `title`, `description`, `event_type`, `start_time`, `end_time`, `location`, `capacity`, `created_at`
- **Relation:** Each event belongs to a college (`college_id` references `colleges.id`).

### 3. `students`
- Stores student details.
- **Columns:** `id` (PK), `college_id` (FK), `name`, `email`, `roll_no`
- **Relation:** Each student belongs to a college (`college_id` references `colleges.id`).

### 4. `registrations`
- Stores which students registered for which events.
- **Columns:** `id` (PK), `event_id` (FK), `student_id` (FK), `registered_at`
- **Relation:** Many-to-many between `students` and `events` (a student can register for many events, and an event can have many students).

### 5. `attendance`
- Tracks attendance for event registrations.
- **Columns:** `id` (PK), `registration_id` (FK), `checked_in_at`, `status`
- **Relation:** Each attendance record is linked to a registration (`registration_id` references `registrations.id`).

### 6. `feedbacks`
- Stores feedback and ratings for events by registered students.
- **Columns:** `id` (PK), `registration_id` (FK), `rating`, `comment`, `submitted_at`
- **Relation:** Each feedback is linked to a registration (`registration_id` references `registrations.id`).

---

### Entity Relationship Summary

- **colleges** ⟶ **students**: One-to-many (a college has many students)
- **colleges** ⟶ **events**: One-to-many (a college has many events)
- **students** ⟷ **events** (via **registrations**): Many-to-many
- **registrations** ⟶ **attendance**: One-to-one (each registration can have one attendance record)
- **registrations** ⟶ **feedbacks**: One-to-one (each registration can have one feedback)

---

