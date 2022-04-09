var userFormEl = document.querySelector('#user-form');
var citySearchEl = document.querySelector('#city-search-name');
var stateSearchEl = document.querySelector('#state-search-name');

// Setting variables to link querySelectors in HTML
var stateNameIP = document.querySelector('#stateName');
var cityIP = document.querySelector('#cityName');
var zipCodeIP = document.querySelector('#zipCode');
var latIP = document.querySelector('#lat');
var lonIP = document.querySelector('#lon');
var ISP = document.querySelector('#ISP');
var populationIP = document.querySelector('#population');

// Setting variables to link to querySelectors in the HTML table for Quality of life Teleport Urban Area closest to present location

var nearestTPCity = document.querySelector("#nearest-Teleport-City");
var presentLoc_CostLivingTP = document.querySelector('#presentLoc_CostLiving');
var presentLoc_SafetyTP = document.querySelector('#presentLoc_Safety');
var presentLoc_HealthCareTP = document.querySelector('#presentLoc_HealthCare');
var presentLoc_LeisureCultureTP = document.querySelector('#presentLoc_LeisureCulture');
var presentLoc_EconomyTP = document.querySelector('#presentLoc_Economy');
var presentLoc_OverallScoreTP = document.querySelector('#presentLoc_OverallScore')

// Setting variables to link to querySelectors in the HTML table for Quality of life for City Searched

var citySearched_LifeExpIP = document.querySelector('#citySearched_LifeExp');
var citySearched_CrimRateIP = document.querySelector('#citySearched_CrimeRate');
var citySearched_AvgIncIP = document.querySelector('#citySearched_AvgInc');
var citySearched_EmpRateIP = document.querySelector('#citySearched_EmpRate');
var citySearched_AirQual = document.querySelector('#citySearched_AirQual');
    
// Fetch call at PageLoad to obtain user's IP address and relevant information
var freeGeoIP = 'https://api.freegeoip.app/json/?apikey=74824920-b48a-11ec-aeb7-87f5f0610281';

fetch(freeGeoIP)
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
            //Populating IP address and relevant info to HTML 
            // console.log(data);
            // console.log(data.region_name)
            stateNameIP.textContent = data.region_name;
            cityIP.textContent = data.city;
            zipCodeIP.textContent = data.zip_code;
            latIP.textContent = data.latitude;
            lonIP.textContent = data.longitude;
            ISP.textContent = data.ip;
            // Creating variables to pass down to next function
            var ownCity = data.city;
            var ownState = data.region_name;
            // To use Teleport API as we want, must obtain GeoNameId 
            getCityGeonameID(ownCity, ownState);
            });
        } else {
            console.log(response.statusText);
        }
    })
    .catch(function (error) {
          console.log('Fetch Error -', error);
    });

// Function for obtaining Teleport GeoNameID for IP address city
var getCityGeonameID = function (ownCity, ownState){
    var teleportCity = "https://api.teleport.org/api/cities/?search="+ownCity+","+ownState;
    fetch(teleportCity)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                // Saving ID link to a variable
                // console.log(data);            
                var cityGeonameIDlink = data._embedded['city:search-results'][0]._links['city:item'].href
                //Passing ID to next fetch function, which will get nearest Urban Area/city to IP address city    
                getNearestUrbanArea(cityGeonameIDlink)
                });
            } else {
                console.log(response.statusText);
            }
        })
        .catch(function (error) {
            console.log('Fetch Error -', error);
    });
}

