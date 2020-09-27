//Flight Search button
var searchFlights = document.getElementById("flight-search");

//Hotel search button
var searchHotels = document.getElementById("hotel-search");
//airport dropdown div
var airportDropdown = document.getElementById("airport-dropdown")
var searchAirportCode = document.getElementById("destination-hotel")



// NavBar Usage
document.addEventListener('DOMContentLoaded', () => {

    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

    // Check if there are any navbar burgers
    if ($navbarBurgers.length > 0) {

        // Add a click event on each of them
        $navbarBurgers.forEach(el => {
            el.addEventListener('click', () => {

                // Get the target from the "data-target" attribute
                const target = el.dataset.target;
                const $target = document.getElementById(target);

                // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
                el.classList.toggle('is-active');
                $target.classList.toggle('is-active');

            });
        });
    }

});

function openPage(pageName, elmnt) {
    // Hide all elements with class="tabcontent" by default */
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Remove the background color of all tablinks/buttons
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
    }

    // Show the specific tab content
    document.getElementById(pageName).style.display = "block";

    // Add the specific color to the button used to open the tab content
    // elmnt.style.backgroundColor = color;
}
// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();

//Type of trip selector
var returnDateEl = document.getElementById('flight-return-date');
var inputTripEl = document.getElementById("oneway")

function typeCheck() {
    if (inputTripEl.checked === true)
        returnDateEl.classList.add('is-hidden');
    else
        returnDateEl.classList.remove('is-hidden');
}




//Hotel search button
var searchHotels = document.getElementById("hotel-search");
//airport dropdown div
var airportDropdown = document.getElementById("airport-dropdown")

var searchAirportCode = document.getElementById("destination-hotel")



//API promise
var token = localStorage.getItem('travelAgencytoken');

