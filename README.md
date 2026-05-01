# Gharpayy PG Reservation CRM MVP

A usable MVP for managing PG reservation leads, ownership, pipeline movement, visit scheduling, property availability, and bed reservations.

## Overview

This project is built as part of the Gharpayy assignment. The goal is to design a basic Lead Management CRM that can support real operational workflows for a PG reservation business.

The app helps an operations or sales team capture leads, assign ownership, manage lead stages, schedule property visits, reserve beds, and track performance through a simple dashboard.

## Project Structure

```txt
gharpayy-pg-reservation-crm/
├── public/                  # Static public assets served directly by Vite
├── src/                     # Main source code for the React application
│   ├── App.jsx              # Main app file containing pages, state, lead flow, visits, properties, and reservations
│   ├── index.css            # Global styling for layout, dashboard, forms, tables, pipeline, cards, and responsive UI
│   └── main.jsx             # React entry point that mounts the App component into the browser
├── .gitignore               # Files and folders ignored by Git, such as node_modules and build output
├── eslint.config.js         # ESLint configuration for code quality checks
├── index.html               # Main HTML template used by Vite
├── package.json             # Project metadata, scripts, and dependencies
├── package-lock.json        # Locked dependency versions for consistent installs
├── README.md                # Project documentation, setup steps, features, and submission details
└── vite.config.js           # Vite build and development server configuration
```

## Live Demo

Add deployed link here.

## GitHub Repository

Add repository link here.

## Features

- Lead capture with name, phone, source, budget, location, move-in date, owner, and notes
- Owner assignment for every lead
- Lead status management
- Pipeline board with CRM stages
- Visit scheduling for leads and properties
- Interactive PG properties page
- Property occupancy and available bed tracking
- Bed reservation flow
- Automatic lead conversion to booked after reservation
- Dashboard analytics
- LocalStorage persistence

## CRM Pipeline Stages

- New
- Contacted
- Visit Scheduled
- Negotiation
- Booked
- Lost

## Main Modules

### Dashboard

Shows key business metrics:

- Total leads
- New leads
- Scheduled visits
- Bookings
- Conversion rate
- Available beds
- Leads by status chart

### Leads

Allows the team to add and manage leads. Each lead contains contact details, budget, preferred location, move-in date, assigned owner, notes, and current status.

### Pipeline

Shows leads grouped by CRM stage. Leads can be moved across stages as they progress through the sales journey.

### Visits

Allows visit scheduling for a selected lead and PG property. Scheduling a visit automatically moves the lead to the Visit Scheduled stage.

### Properties

Shows PG properties with rent, location, total beds, available beds, and occupancy. Each property is clickable and displays related visits and reservations.

### Reservations

Allows the team to reserve a bed for a lead. Once a reservation is created, the selected property’s available beds reduce and the lead status changes to Booked.

## Product Flow

```txt
Lead inquiry
→ Owner assigned
→ Lead contacted
→ Visit scheduled
→ Visit completed
→ Bed reserved
→ Lead converted to booked
```

## Tech Stack

- React
- Vite
- JavaScript
- CSS
- Lucide React
- Recharts
- LocalStorage

## How To Run Locally

Clone the repository:

```powershell
git clone YOUR_REPOSITORY_LINK
```
Go to the project folder:

```powershell
cd gharpayy-pg-reservation-crm
```

Install dependencies:

```powershell
npm install
```

Start development server:

```powershell
npm run dev
```

Build for production:

```powershell
npm run build
```

## Deployment

The app can be deployed on Vercel or Netlify.

For Vercel:

- Framework: Vite
- Build command: npm run build
- Output directory: dist

## Future Scope

- Authentication and role-based access
- Backend database integration
- Real-time lead assignment
- Calendar integration for visits
- WhatsApp follow-up reminders
- Payment tracking
- Property inventory management
- Lead source analytics
- Advanced owner performance reports

## Assignment Submission

Built for the Gharpayy Lead Management CRM assignment as a functional MVP for next-generation PG reservation operations