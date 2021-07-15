// Simple Weather App
// Class: CSE1212b
// Author: Joshua Thieme
// Date Finalized: July 6, 2021
// How Long it took me: ~ 5 hours or so.
// Hardest Part: Understaning how the API parsed its information.

const getLocation = () => {
    // Using this to get the lat / lon from the IP address
    $.getJSON('https://ipgeolocation.abstractapi.com/v1/?api_key=81805a1eb5af493f8b14cf816c322747')
    .done (function(location)
    {
        console.log(location);
        let lat = parseFloat(location.latitude);
        let lon = parseFloat(location.longitude);
        let city = location.city;
        let state = location.region;

    // Couldn't figure out how to make the API use these variables
    // to pass into the url.
        
    // document.querySelector('#latitude').innerHTML= lat;
    // document.querySelector('#longitude').innerHTML = lon;
    setLocation(city, state);
    getForecast(lat, lon);
    });
}

const setLocation = (city, state) => {
    // Displaying the location to the window.
    document.querySelector('#city').innerHTML= city;
    document.querySelector('#state').innerHTML = state;
}

const getWeather = () => {
    // This gets the ball rolling.
    getLocation();
    
}

const parseDOW = (updateTime) => {
    // Format the Day of the Week
    let updateDOW = new Date(updateTime).getDay();
    
    if (updateDOW === 0){
        updateDOW = 'Sun';
    }
    else if (updateDOW === '1') {
        updateDOW = 'Mon';
    }
    else if (updateDOW === 2) {
        updateDOW = 'Tue';
    }
    else if (updateDOW === 3) {
        updateDOW = 'Wed';
    }
    else if (updateDOW === 4) {
        updateDOW = 'Thu';
    }
    else if (updateDOW === 5) {
        updateDOW = 'Fri';
    }
    else {
        updateDOW = 'Sat';
    }
    
    document.querySelector('#updateDOW').innerHTML = updateDOW;
}

const parseMonth = (updateTime) => {
    let updateMonth = new Date(updateTime).getMonth();
    
    if (updateMonth === 0) {
        updateMonth = 'Jan';
    }
    else if (updateMonth === 1) {
        updateMonth = 'Feb';
    }
    else if (updateMonth === 2) {
        updateMonth = 'Mar';
    }
    else if (updateMonth === 3) {
        updateMonth = 'Apr';
    }
    else if (updateMonth === 4) {
        updateMonth = 'Jun';
    }
    else if (updateMonth === 5) {
        updateMonth = 'Jul';
    }
    else if (updateMonth === 6) {
        updateMonth = 'Aug';
    }
    else if (updateMonth === 7) {
        updateMonth = 'Sep';
    }
    else if (updateMonth === 8) {
        updateMonth = 'Oct';
    }
    else if (updateMonth === 9) {
        updateMonth = 'Nov';
    }
    else if (updateMonth === 10) {
        updateMonth = 'Dec';
    }
    document.querySelector('#updateMonth').innerHTML = updateMonth;
}

const parseUpdateTime = (updateTime) => {
    let updateDate = new Date(updateTime).getDate();
    let updateHour = new Date(updateTime).getHours();
    let updateMin = new Date(updateTime).getMinutes();
    
    parseDOW(updateTime);

    parseMonth(updateTime);

    // Format the minutes
    // add a 0 if minutes are less than 10
    if (updateMin < 10) {
        updateMin = '0' + updateMin;
    }

    // Convert military time to 12 hour time
    // if hour is 13 (1pm), then subtract 12 to make it 1pm
    // also add pm
    if (updateHour >= 13) {
        var newHour = updateHour - 12;
        let pm = 'pm';
        
        document.querySelector('#am-pm').innerHTML = pm;

    }
    // if it's before noon, add am
    else if (updateHour < 12) {
        let am = 'am';
        document.querySelector('#am-pm').innerHTML = am;
        console.log(am);
    }
    
    document.querySelector('#updateDate').innerHTML = updateDate;
    document.querySelector('#updateTime').innerHTML = newHour;
    document.querySelector('#updateMin').innerHTML = updateMin;
}

const getForecast = (lat, lon) => {
    // Passing the params from the getLocation() function.
    let url = `https://api.weather.gov/points/${lat},${lon}`;

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
            
            // console.log(hour);
            
            
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
            // let date = new Date(updateTime);
            let isDayTime = myWeather.properties.periods[i]['isDaytime'];

            parseUpdateTime(updateTime);
                    
            if (isDayTime){
                setDayStyle(myShort);
            }
            else {
                setNightStyle(myShort);
            }

            // Get the values displayed to the window
            setForecast(myTemp, myTempUnit, windD, windSpeed, myShort);
                        
        })
    });
}