//Fetch function for getting nearest Urban Area/city to IP address city
var getNearestUrbanArea = function(cityGeonameIDlink){
    fetch(cityGeonameIDlink)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                //Getting population number for IP address city and displaying to HTML 
                populationIP.textContent = data.population
                // Saving nearest Teleport Urban Area to a variable
                var urbanArea = data._links['city:urban_area'].href
                //Passing urban area/city to next function    
                getUrbanAreaQualOfLifeScores(urbanArea);
                });
            } else {
                console.log(response.statusText);
            }
        })
        .catch(function (error) {
            console.log('Fetch Error -', error);
        });
}
// Fetch function for obtaining nearest urban area/city quality of life Teleport scores
var getUrbanAreaQualOfLifeScores = function(urbanArea){
    fetch(urbanArea+'scores/')
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                console.log("This is the date for nearest urban area/city qualify of life Teleport scores:   ", data);

                console.log("This is the costing of living score for nearest urban location:  ", data.categories[0].score_out_of_10)


                // Render the data for the closest city to user's present location to the webpage.

                // First we need to pull the city name form the text tring that is the value for Teleport's "summary" key, because that's the only place the city name seems to appear in data.
                 
                    var teleportSummary = data.summary;
                
                    // remove all the commas from the summary
                    var teleportSummaryNoCommas = teleportSummary.replaceAll(',', '');
                    
                    // remove all the html p tags from the summary
                    var teleportSummaryClean = teleportSummaryNoCommas.replaceAll('<p>', '');
                    console.log(teleportSummaryClean);

                    // pull the first two words from the summary, which in most cases will be city and state or city and country
                    var teleportUrbanArea = teleportSummaryClean.split(' ').slice(0,2).join(', ');
                    console.log(teleportUrbanArea);

                // var tele
                // var y = x.split(' ').slice(0,2);

                // var myPlace = y[0].slice(3);
                
                // console.log(myPlace);


                
                nearestTPCity.textContent = teleportUrbanArea;
                presentLoc_CostLivingTP.textContent = data.categories[1].score_out_of_10;
                presentLoc_SafetyTP.textContent = data.categories[7].score_out_of_10;
                presentLoc_HealthCareTP.textContent = data.categories[8].score_out_of_10;
                presentLoc_EconomyTP.textContent = data.categories[11].score_out_of_10;
                presentLoc_LeisureCultureTP.textContent = data.categories[14].score_out_of_10;
                presentLoc_OverallScoreTP.textContent = data.teleport_city_score;
                
                });
            } else {
                console.log(response.statusText);
            }
        })
        .catch(function (error) {
            console.log('Fetch Error -', error);
        });
}
// Fetch function for obtaining quality of life Teleport scores for Searched City
var getSearchedUrbanAreaQualOfLifeScores = function(urbanArea){
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
            console.log('Fetch Error -', error);
        });
}

// Creating autocomplete list with Teleport cities that have quality of life scores
// First fetch all available cities from Teleport

const url = 'https://api.teleport.org/api/urban_areas/';

// Object for storing all cities. This will be the data object used in autocomple feature
var availTelCitiesObj = {};
// Object for storing all cities and their URL for quality of life scores
var availTelCitiesHref = {};

fetch(url)  
    .then(function(response) {  
        if (response.ok) {  
            response.json().then(function(data) {
                // extracting important information from data
                let teleportCitiesArray =data._links['ua:item'];
                // Using a FOR LOOP to create objects
                for (let i = 0; i < teleportCitiesArray.length; i++) {
                    availTelCitiesObj[teleportCitiesArray[i].name] = null
                    
                    availTelCitiesHref[teleportCitiesArray[i].name] = teleportCitiesArray[i].href;
    	        }
                autoCompleListofCities();  
            });
      } else {
            console.log(response);
      }
    })  
    .catch(function(error) {  
        console.error('Fetch Error -', error);  
    });


// Creating function to build autocomple list
var autoCompleListofCities = function() {
    var availCities = document.querySelectorAll('.autocomplete');
    
    // console.log(availTelCitiesObj);
    console.log(availTelCitiesHref);
    // console.log(typeof(availTelCitiesHref));
    // console.log(availTelCitiesHref.Aarhus); //Expected console log result to be Aarhus' URL. BUT THATS NOT THE CASE RIGHT NOW :-(

    // Materialize CSS code for generating autocomple list
    M.Autocomplete.init(availCities,{
        // assigning all Teleport cities Object to be used as the data/autocomplete list
        data: availTelCitiesObj,
        limit: 7,
        //Callback will take the city selected by the User and get the href value (URL) from the availTelCitiesHref object. THIS PART IS NOT WORKING AS EXPECTED. SEE LINE 174
        onAutocomplete: function(city){
        console.log(city);
        var hrefCity = '';
        for (var key in availTelCitiesHref) {
          if (availTelCitiesHref.hasOwnProperty(key))
            if(city == key)
                hrefCity = availTelCitiesHref[key];
        }
        // var hrefCity = availTelCitiesHref.city;
        // passing the city's url to function that will fetch quality of life scores.
        if(hrefCity != '')
            getSearchedUrbanAreaQualOfLifeScores(hrefCity);
        
        }
    });
   
  }
// Materialize CSS event listener for autocomple list
// document.addEventListener('DOMContentLoaded', autoCompleListofCities);

    
// copy user input for city and state to javascript variables on click of submit button.
var formSubmitHandler = function (event) {
    event.preventDefault();
  
    var citySearchName = citySearchEl.value.trim();
    var stateSearchName = stateSearchEl.value.trim();

    console.log(citySearchName);
    console.log(stateSearchName);
  
    if (citySearchName && stateSearchName) {
    getCityGeonameID(citySearchName, stateSearchName);
  
//     //   cityContainerEl.textContent = '';
//       citySearchEl.value = '';
    } else {
      alert('Please enter a valid city and state');
    }
    };


//   userFormEl.addEventListener('submit', formSubmitHandler);

//   The following jQuery code is required for the Materialize drop down menu to work, per Materialize documnentation.
//   $('.dropdown-trigger').dropdown();


