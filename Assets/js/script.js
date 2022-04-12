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
var presentLoc_EconomyTP = document.querySelector('#presentLoc_Economy');
var presentLoc_LeisureCultureTP = document.querySelector('#presentLoc_LeisureCulture');
var presentLoc_OverallScoreTP = document.querySelector('#presentLoc_OverallScore')

// Setting variables to link to querySelectors in the HTML table for Quality of life for City Searched

var citySearched = document.querySelector("#city-selected-from-dropdown")
var citySearched_CostLivingTP = document.querySelector('#citySearched_CostLiving');
var citySearched_SafetyTP = document.querySelector('#citySearched_Safety');
var citySearched_HealthCareTP = document.querySelector('#citySearched_HealthCare');
var citySearched_EconomyTP = document.querySelector('#citySearched_Economy');
var citySearched_LeisureCultureTP = document.querySelector('#citySearched_LeisureCulture');
var citySearched_OverallScoreTP = document.querySelector('#citySearched_OverallScore');
    
// Fetch call at PageLoad to obtain user's IP address and relevant information
var freeGeoIP = 'https://api.freegeoip.app/json/?apikey=74824920-b48a-11ec-aeb7-87f5f0610281';

var pageLoad = true, selectedCity = '';

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



console.log("availTelCitiesHref: ", availTelCitiesHref);


//Fetch function for getting nearest Urban Area/city to IP address city
var getNearestUrbanArea = function(cityGeonameIDlink){
    fetch(cityGeonameIDlink)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log('hello', data);
                //Getting population number for IP address city and displaying to HTML 
                nearestTPCity.textContent = data._links['city:urban_area'].name;
                populationIP.textContent = data.population
                // Saving nearest Teleport Urban Area to a variable
                var urbanArea = data._links['city:urban_area'].href;
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
                console.log("This is the data for nearest urban area/city quality of life Teleport scores:   ", data);

                console.log("This is the costing of living score for nearest urban location:  ", data.categories[0].score_out_of_10)

                console.log(data);


                // Render the data for the closest city to user's present location to the webpage.

                // // First we need to pull the city name form the text tring that is the value for Teleport's "summary" key, because that's the only place the city name seems to appear in data.
                 
                // if (data.summary) {
                //     var teleportSummary = data.summary;
                
                //     // remove all the commas from the summary
                //     var teleportSummaryNoCommas = teleportSummary.replaceAll(',', '');
                    
                //     // remove all the html p tags from the summary
                //     var teleportSummaryClean = teleportSummaryNoCommas.replaceAll('<p>', '');
                //     console.log(teleportSummaryClean);

                //     // pull the first word from the summary, which in most cases will be city name.
                //     // If se change .slice(0,1) to .slice(0,2), we can also get the state for US Cities, but this will break for European cities.
                //     var teleportUrbanArea = teleportSummaryClean.split(' ').slice(0,1).join(', ');
                //     console.log(teleportUrbanArea);

                //     // var y = x.split(' ').slice(0,2).join('+');

                //     //render the city name to the webpage
                //     nearestTPCity.textContent = teleportUrbanArea;
                // // }
                for (let i = 0; i < data.categories.length; i++) {
                    
                    if(data.categories[i].name == 'Cost of Living')
                        document.querySelector('#presentLoc_CostLiving').textContent = data.categories[i].score_out_of_10.toFixed(2);
                    if(data.categories[i].name == 'Safety')
                        document.querySelector('#presentLoc_Safety').textContent = data.categories[i].score_out_of_10.toFixed(2);
                    if(data.categories[i].name == 'Healthcare')
                        document.querySelector('#presentLoc_HealthCare').textContent = data.categories[i].score_out_of_10.toFixed(2);
                    if(data.categories[i].name == 'Economy')
                        document.querySelector('#presentLoc_Economy').textContent = data.categories[i].score_out_of_10.toFixed(2);
                    if(data.categories[i].name == 'Leisure & Culture')
                        document.querySelector('#presentLoc_LeisureCulture').textContent = data.categories[i].score_out_of_10.toFixed(2);
                }
                    document.querySelector('#presentLoc_OverallScore').textContent = data.teleport_city_score.toFixed(2);
            
                // Chose to use Shang's fore loop to populate website with this data instead of following six lines of script:

                // presentLoc_CostLivingTP.textContent = data.categories[1].score_out_of_10;
                // presentLoc_SafetyTP.textContent = data.categories[7].score_out_of_10;
                // presentLoc_HealthCareTP.textContent = data.categories[8].score_out_of_10;
                // presentLoc_EconomyTP.textContent = data.categories[11].score_out_of_10;
                // presentLoc_LeisureCultureTP.textContent = data.categories[14].score_out_of_10;
                // presentLoc_OverallScoreTP.textContent = data.teleport_city_score;
                
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

                // Render data for searched city to the webpage
                // // first have to parse data summary key to pull out name of city from text string
                // if (data.summary) {
                //     var teleportSummary_2 = data.summary;
                
                //     // remove all the commas from the summary
                //     var teleportSummaryNoCommas_2 = teleportSummary_2.replaceAll(',', '');
                    
                //     // remove all the html p tags from the summary
                //     var teleportSummaryClean_2 = teleportSummaryNoCommas_2.replaceAll('<p>', '');
                //     console.log(teleportSummaryClean_2);

                //     // pull the first word from the summary, which in most cases will be city name.
                //     var teleportUrbanArea_2 = teleportSummaryClean_2.split(' ').slice(0,1).join(', ');
                //     console.log(teleportUrbanArea_2);

                //     // var y = x.split(' ').slice(0,2).join('+');

                //     //render the city name to the webpage
                //     citySearched.textContent = teleportUrbanArea_2;
                // }

                for (let i = 0; i < data.categories.length; i++) {
                    
                    if(data.categories[i].name == 'Cost of Living')
                        document.querySelector('#citySearched_CostLiving').textContent = data.categories[i].score_out_of_10.toFixed(2);
                    if(data.categories[i].name == 'Safety')
                        document.querySelector('#citySearched_Safety').textContent = data.categories[i].score_out_of_10.toFixed(2);
                    if(data.categories[i].name == 'Healthcare')
                        document.querySelector('#citySearched_HealthCare').textContent = data.categories[i].score_out_of_10.toFixed(2);
                    if(data.categories[i].name == 'Economy')
                        document.querySelector('#citySearched_Economy').textContent = data.categories[i].score_out_of_10.toFixed(2);
                    if(data.categories[i].name == 'Leisure & Culture')
                        document.querySelector('#citySearched_LeisureCulture').textContent = data.categories[i].score_out_of_10.toFixed(2);
                }
                    document.querySelector('#citySearched_OverallScore').textContent = data.teleport_city_score.toFixed(2);

                // 
                if(!pageLoad){
                    var cookie_data = '', found = false, new_cookie_data = '';
                    if(getCookie('search-history')){
                        cookie_data = getCookie('search-history');
                        cookie_data = cookie_data.split(':');
                        for (var i = 0; i < cookie_data.length; i++) {
                            if(cookie_data[i] != ''){
                                var x = cookie_data[i].split('=');
                                if(x[0] == selectedCity){
                                    // found = true;
                                    // new_cookie_data += x[0] + '=' + data.teleport_city_score.toFixed(2) + ':';
                                }else{
                                    new_cookie_data += x[0] + '=' + x[1] + ':';
                                }
                            }
                        }
                    }
                    if(!found){
                        new_cookie_data += selectedCity + '=' + data.teleport_city_score.toFixed(2) + ':';
                    }
                    setCookie('search-history', new_cookie_data, 365);
                    setSearchHistory();
                }
                // Replaced following six lines of code with Shang's logic
                // citySearched_CostLivingTP.textContent = data.categories[1].score_out_of_10;
                // citySearched_SafetyTP.textContent = data.categories[7].score_out_of_10;
                // citySearched_HealthCareTP.textContent = data.categories[8].score_out_of_10;
                // citySearched_EconomyTP.textContent = data.categories[11].score_out_of_10;
                // citySearched_LeisureCultureTP.textContent = data.categories[14].score_out_of_10
                // citySearched_OverallScoreTP.textContent = data.teleport_city_score;

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
                console.log("urban areas data:  ", data);
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
        if(hrefCity != ''){
            pageLoad = false;
            selectedCity = city;
            citySearched.textContent = city;
            getSearchedUrbanAreaQualOfLifeScores(hrefCity);
        }
        
        }
    });
   
  }
