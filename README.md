# Cinema Booking System (Frontend)

The Cinema Booking System is a JAVA /MySQL-based seat and ticket reservation system allowing bookings in a few easy steps.  

It allows users to browse movies, book tickets, and manage their reservations. 

At the same time, it allows admin to manage users, movie details and customer orders. 

This frontend repository contains the client-side code for the application.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)

## Features

### User :
- Browse a list of movies, view movie details and search for a movie.
- User registration and login.
- Book movie tickets and view booking history.
- Cancel orders.
- Reset Password.

### Admin :
- #### Movie management :
  - Add movies with specific sessions and seats.
  - Edit Movies
  - Delete Movies
- #### Order management :
  - Filter all the orders with movie title, order date, user Id, total price, etc.
  - Update Order Status such as cancel, confirm or complete the order.
- #### User management :
  - Block user accounts.
  - Edit users information such as password, username and phone number.
  - View all the users information and filter with username, create date, or email.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed on your machine.
- A backend server for the Cinema Booking System (API).

## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

1. Clone the repository:

   ```bash
   git clone https://github.com/naya0000/MovieTheater__Frontend.git
2. Navigate to the project directory:
   ```bash
   cd MovieTheater__Frontend
3. Install the project dependencies:
   ```bash
   npm install
4. Start the development server:
   ```bash
   npm run start:dev
5. Open your browser and visit http://localhost:3000/cinemas

## Project Structure

- `src/`: Contains the source code for the application.
  - `components/`: Reusable components used throughout the app.
  - `pages/`: Top-level pages/routes of the application.
    - `UserLogin/`: User login page
    - `UserSignUp/`: User sign up for new account.
    - `UserEdit/`: User edit account information.
    - `UserEditPassword/`: User change password.
    - `MovieListPage/`: List released and upcoming movies.
    - ``
  - `services/`: Services for making API requests.
  - `utils/`: Utility functions and constants.
- `public/`: Static assets and HTML template.




