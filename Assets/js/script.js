// var userFormEl = document.querySelector('#user-form');
// var citySearchEl = document.querySelector('#citySearch')
var regionNameIP = document.querySelector('#regionName');
var cityIP = document.querySelector('#city');
var zipCodeIP = document.querySelector('#zipCode');
var latIP = document.querySelector('#lat');
var lonIP = document.querySelector('#lon');
var ISP = document.querySelector('#ISP');
var populationIP = document.querySelector('#population');


var freeGeoIP = 'https://api.freegeoip.app/json/?apikey=74824920-b48a-11ec-aeb7-87f5f0610281';

fetch(freeGeoIP)
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                        
            regionNameIP.textContent = data.region_name;
            cityIP.textContent = data.city;
            zipCodeIP.textContent = data.zip_code;
            latIP.textContent = data.latitude;
            lonIP.textContent = data.longitude;
            ISP.textContent = data.ip;

            var ownCity = data.city;
            var ownState = data.region_name;
            getCityGeonameID(ownCity, ownState);
            });
        } else {
            console.log(response.statusText);
        }
    })
    .catch(function (error) {
          console.log(error);
    });


var getCityGeonameID = function (ownCity, ownState){

    var teleportCity = "https://api.teleport.org/api/cities/?search="+ownCity+","+ownState;
    fetch(teleportCity)
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
            console.log(data);
            
            var cityGeonameIDlink = data._embedded['city:search-results'][0]._links['city:item'].href
                       
            getNearestUrbanArea(cityGeonameIDlink)

            });
        } else {
            console.log(response.statusText);
        }
    })
    .catch(function (error) {
          console.log(error);
    });
}

var getNearestUrbanArea = function(cityGeonameIDlink){
    fetch(cityGeonameIDlink)
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
            console.log(data);
            
            populationIP.textContent = data.population
            
            var urbanArea = data._links['city:urban_area'].href
           
            console.log(urbanArea);
            
            getUrbanAreaQualOfLifeScores(urbanArea);

            });
        } else {
            console.log(response.statusText);
        }
    })
    .catch(function (error) {
          console.log(error);
    });
}

var getUrbanAreaQualOfLifeScores = function(urbanArea){
    fetch(urbanArea+'scores/')
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
            console.log(data);
            
            });
        } else {
            console.log(response.statusText);
        }
    })
    .catch(function (error) {
          console.log(error);
    });
}

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


//   userFormEl.addEventListener('submit', formSubmitHandler);