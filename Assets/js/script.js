// var userFormEl = document.querySelector('#user-form');
// var citySearchEl = document.querySelector('#citySearch')
var regionNameIP = document.querySelector('#regionName');
var cityIP = document.querySelector('#city');
var zipCodeIP = document.querySelector('#zipCode');
var latIP = document.querySelector('#lat');
var lonIP = document.querySelector('#lon');
var ISP = document.querySelector('#ISP');

var freeGeoIP = 'https://api.freegeoip.app/json/?apikey=74824920-b48a-11ec-aeb7-87f5f0610281';

fetch(freeGeoIP)
      .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
            console.log(data);
            
            regionNameIP.textContent = data.region_name;
            cityIP.textContent = data.region_name;
            zipCodeIP.textContent = data.zip_code;
            latIP.textContent = data.latitude;
            lonIP.textContent = data.longitude;
            ISP.textContent = data.ip;

          });
        } else {
            console.log(response.statusText);
        }
      })
      .catch(function (error) {
          console.log(error);
      });

// var formSubmitHandler = function (event) {
//     event.preventDefault();
  
//     var cityName = citySearchEl.value.trim();
  
//     if (cityName) {
//       getCityQualityInfo(cityName);
  
//     //   cityContainerEl.textContent = '';
//       citySearchEl.value = '';
//     } else {
//       alert('Please enter a city name');
//     }
//   };


var getCityQualityInfo = function (cityName){

  // const options = {
  //   method: 'GET',
  //   headers: {
  //     'X-RapidAPI-Host': 'domainr.p.rapidapi.com',
  //     'X-RapidAPI-Key': 'bf174c4175msh413c16704f042b3p108941jsnadc0ad6a42a8'
  //   }
  // };
  console.log(cityName);
  console.log(typeof(cityName));
  var apiUrl = "http://numbersapi.com/"+cityName+"/year?json";
     
    fetch(apiUrl)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
          console.log(data);
          });
        } else {
          console.log(response.statusText);
          // alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
          console.log(error);
        // alert('Unable to connect to goDaddy.com');
      });
  };

//   userFormEl.addEventListener('submit', formSubmitHandler);