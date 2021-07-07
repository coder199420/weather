// Simple Weather App
// Class: CSE1212b
// Author: Joshua Thieme
// Date Finalized: July 6, 2021
// How Long it took me: ~ 5 hours or so.
// Hardest Part: Understaning how the API parsed its information.

const getLocation = () => {
    // Using this to get the lat / lon from the IP address
    $.getJSON('https://geoip-db.com/json/geoip.php?jsonp=?')
    .done (function(location)
    {
        let lat = parseFloat(location.latitude);
        let lon = parseFloat(location.longitude);
        let city = location.city;
        let state = location.state;

    // Couldn't figure out how to make the API use these variables
    // to pass into the url.
        // let url = "https://api.weather.gov/points/'lon='+lon+'&lat='+lat";
    // document.querySelector('#latitude').innerHTML= lat;
    // document.querySelector('#longitude').innerHTML = lon;
    
    setLocation(city, state);
    });
}

const setLocation = (city, state) =>{
    // Displaying the location to the window.
    document.querySelector('#city').innerHTML= city;
    document.querySelector('#state').innerHTML = state;
}

const getWeather = () => {
    // This gets the ball rolling.
    getLocation();
    getForecast();
}


const getForecast = () => {
    // Manualling entering the coordinates for Rexburg, ID
let url = 'https://api.weather.gov/points/43.81,-111.789';
// Getting info from the API
fetch(url)
    .then(response => response.json())
    .then(weather => {
        let forecast = weather.properties.forecastHourly;
        
        // Getting info for the forecast
        fetch(forecast)
        .then(forecastResponse => forecastResponse.json())
        .then(myWeather => {

            let hour = new Date().getHours();

            // I might use this in the future to display a weekly forecast.
            
            // if (hour >= 12) {
            //     i++;
            // }
            let j = 0;
            let header = document.querySelector('#header');

            if (j > 0){
                header.innerHTML = 'Forecast for Today';
            }
            else{
                header.innerHTML = 'Forecast for Today';
            }
            
            // Dynamically get the current hour and set the index 'i'
            // to match the current hour.
            let i = 0;
            // let startTime = myWeather.properties.periods[i]['startTime'];
            // let startHour = endTime.slice(11,13);
            let endTime = myWeather.properties.periods[i]['endTime'];
            let endHour = endTime.slice(11,13);
            if (hour > endHour){
                i++;
                let period = myWeather.properties.periods[i];
                period++;
            }   

            // Setting up the variables from the API.
            let updateTime = myWeather.properties.updateTime;
            let myTemp = myWeather.properties.periods[i]['temperature'];            
            let myTempUnit = myWeather.properties.periods[i]['temperatureUnit'];
            let myShort = myWeather.properties.periods[i]['shortForecast'];
            // let myDetailed = myWeather.properties.periods[i]['detailedForecast'];
            let windD = myWeather.properties.periods[i]['windDirection'];
            let windSpeed = myWeather.properties.periods[i]['windSpeed'];
            let date = new Date(updateTime);
            let isDayTime = myWeather.properties.periods[i]['isDaytime'];
            
            if (isDayTime){
                setDayStyle(myShort);
            }
            else {
                setNightStyle(myShort);
            }

            // Get the values displayed to the window
            setForecast(myTemp, myTempUnit, windD, windSpeed, date, myShort);
                        
        })
    });
}

const setForecast = (myTemp, myTempUnit, windD, windSpeed, date, myShort) => {
    // This is displaying the values to the window.
    document.querySelector('#temp').innerHTML = myTemp;
    document.querySelector('#tempUnit').innerHTML = myTempUnit;
    document.querySelector('#windD').innerHTML = windD;
    document.querySelector('#windSpeed').innerHTML = windSpeed;
    document.querySelector('#updateTime').innerHTML = date;
    document.querySelector('#short').innerHTML = myShort;
}

const setDayStyle = (myShort) => {
    // This does the styling for the background color / image
    // as well as setting the icon.
    if (myShort === 'Sunny') {
        document.querySelector('#forecast').style.backgroundColor = '#008cff';
        document.getElementById('icon').classList.add("fas", "fa-sun");
        document.querySelector('.fa-sun').style.visibility = 'visible';
        document.querySelector('.fa-sun').style.color = 'yellow';
    }
    else if (myShort === 'Mostly Clear') {
        document.querySelector('#forecast').style.backgroundColor = '#008cff';
        document.getElementById('icon').classList.add("fas", "fa-sun");
        document.querySelector('.fa-sun').style.visibility = 'visible';
        document.querySelector('.fa-sun').style.color = 'yellow';
    }
    else if (myShort === 'Cloudy') {
        document.querySelector('#forecast').style.backgroundImage = "url('images/cloudy-sky.jpg')";
        document.getElementById('icon').classList.add("fas", "fa-cloud");
        document.querySelector('.fa-cloud').style.visibility = 'visible';
        document.querySelector('.fa-cloud').style.color = '#888';
    }
    else if (myShort === 'Partly Cloudy') {
        document.querySelector('#forecast').style.backgroundImage = "url('images/cloudy-sky.jpg')";
        document.getElementById('icon').classList.add("fas", "fa-cloud-sun");
        document.querySelector('.fa-cloud-sun').style.visibility = 'visible';
        document.querySelector('.fa-cloud-sun').style.color = '#999';
    }
    else if (myShort === 'Rainy') {
        document.querySelector('#forecast').style.backgroundColor = '#008cff';
        document.getElementById('icon').classList.add("fas", "fa-cloud-rain");
        document.querySelector('.fa-cloud-rain').style.visibility = 'visible';
        document.querySelector('.fa-cloud-rain').style.color = '888';
    }
}

const setNightStyle = (myShort) => {
    if (myShort === 'Clear') {
        document.querySelector('#forecast').style.backgroundColor = '#230051';
        document.getElementById('icon').classList.add("fas", "fa-moon");
        document.querySelector('.fa-moon').style.visibility = 'visible';
        document.querySelector('.fa-moon').style.color = 'white';
    }
    else if (myShort === 'Mostly Clear') {
        document.querySelector('#forecast').style.backgroundColor = '#230051';
        document.getElementById('icon').classList.add("fas", "fa-moon");
        document.querySelector('.fa-moon').style.visibility = 'visible';
        document.querySelector('.fa-moon').style.color = 'white';
    }
}

// This gets things going. Think of it as a Driver Program.
window.addEventListener('load', getWeather());

