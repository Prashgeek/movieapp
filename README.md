"# movieapp" 
MERN Movie Application
A full-stack MERN Movie App with JWT authentication, Admin role-based access, search, sort, pagination, and IMDb Top Movies data via TMDb.

Live URLs==================================================
Frontend: https://movieapp.vercel.app

Backend: https://movieapp-l1n0.onrender.com
===========================================================

Tech Stack#######################################
Frontend: React, Material UI, Context API
Backend: Node.js, Express.js, JWT
Database: MongoDB Atlas
Deployment: Vercel (Frontend), Render (Backend)

Features########################################
****************Users****************
View IMDb top movies
Search by title or description
Sort by rating, name, release date, duration
Pagination
Fully responsive UI

*********Admin***********************
Secure admin login
Add / Edit / Delete movies
Admin-only route protection
########################################################
movieapp/
├── frontend/
└── backend/
#####################################################


*********************************************************
Local Setup Guide
1️ Clone Repository
git clone https://github.com/Prashgeek/movieapp.git
cd movieapp
Backend Setup
cd backend
npm install
*****************************************
Create .env:
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASS=Admin123!
****************************************

***************************************
Seed admin user:
node src/utils/createAdmin.js

Import IMDb Top Movies (via TMDb):
node src/utils/importTopMovies.js
****************************************

########################################
    Start backend:
                   npm start
########################################

*****************************************************
Frontend Setup
cd ../frontend
npm install

Create .env:
REACT_APP_API_URL=http://localhost:5000/api

Start frontend:
                npm start
#########################################################

$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
Deployment:
Frontend: Vercel
Backend: Render
Database: MongoDB Atlas
Environment variables are securely configured on each platform.
$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$


                