const getToken = new Promise(function (resolve, reject) {
    fetch(
        "https://test.api.amadeus.com/v1/security/oauth2/token", {
        body: "grant_type=client_credentials&client_id=PCVlGqDA4hJdAz4RGUi4usxmWCKWy8CL&client_secret=Q455NxVgF8khrQyn",
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    ).then(function (response) {
        if (response.ok) {
            // Check if amadeus return error
            response.json().then(function (response) {
                newToken = response.access_token;
                localStorage.setItem('travelAgencytoken', newToken);
                // Return token
                resolve(newToken);
            })
        } else {
            // Return error line if something went wrong
            reject('Issue with getting Authentication');
        }
    }).catch(function (error) {
        // Display connection error
    });
});



function searchAirport(hotelCity) {
    query = '?subType=AIRPORT&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=analytics.travelers.score&view=FULL&keyword=' + hotelCity;

    fetch('https://test.api.amadeus.com/v1/reference-data/locations' + query, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(function (response) {
        if (response.ok) {
            // Check if amadeus return error
            response.json().then(function (response) {
                // Shows API respond
                console.log(response);

                //if invalid value show error box that is coded in html

                airportDropdown.innerHTML = "";

                if (response.data.length === 0) {
                    //show error 
                } else {

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
                        airports.setAttribute("value", response.data[i].iataCode)
                        airports.innerHTML = response.data[i].name

                        //append <option> selections to <select> tag in html
                        airportSelection.appendChild(airports)
                    }
                } //end of else

                //airportSelection.addEventListener("change", getSelectedHotelValue)

            })
        } else {
            //   Error responses
            response.json().then(function (error) {
                // 400 -> bad request
                // 401 -> need to reauthorize 
                // 500 -> internal error
                // console.log(error);
                switch (error.errors[0].status) {
                    case 401:
                        // Authorize error, get a new token
                        getToken.then(function (response) {
                            token = response;
                            localStorage.setItem("travelAgencytoken", response);
                            // Save new token, then recall the function
                            searchAirport(hotelCity);
                        }).catch(function (error) {
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

    }).catch(function (error) {
        // Display connection error
    });
}

//function getSelectedHotelValue(){    

//console.log(chosenAirport);

//localStorage.setItem("airport city code", JSON.stringify(chosenAirport));

//return chosenAirport; 
//}

function getRecommendedHotel(hotelSearchData){
    query='?radius=20&radiusUnit=MILE&amenities=&paymentPolicy=NONE&includeClosed=false&bestRateOnly=true&view=NONE&sort=NONE' 
    
    if (hotelSearchData.cityCode) query = query + '&cityCode=' + hotelSearchData.cityCode;
    if (hotelSearchData.checkInDate) query = query + '&checkInDate=' + hotelSearchData.checkInDate;
    if (hotelSearchData.checkOutDate) query = query + '&checkOutDate=' + hotelSearchData.checkOutDate;
    if (hotelSearchData.returnDate) query = query + '&returnDate=' + hotelSearchData.returnDate;
    if (hotelSearchData.roomQuantity) query = query + '&roomQuantity=' + hotelSearchData.roomQuantity;
    if (hotelSearchData.adults) query = query + '&adults=' + hotelSearchData.adults;
    if (hotelSearchData.childAges) query = query + '&childAges=' + hotelSearchData.childAges;
    if (hotelSearchData.currency) query = query + '&currency=' + hotelSearchData.currency;
   
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

                //clear container
                $("#recommended-hotels").html("");

                //loop through response array
                for (var i = 0; i < response.data.length; i++) {
                    
                    //get data for one day
                    var hotelName = response.data[i].hotel.name;
                    var distance = response.data[i].hotel.hotelDistance.distance;
                    var checkIn = response.data[i].offers[0].checkInDate;
                    var checkOut = response.data[i].offers[0].checkInDate;
                    var guests = response.data[i].offers[0].guests.adults;
                    var price = response.data[i].offers[0].price.total;
                    
                

                    //create layout for contents of div
                    var divEl = $("<div>").html(
                        "<div class='column hotels' id='choose-hotel'> <h3>" + hotelName + "</h3><p>Distance from Airport: " + distance + 
                        "miles</p><p>Check-in Date: " + checkIn + "</p><p>Check-out Date: " + checkOut + "</p><p>Guests: " + guests +
                        "</p><h5 id='price'>Price: $" + price + "</h5></div>")

                    //divEl.addClass("column hotels");

                    console.log(divEl);
                    

                    //append element to the container
                    $("#recommended-hotels").append(divEl)

                     //add loading class to button
                    searchHotels.setAttribute("class", "button is-dark")

                    //hotel divs
                    var chooseHotel = document.getElementById("choose-hotel");
                    

                    function hotelPrice() {
                        var price = document.getElementById("price")
                        console.log(price.value)
                        //localStorage.setItem("budget trip", price.value)
                    }
                    
                    chooseHotel.addEventListener('click', function () {
                        hotelPrice();
                    })

                }
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
                            getRecommendedHotel(hotelSearchData);
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

function getRecommendedFlight(data) {
    query = '?max=20' //return maximum number of search

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


    fetch('https://test.api.amadeus.com/v2/shopping/flight-offers' + query, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(function (response) {
        if (response.ok) {
            // Check if amadeus return error
            response.json().then(function (response) {
                // Shows API respond
                console.log(response);
            })
        } else {
            //   Error responses
            response.json().then(function (error) {
                // 400 -> bad request
                // 401 -> need to reauthorize 
                // 500 -> internal error
                // console.log(error);
                switch (error.errors[0].status) {
                    case 401:
                        // Authorize error, get a new token
                        getToken.then(function (response) {
                            token = response;
                            localStorage.setItem("travelAgencytoken", response);
                            // Save new token, then recall the function
                            getRecommendedFlight(data);
                        }).catch(function (error) {
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
    }).catch(function (error) {
        // Display connection error
    });
}

if (!token) {
    getToken.then(function (response) {
        token = response;
        // Start functions
    }).catch(function (error) {
        // Report error to page
    })
}


// Example Flight search:
var searchFlightData = {
    originLocationCode: 'BOS',
    destinationLocationCode: 'PAR',
    departureDate: '2020-10-01',
    returnDate: '',
    adults: 2,
    children: 0,
    infants: 0,
    travelClass: 'ECONOMY',
    nonStop: 'false',
    currencyCode: 'USD'
}
// getRecommendedFlight(searchFlightData);


//Function searching for Hotels
function hotelSearch() {

    //user's destination input
    var hotelCity = document.getElementById("destination-hotel").value

    //fetch airport code for hotel
    searchAirport(hotelCity);

    var getAirportDropdown = document.getElementById("select-airport");
    var chosenAirport = getAirportDropdown.options[getAirportDropdown.selectedIndex].value;

    //user start date
    var startDate = document.getElementById("hotel-starting-date").value

    //user end date 
    var endDate = document.getElementById("hotel-ending-date").value

    //user room number
    var roomNumber = document.getElementById("room-number").value

    //user adults
    var adultNumber = document.getElementById("room-number").value

    //userages of children
    var childrenAges = document.getElementById("children-ages").value

    //Hotel search Variable
    var searchHotelData = {
        cityCode: chosenAirport,
        checkInDate: startDate,
        checkOutDate: endDate,
        roomQuantity: roomNumber,
        adults: adultNumber,
        childAges: childrenAges, //  comma seperated, user input
        currency: 'USD'
    }

    console.log(searchHotelData);

    //store objects to local storage
    if (hotelCity.length > 0 &&
        startDate.length > 0 &&
        endDate.length > 0 &&
        roomNumber.length > 0 &&
        adultNumber.length > 0) {
        var save = {
            endLocation: hotelCity,
            tripStart: startDate,
            tripEnd: endDate,
            rooms: roomNumber,
            adults: adultNumber,
            children: childrenAges
        }
        var hotelInfo = JSON.parse(localStorage.getItem("hotel stay"))
        if (hotelInfo != undefined) {
            hotelInfo[hotelInfo.length] = save
            localStorage.setItem("hotel stay", JSON.stringify(hotelInfo))
        } else {
            var hotelInfo = [save]
            localStorage.setItem("hotel stay", JSON.stringify(hotelInfo))
        }
    }

    //if user doesn't enter a destination
    //if (hotelCity === "" || startDate === "" || endDate === "") {
    //console.log("ERROR");
    //}

    //console.log(searchHotelData);

    //search for recommended hotels
    getRecommendedHotel(searchHotelData);

}

searchHotels.addEventListener("click", function () {
    //check if user enter required fields 

    //add loading class to button
    searchHotels.setAttribute("class", "button is-dark is-loading")

    //run hotelSearch()
    hotelSearch();

});

searchAirportCode.addEventListener("blur", function () {
    //have error check for required
    if (searchAirportCode.value) searchAirport(searchAirportCode.value);
})





var departureDropdown = document.getElementById('departure-airport-list')
var destinationDropdown = document.getElementById('destination-airport-list')

function searchAirportDeparture(departCity) {
    query = '?subType=AIRPORT&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=analytics.travelers.score&view=FULL&keyword=' + departCity;

    fetch('https://test.api.amadeus.com/v1/reference-data/locations' + query, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(function (response) {
        if (response.ok) {
            // Check if amadeus return error
            response.json().then(function (response) {
                // Shows API respond
                console.log(response);

                //if invalid value show error box that is coded in html

                departureDropdown.innerHTML = "";

                if (response.data.length === 0) {
                    //show error 
                } else {

                    //create dropdown of airports
                    var userSelectsAirport = document.createElement("p")
                    userSelectsAirport.innerHTML = "Select the aiport you will depart from: "

                    //create select tag
                    var airportSelection = document.createElement("select")
                    airportSelection.setAttribute("name", "airports")
                    airportSelection.setAttribute("id", "depart-airport")

                    //append select tag and p tag to airport dropdown div
                    departureDropdown.appendChild(userSelectsAirport);
                    departureDropdown.appendChild(airportSelection);

                    //loop through airport names array and display as options in dropdown
                    for (i = 0; i < response.data.length; i++) {
                        var airports = document.createElement("option")
                        airports.setAttribute("value", response.data[i].iataCode)
                        airports.innerHTML = response.data[i].name

                        //append <option> selections to <select> tag in html
                        airportSelection.appendChild(airports)
                    }
                } //end of else

                //airportSelection.addEventListener("change", getSelectedHotelValue)

            })
        } else {
            //   Error responses
            response.json().then(function (error) {
                // 400 -> bad request
                // 401 -> need to reauthorize 
                // 500 -> internal error
                // console.log(error);
                switch (error.errors[0].status) {
                    case 401:
                        // Authorize error, get a new token
                        getToken.then(function (response) {
                            token = response;
                            localStorage.setItem("travelAgencytoken", response);
                            // Save new token, then recall the function
                            searchAirport(cityName);
                        }).catch(function (error) {
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

    }).catch(function (error) {
        // Display connection error
    });
}

function searchAirportDestination(destinationCity) {
    query = '?subType=AIRPORT&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=analytics.travelers.score&view=FULL&keyword=' + destinationCity;

    fetch('https://test.api.amadeus.com/v1/reference-data/locations' + query, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(function (response) {
        if (response.ok) {
            // Check if amadeus return error
            response.json().then(function (response) {
                // Shows API respond
                console.log(response);

                //if invalid value show error box that is coded in html

                destinationDropdown.innerHTML = "";

                if (response.data.length === 0) {
                    //show error 
                } else {

                    //create dropdown of airports
                    var userSelectsAirport = document.createElement("p")
                    userSelectsAirport.innerHTML = "Select the aiport you will arrive to: "

                    //create select tag
                    var airportSelection = document.createElement("select")
                    airportSelection.setAttribute("name", "airports")
                    airportSelection.setAttribute("id", "destination-airport")

                    //append select tag and p tag to airport dropdown div
                    destinationDropdown.appendChild(userSelectsAirport);
                    destinationDropdown.appendChild(airportSelection);

                    //loop through airport names array and display as options in dropdown
                    for (i = 0; i < response.data.length; i++) {
                        var airports = document.createElement("option")
                        airports.setAttribute("value", response.data[i].iataCode)
                        airports.innerHTML = response.data[i].name

                        //append <option> selections to <select> tag in html
                        airportSelection.appendChild(airports)
                    }
                } //end of else

                //airportSelection.addEventListener("change", getSelectedHotelValue)

            })
        } else {
            //   Error responses
            response.json().then(function (error) {
                // 400 -> bad request
                // 401 -> need to reauthorize 
                // 500 -> internal error
                // console.log(error);
                switch (error.errors[0].status) {
                    case 401:
                        // Authorize error, get a new token
                        getToken.then(function (response) {
                            token = response;
                            localStorage.setItem("travelAgencytoken", response);
                            // Save new token, then recall the function
                            searchAirport(cityName);
                        }).catch(function (error) {
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

    }).catch(function (error) {
        // Display connection error
    });
}








function flightSearch() {

    //user's input: origin
    var originCity = document.getElementById("origin-airport").value

    //user's  input: destination
    var destinationCity = document.getElementById("destination-airport").value


    //user departure date
    var departDate = document.getElementById("depart-date").value

    //user return date 
    var returningDate = document.getElementById("return-date").value


    searchAirportDeparture(originCity)
    var getDepartureDropdown = document.getElementById('depart-airport')
    var originCityCode = getDepartureDropdown.options[getDepartureDropdown.selectedIndex].value;

    searchAirportDestination(destinationCity)
    var getDestinationDropdown = document.getElementById('destination-airport')
    var destinationCityCode = getDestinationDropdown.options[getDestinationDropdown.selectedIndex].value;







    var flightData = {
        originLocationCode: originCityCode,
        destinationLocationCode: destinationCityCode,
        departureDate: departDate,
        returnDate: returningDate,
        currencyCode: 'USD'
    }

    console.log(flightData);

    
}


searchFlights.addEventListener('click', function () {
    flightSearch();
})

