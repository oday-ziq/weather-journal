// Global Variables
const baseURL = 'https://api.openweathermap.org/data/2.5/weather?zip=';
const apiKey = '<your_api_key>&units=imperial'; // Replace <your_api_key> with your actual API key

// Event listener for the "Generate" button
document.getElementById('generate').addEventListener('click', async () => {
    // Get user input
    const zip = document.getElementById('zip').value;
    const feelings = document.getElementById('feelings').value;

    // Fetch weather data from OpenWeatherMap
    const weatherData = await getWeatherData(zip);
    if (weatherData) {
        const date = new Date().toLocaleDateString(); // Get today's date
        // Post data to the local server
        await postData('/add', {
            temperature: weatherData.main.temp,
            date: date,
            userResponse: feelings,
        });
        // Retrieve data from the server and update the UI
        retrieveData();
    }
});

// Function to fetch weather data from OpenWeatherMap API
const getWeatherData = async (zip) => {
    try {
        const response = await fetch(`${baseURL}${zip}&appid=${apiKey}`);
        const data = await response.json();
        if (data.cod !== 200) {
            alert(`Error: ${data.message}`);
            return null;
        }
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
};

// Function to POST data to the server
const postData = async (url = '', data = {}) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return await response.json();
    } catch (error) {
        console.error('Error posting data:', error);
    }
};

// Function to retrieve data from the server and update the UI
const retrieveData = async () => {
    try {
        const response = await fetch('/all');
        const allData = await response.json();

        // Update UI with the retrieved data
        document.getElementById('date').innerHTML = `Date: ${allData.date}`;
        document.getElementById('temp').innerHTML = `Temperature: ${Math.round(allData.temperature)} °F`;
        document.getElementById('content').innerHTML = `Feeling: ${allData.userResponse}`;
    } catch (error) {
        console.error('Error retrieving data:', error);
    }
};
