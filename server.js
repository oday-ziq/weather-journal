const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json()); // Parse incoming JSON
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(cors());
app.use(express.static('website')); // Serve static files from "website" directory

const apiKey = '<your_api_key>&units=imperial';

// Project data
let projectData = {};

// Routes
// GET route
app.get('/all', (req, res) => {
    res.send(projectData);
});

// POST route
app.post('/add', (req, res) => {
    projectData = {
        temperature: req.body.temperature,
        date: req.body.date,
        userResponse: req.body.userResponse,
    };
    res.send({ message: 'Data successfully added!' });
});

const retrieveData = async () => {
    const request = await fetch('/all');
    try {
        const allData = await request.json();
        console.log(allData);
        document.getElementById('temp').innerHTML = `${Math.round(allData.temperature)} degrees`;
        document.getElementById('content').innerHTML = allData.userResponse;
        document.getElementById('date').innerHTML = allData.date;
    } catch (error) {
        console.error('Error:', error);
    }
};

const getWeatherData = async (zip) => {
    const baseURL = 'https://api.openweathermap.org/data/2.5/weather?zip=';
    const response = await fetch(`${baseURL}${zip}&appid=${apiKey}`);
    try {
        return await response.json();
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
};

const postData = async (url = '', data = {}) => {
    const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    });
    try {
        return await response.json();
    } catch (error) {
        console.error('Error posting data:', error);
    }
};

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on localhost:${port}`);
});
