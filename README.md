# Weekly Report Generator & Team Dashboard

A full-stack MERN web application built for the Software Engineering Internship technical assignment.

The system allows team members to submit structured weekly reports and allows managers/admins to view team progress, filter reports, manage projects/categories, and analyze dashboard insights.

## Features

### Authentication & Roles

- User registration
- User login/logout
- JWT-based authentication
- Password hashing using bcrypt
- Role-based access control
- Roles:
  - Team Member
  - Manager/Admin

### Team Member Features

- Create weekly report
- Save report as draft
- Submit report
- Edit own report
- Delete own report
- View own report history
- Fixed report fields:
  - Week/date range
  - Project/category
  - Tasks completed
  - Tasks planned for next week
  - Blockers/challenges
  - Hours worked
  - Notes/links

### Manager/Admin Features

- View all team reports
- Filter reports by:
  - Team member
  - Project/category
  - Status
  - Week/date range
- Track submission status:
  - Submitted
  - Pending
  - Late
- Manage projects/categories:
  - Add project/category
  - Edit project/category
  - Delete project/category

### Dashboard & Visual Insights

- Total reports submitted this week
- Submission compliance rate
- Number of open blockers
- Total hours worked
- Tasks completed trend
- Submission status by team member
- Workload distribution by project
- Recent activity feed

## Tech Stack

### Frontend

- React
- React Router DOM
- Axios
- Tailwind CSS
- Recharts

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- express-validator

## Project Structure

```txt
weekly-report-dashboard/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── validators/
│   │   └── server.js
│   │
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── .gitignore
└── README.md



User
- _id
- name
- email
- password
- role
- assignedProjects
- createdAt
- updatedAt

Project
- _id
- name
- description
- assignedMembers
- createdBy
- createdAt
- updatedAt

Report
- _id
- user
- project
- weekStartDate
- weekEndDate
- tasksCompleted
- tasksPlannedNextWeek
- blockers
- hoursWorked
- notes
- status
- submittedAt
- createdAt
- updatedAt

User 1 -------- many Reports
Project 1 ----- many Reports
User many ----- many Projects
Manager/User 1 --- many Projects created