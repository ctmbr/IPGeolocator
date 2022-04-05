// var userFormEl = document.querySelector('#user-form');
// var citySearchEl = document.querySelector('#citySearch')
var freeGeoIP = 'https://api.freegeoip.app/json/?apikey=74824920-b48a-11ec-aeb7-87f5f0610281';

fetch(freeGeoIP)
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