const setForecast = (myTemp, myTempUnit, windD, windSpeed, myShort) => {
    // This is displaying the values to the window.
    document.querySelector('#temp').innerHTML = myTemp;
    document.querySelector('#tempUnit').innerHTML = myTempUnit;
    document.querySelector('#windD').innerHTML = windD;
    document.querySelector('#windSpeed').innerHTML = windSpeed;
    // document.querySelector('#updateTime').innerHTML = date;
    document.querySelector('#short').innerHTML = myShort;
}

const setDayStyle = (myShort) => {
    // This does the styling for the background color / image
    // as well as setting the icon.
    switch (myShort){
        
        case 'Sunny' : {
            document.querySelector('#forecast').style.backgroundColor = '#008cff';
            document.getElementById('icon').classList.add("fas", "fa-sun");
            document.querySelector('.fa-sun').style.visibility = 'visible';
            document.querySelector('.fa-sun').style.color = 'yellow';
            break;
        }

        case 'Mostly Clear' : {
            document.querySelector('#forecast').style.backgroundColor = '#008cff';
            document.getElementById('icon').classList.add("fas", "fa-sun");
            document.querySelector('.fa-sun').style.visibility = 'visible';
            document.querySelector('.fa-sun').style.color = 'yellow';
            break;
        }

        case 'Cloudy' : {
            document.querySelector('#forecast').style.backgroundImage = "url('images/cloudy-sky.jpg')";
            document.getElementById('icon').classList.add("fas", "fa-cloud");
            document.querySelector('.fa-cloud').style.visibility = 'visible';
            document.querySelector('.fa-cloud').style.color = '#888';
            break;
        }

        case 'Partly Cloudy' : {
            document.querySelector('#forecast').style.backgroundImage = "url('images/cloudy-sky.jpg')";
            document.getElementById('icon').classList.add("fas", "fa-cloud-sun");
            document.querySelector('.fa-cloud-sun').style.visibility = 'visible';
            document.querySelector('.fa-cloud-sun').style.color = '#999';
            break;
        }

        case 'Rainy' : {
            document.querySelector('#forecast').style.backgroundColor = '#008cff';
            document.getElementById('icon').classList.add("fas", "fa-cloud-rain");
            document.querySelector('.fa-cloud-rain').style.visibility = 'visible';
            document.querySelector('.fa-cloud-rain').style.color = '888';
            break;
        }

        case 'Haze' : {
            document.querySelector('#forecast').style.backgroundColor = '#008cff';
            document.getElementById('icon').classList.add("fas", "fa-sun");
            document.querySelector('.fa-sun').style.visibility = 'visible';
            document.querySelector('.fa-sun').style.color = 'yellow';
            break;
        }

        case 'Partly Smokey' : {
            document.querySelector('#forecast').style.backgroundColor = '#008cff';
            document.getElementById('icon').classList.add("fas", "fa-sun");
            document.querySelector('.fa-sun').style.visibility = 'visible';
            document.querySelector('.fa-sun').style.color = 'yellow';
            break;
        }
        
        default : { 
            document.querySelector('#forecast').style.backgroundColor = '#008cff';
            document.getElementById('icon').classList.add("fas", "fa-sun");
            document.querySelector('.fa-sun').style.visibility = 'visible';
            document.querySelector('.fa-sun').style.color = 'yellow';
        }
    }
}

const setNightStyle = (myShort) => {
    // Using switch case to make it a little more clear.
    switch (myShort) {
        case 'Clear' : {
            document.querySelector('#forecast').style.backgroundColor = '#230051';
            document.getElementById('icon').classList.add("fas", "fa-moon");
            document.querySelector('.fa-moon').style.visibility = 'visible';
            document.querySelector('.fa-moon').style.color = 'white';
        }

        case 'Mostly Clear' : {
            document.querySelector('#forecast').style.backgroundColor = '#230051';
            document.getElementById('icon').classList.add("fas", "fa-moon");
            document.querySelector('.fa-moon').style.visibility = 'visible';
            document.querySelector('.fa-moon').style.color = 'white';
        }

        case 'Haze' : {
            document.querySelector('#forecast').style.backgroundColor = '#230051';
            document.getElementById('icon').classList.add("fas", "fa-moon");
            document.querySelector('.fa-moon').style.visibility = 'visible';
            document.querySelector('.fa-moon').style.color = 'white';
        }

        default : {
            document.querySelector('#forecast').style.backgroundColor = '#230051';
            document.getElementById('icon').classList.add("fas", "fa-moon");
            document.querySelector('.fa-moon').style.visibility = 'visible';
            document.querySelector('.fa-moon').style.color = 'white';
        }
    }
}

// This gets things going. Think of it as a Driver Program.
window.addEventListener('load', getWeather());
