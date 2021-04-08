// Personal API Key for OpenWeatherMap API
const apiKey = "2f0e3e8c3cbc8216883c31074c690cca";

// Event listener to add function to existing HTML DOM element
document.getElementById('generate').addEventListener('click', getWeatherData);

/* Function called by event listener */
function getWeatherData() {
    const zipCode = document.getElementById('zip').value;
    retrieveData(`https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&units=metric&appid=${apiKey}`)
        .then(function (response) {
            postData('/weather', {
                temperature: response.main.temp.toFixed(0),
                date: new Date(response.dt * 1000),
                userResponse: response
            })
        }).then(() => getWeatherDataFromServer())
}

function getWeatherDataFromServer() {
    retrieveData('/weather').then(function (response) {
        updateUI(response.userResponse);
    })
}

function updateUI(response) {
    if (response) {
        document.getElementById('location').innerText = response.sys.country + ', ' + response.name;
        document.getElementById('temp').innerHTML = `${response.main.temp.toFixed(0)}<sup>o</sup>C`;
        document.getElementById('day').innerText = todayName(new Date(response.dt * 1000));
        document.getElementById('month').innerText = formattedDate(new Date(response.dt * 1000));
        document.getElementById('wind').innerHTML = `<img src="images/icon-wind.png" alt="wind_icon" title="wind speed">${response.wind.speed}km/h`;
        document.getElementById('humidity').innerHTML = `<img src="images/icon-humidity.png" alt="humidity_icon" title="humidity">${response.main.humidity}%`;
        document.getElementById('compass').innerHTML = `<img src="images/icon-compass.png" alt="icon-wind-direction" title="wind direction">${degToName(response.wind.deg)}`;
        document.getElementById('weather_icon').src = `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;
        document.getElementById('weather_icon').alt = response.weather[0].description;
        document.getElementById('weather_icon').title = response.weather[0].description;
    }
}

/* Function to GET Web API Data*/

/* Function to POST data */
const postData = async (url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },

        body: JSON.stringify(data),
    });

    try {
        const newData = await response.json();
        console.log(newData);
        return newData;
    } catch (error) {
        console.log("error", error);
        return error;
    }
}


/* Function to GET Project Data */
const retrieveData = async (url = '') => {
    const request = await fetch(url);
    try {
        return await request.json()
    } catch (error) {
        console.log("error", error);
        return error;
    }
}

// Functions

/**
 * get day and month name from passed date
 *
 * @param date
 */
function formattedDate(date) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    return date.getDay() + ' ' + monthNames[date.getMonth()];
}

/**
 * get today name from passed date
 *
 * @param date
 */
function todayName(date) {
    const dayNames = ["Saturday", "Sunday", "Monday", "Tuesday",
        "Wednesday", "Thursday", "Friday"
    ];

    return dayNames[date.getDay()];
}

function degToName(deg) {
    const directions = ["North", "North-East", "East", "South-East", "South", "South-West", "West", "North-West"]

    const index = Math.round(((deg %= 360) < 0 ? deg + 360 : deg) / 45) % 8;

    return directions[index];
}