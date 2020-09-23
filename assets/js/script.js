//Hotel search button
var searchHotels = document.getElementById("hotel-search");
//airport dropdown div
var airportDropdown = document.getElementById("airport-dropdown")


var token = localStorage.getItem('travelAgencytoken');

const getToken = new Promise(function(resolve, reject) {
    fetch(
        "https://test.api.amadeus.com/v1/security/oauth2/token",
        {
          body: "grant_type=client_credentials&client_id=PCVlGqDA4hJdAz4RGUi4usxmWCKWy8CL&client_secret=Q455NxVgF8khrQyn",
          method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
        ).then(function (response){
            if (response.ok){
                // Check if amadeus return error
                response.json().then(function(response){
                newToken=response.access_token;
                localStorage.setItem('travelAgencytoken',newToken);
                // Return token
                resolve(newToken);
            })
            } else {
                // Return error line if something went wrong
                reject('Issue with getting Authentication');
            }
        }).catch(function(error){
            // Display connection error
        });
});



function searchAirport(hotelCity){
    query='?subType=AIRPORT&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=analytics.travelers.score&view=FULL&keyword=' +hotelCity;
    
    fetch('https://test.api.amadeus.com/v1/reference-data/locations'+query,
        {
            headers: {
                'Authorization': 'Bearer ' + token
            }
    }).then(function(response){
        if (response.ok) {
            // Check if amadeus return error
            response.json().then(function(response){
                // Shows API respond
                console.log(response);

                //console.log(response.data[0]);

                //create dropdown of airports
                var userSelectsAirport = document.createElement("p")
                userSelectsAirport.innerHTML = "Select the aiport you are arriving at: " 

                //create select tag
                var airportSelection = document.createElement("select")
                airportSelection.setAttribute("name", "airports")
                airportSelection.setAttribute("id", "select-airport")

                //append select tag and p tag to airport dropdown div
                airportDropdown.appendChild(userSelectsAirport);
                airportDropdown.appendChild(airportSelection);

                //loop through airport names array and display as options in dropdown
                for (i = 0; i < response.data.length; i++) {
                    var airports = document.createElement("option")
                    airports.setAttribute("value", response.data[i].name)
                    airports.innerHTML = response.data[i].name

                    //append <option> selections to <select> tag in html
                    airportSelection.appendChild(airports) 
                }

                function getSelectedText(){    
                    var getAirportDropdown = document.getElementById("select-airport");
                    var chosenAirport = getAirportDropdown.options[getAirportDropdown.selectedIndex].text;
                    console.log(chosenAirport);
                    return chosenAirport;
                    
                  }

                  getSelectedText();
                //search for recommended hotels
                //getRecommendedHotel(searchHotelData);
                
            })
          } else {
            //   Error responses
            response.json().then(function(error){
                // 400 -> bad request
                // 401 -> need to reauthorize 
                // 500 -> internal error
                // console.log(error);
                switch (error.errors[0].status) {
                    case 401:
                            // Authorize error, get a new token
                            getToken.then(function(response){
                            token = response;
                            localStorage.setItem("travelAgencytoken",response);
                            // Save new token, then recall the function
                            searchAirport(cityName);
                        }).catch(function(error){
                            // Report error to page using modal
                        })
                        break;
                    case 400:
                        // If conditioned the input fields correctly, this shouldn't be a problem
                    case 500:
                        // Show there's error with server through modal
                    default: 
                        console.log('Something went wrong with searching city'); // Uses modal later on
                }
            })
          }
    
    }).catch(function(error){
        // Display connection error
    });
}

function getRecommendedHotel(data){
    query='?radius=20&radiusUnit=MILE&amenities=&paymentPolicy=NONE&includeClosed=false&bestRateOnly=true&view=NONE&sort=NONE' 
    
    if (data.cityCode) query = query + '&cityCode=' + data.cityCode;
    if (data.checkInDate) query = query + '&checkInDate=' + data.checkInDate;
    if (data.checkOutDate) query = query + '&checkOutDate=' + data.checkOutDate;
    if (data.returnDate) query = query + '&returnDate=' + data.returnDate;
    if (data.roomQuantity) query = query + '&roomQuantity=' + data.roomQuantity;
    if (data.adults) query = query + '&adults=' + data.adults;
    if (data.childAges) query = query + '&childAges=' + data.childAges;
    if (data.currency) query = query + '&currency=' + data.currency;
   
    fetch('https://test.api.amadeus.com/v2/shopping/hotel-offers'+query,
        {
            headers: {
                'Authorization': 'Bearer ' + token
            }
    }).then(function(response){
        if (response.ok) {
            // Check if amadeus return error
            response.json().then(function(response){
                // Shows API respond
                console.log(response);
            })
          } else {
            //   Error responses
            response.json().then(function(error){
                // 400 -> bad request
                // 401 -> need to reauthorize 
                // 500 -> internal error
                // console.log(error);
                switch (error.errors[0].status) {
                    case 401:
                            // Authorize error, get a new token
                            getToken.then(function(response){
                            token = response;
                            localStorage.setItem("travelAgencytoken",response);
                            // Save new token, then recall the function
                            getRecommendedHotel(data);
                        }).catch(function(error){
                            // Report error to page using modal
                        })
                        break;
                    case 400:
                        // If conditioned the input fields correctly, this shouldn't be a problem
                    case 500:
                        // Show there's error with server through modal
                    default: 
                        console.log('Something went wrong with looking for hotels'); // Uses modal later on
                }
            })
          }
    }).catch(function(error){
        // Display connection error
    });
}

function getRecommendedFlight(data){
    query='?max=20' //return maximum number of search
    
    if (data.originLocationCode) query = query + '&originLocationCode=' + data.originLocationCode;
    if (data.destinationLocationCode) query = query + '&destinationLocationCode=' + data.destinationLocationCode;
    if (data.departureDate) query = query + '&departureDate=' + data.departureDate;
    if (data.returnDate) query = query + '&returnDate=' + data.returnDate;
    if (data.adults) query = query + '&adults=' + data.adults;
    if (data.children) query = query + '&children=' + data.children;
    if (data.infants) query = query + '&infants=' + data.infants;
    if (data.travelClass) query = query + '&travelClass=' + data.travelClass;
    if (data.nonStop) query = query + '&nonStop=' + data.nonStop;
    if (data.currencyCode) query = query + '&currencyCode=' + data.currencyCode;

    
    fetch('https://test.api.amadeus.com/v2/shopping/flight-offers'+query,
        {
            headers: {
                'Authorization': 'Bearer ' + token
            }
    }).then(function(response){
        if (response.ok) {
            // Check if amadeus return error
            response.json().then(function(response){
                // Shows API respond
                console.log(response);
            })
          } else {
            //   Error responses
            response.json().then(function(error){
                // 400 -> bad request
                // 401 -> need to reauthorize 
                // 500 -> internal error
                // console.log(error);
                switch (error.errors[0].status) {
                    case 401:
                            // Authorize error, get a new token
                            getToken.then(function(response){
                            token = response;
                            localStorage.setItem("travelAgencytoken",response);
                            // Save new token, then recall the function
                            getRecommendedFlight(data);
                        }).catch(function(error){
                            // Report error to page using modal
                        })
                        break;
                    case 400:
                        // If conditioned the input fields correctly, this shouldn't be a problem
                    case 500:
                        // Show there's error with server through modal
                    default: 
                        console.log('Something went wrong with looking for flights'); // Uses modal later on
                }
            })
          }
    }).catch(function(error){
        // Display connection error
    });
}

if (!token) {
    getToken.then(function(response){
        token = response;
        // Start functions
    }).catch(function(error){
        // Report error to page
    })
}



// Example Flight search:
var searchFlightData = {
    originLocationCode:'BOS',
    destinationLocationCode:'PAR',
    departureDate:'2020-10-01',
    returnDate:'',
    adults:2,
    children:0,
    infants:0,
    travelClass:'ECONOMY',
    nonStop:'false',
    currencyCode:'USD'
}
// getRecommendedFlight(searchFlightData);


//Function searching for Hotels
function hotelSearch () {

     
    //user's destination input
    var hotelCity = document.getElementById("destination").value

    //fetch airport code for hotel
    searchAirport(hotelCity);

    //start date
    var startDate = document.getElementById("hotel-starting-date").value

    //end date 
    var endDate = document.getElementById("hotel-ending-date").value

    //room number
    var roomNumber = document.getElementById("room-number").value

    //adults
    var adultNumber = document.getElementById("room-number").value

    //ages of children
    var childrenAges = document.getElementById("children-ages").value

    //Hotel search Variable
    var searchHotelData = {
    cityCode:'MCO',  // Use airport code here
    checkInDate : startDate,
    checkOutDate : endDate,
    roomQuantity : roomNumber,
    adults : adultNumber,
    childAges: childrenAges, //  comma seperated, user input
    currency : 'USD'
    }

    //store objects to local storage
    if (destination.length > 0 && 
        startDate.length > 0 &&
        endDate.length > 0) {
        var save = {
            endLocation: hotelCity,
            tripStart: startDate,
            tripEnd: endDate
        }
        var tripInfo = JSON.parse(localStorage.getItem("trips"))
        if (tripInfo != undefined) {
            tripInfo[tripInfo.length] = save
            localStorage.setItem("trips", JSON.stringify(tripInfo))
        }
        else {
            var tripInfo = [save]
            localStorage.setItem("trips", JSON.stringify(tripInfo))
        }
    }

    //if user doesn't enter a destination
    //if (hotelCity === "" || startDate === "" || endDate === "") {
        //console.log("ERROR");
    //}

    console.log(searchHotelData);


    //create container for hotel search results


    //loop through array to make boxes for each result option


}

searchHotels.addEventListener("click", function () {
    hotelSearch();
});

