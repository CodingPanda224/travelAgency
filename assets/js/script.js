var  token = localStorage.getItem("travelAgencytoken");

//Hotel search button
var searchHotels = document.getElementById("hotel-search");

function getToken(){
    // Called whenether needed to renew token or get one
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
        return response.json()
        } )
        .then(function (response){
            token=response.access_token;
            localStorage.setItem('travelAgencytoken',token);
    })
}

function getRecommendedFlight(tries){
    query='?originLocationCode=BOS&destinationLocationCode=PAR&departureDate=2020-10-01&adults=1&travelClass=ECONOMY&nonStop=false&currencyCode=USD&maxPrice=500&max=20'
    // Start query at '?', then add more fields as user input. It can not be a '' string

    // Example of fields:
    // originLocationCode='BOS';
    // destinationLocationCode='PAR';
    // departureDate='2020-10-01';
    // returnDate='';
    // adults=1;
    // etc.
    fetch('https://test.api.amadeus.com/v2/shopping/flight-offers'+query,
        {
            headers: {
                'Authorization': 'Bearer ' + token
            }
    }).then(function(response){
        if (response.ok) {
            response.json().then(function(response){
                // Shows API respond
                console.log(response);
            })
          } else {
            //   Error response
            response.json().then(function(error){
                // 400 -> bad request
                // 401 -> need to reauthorize 
                // 500 -> internal error
                // console.log(error);
                switch (error.errors[0].status) {
                    case 401:
                        // Authorize error, recursive call
                        getToken();
                        setTimeout(function(){
                            if (tries<3) getRecommendedFlight(tries+1);
                            // Try 3 times before exiting, a safe case for recursive
                            else console.log('Something went wrong'); // Uses modal later on
                        },1000)
                        // Wait 1s before retrying the API call
                        break;
                    case 400:
                        // If conditioned the input fields correctly, this shouldn't be a problem
                    case 500:
                        // Show there's error with server through modal
                    default: 
                        console.log('Something went wrong'); // Uses modal later on
                }
            })
          }
    });
}

getRecommendedFlight(0); // 0 is important, to keep track of # of tries for authentication
// Can also parse in Object with all of the input fields








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

