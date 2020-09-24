//Flight Search button
var searchFlights = document.getElementById("flight-search");
//Hotel search button
var searchHotels = document.getElementById("hotel-search");
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


// 
function searchAirport(cityName){
    query='?subType=AIRPORT&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=analytics.travelers.score&view=FULL&keyword=' +cityName;
    
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

// NavBar Usage
document.addEventListener('DOMContentLoaded', () => {

    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
  
    // Check if there are any navbar burgers
    if ($navbarBurgers.length > 0) {
  
      // Add a click event on each of them
      $navbarBurgers.forEach( el => {
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
//Function searching for Hotels
function hotelSearch () {
    //console.log("hello")

    //grab user's origin input
    var origin = document.getElementById("origin").value

    //grab user's destination input
    var destination = document.getElementById("destination").value

    //grab start date
    var startDate = document.getElementById("starting-date").value

    //grab end date 
    var endDate = document.getElementById("ending-date").value

    //store objects to local storage
    if (destination.length > 0 && 
        origin.length > 0 &&
        startDate.length > 0 &&
        endDate.length > 0) {
        var save = {
            endLocation: destination,
            startingLocation: origin,
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
    if (destination === "" || origin === "" || startDate === "" || endDate === "") {
        console.log("ERROR");
    }

    //fetch hotel information
    

    //create container for hotel search results


    //loop through array to make boxes for each result option


}

searchHotels.addEventListener("click", function () {
    hotelSearch();
});

if (!token) {
    getToken.then(function(response){
        token = response;
        // Start functions
    }).catch(function(error){
        // Report error to page
    })
}

// searchAirport('London');

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


// Example of Hotel search
var searchHotelData = {
    cityCode:'MCO',  // Use airport code here
    checkInDate : '2020-10-05',
    checkOutDate : '2020-10-08',
    roomQuantity : 1,
    adults : 2,
    childAges: '14, 12', //  comma seperated, user input
    currency : 'USD'
}

// getRecommendedHotel(searchHotelData);