// Materialize CSS event listener for autocomple list
document.addEventListener('DOMContentLoaded', autoCompleListofCities);

    
// // copy user input for city and state to javascript variables on click of submit button.
// var formSubmitHandler = function (event) {
//     event.preventDefault();
  
//     var citySearchName = citySearchEl.value.trim();
//     var stateSearchName = stateSearchEl.value.trim();

//     console.log(citySearchName);
//     console.log(stateSearchName);
  
//     if (citySearchName && stateSearchName) {
//     getCityGeonameID(citySearchName, stateSearchName);
  
// //     //   cityContainerEl.textContent = '';
// //       citySearchEl.value = '';
//     } else {
//       alert('Please enter a valid city and state');
//     }
//     };


//   userFormEl.addEventListener('submit', formSubmitHandler);

//   The following jQuery code is required for the Materialize drop down menu to work, per Materialize documnentation.
//   $('.dropdown-trigger').dropdown();


function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setSearchHistory(){
    document.getElementById('search-history').innerHTML = '';
    if(getCookie('search-history')){
        var cookie_data = getCookie('search-history'), html = '';
        cookie_data = cookie_data.split(':');
        for (var i = cookie_data.length - 1; i >= 0; i--) {
            if(cookie_data[i] != ''){
                var d = cookie_data[i].split('=');
                html += '<a href="javascript:void(0);" onclick="selectHistoryCity(\''+d[0]+'\');" class="collection-item"><span class="badge">'+d[1]+'/100</span>'+d[0]+'</a>';
            }
        }
        document.getElementById('search-history').innerHTML = html;
    }
}

setSearchHistory();

function selectHistoryCity(city){
    var hrefCity = '';
    for (var key in availTelCitiesHref) {
      if (availTelCitiesHref.hasOwnProperty(key))
        if(city == key)
            hrefCity = availTelCitiesHref[key];
    }
    // var hrefCity = availTelCitiesHref.city;
    // passing the city's url to function that will fetch quality of life scores.
    if(hrefCity != ''){
        pageLoad = false;
        selectedCity = city;
        citySearched.textContent = city;
        getSearchedUrbanAreaQualOfLifeScores(hrefCity);
    }
}
