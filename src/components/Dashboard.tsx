import React from 'react';

export default function Dashboard() {
    // Retrieve the JWT token from sessionStorage
    const token = sessionStorage.getItem('token');

    // You can decode and use the token payload if needed
    // For example, if the token contains user information:
    // const tokenPayload = JSON.parse(atob(token.split('.')[1]));

    return (
        <div>
            <h1>Welcome to the Dashboard</h1>
            {/* Display authenticated content here */}
            <p>This is a protected route.</p>
            {/* You can include any additional content or components */}
        </div>
    );
}

