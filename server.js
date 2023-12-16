const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:3000', // Specify the allowed origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Enable credentials (cookies, headers, etc.)
  }));
  

// Your routes and other middleware go here

const port = 3000; // Adjust the port number as needed
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
