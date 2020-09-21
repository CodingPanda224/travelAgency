token = localStorage.getItem('travelAgencytoken');

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

function searchAirport(cityName){
    query='?subType=CITY&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=analytics.travelers.score&view=FULL&keyword=' +cityName;
    
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
                            getRecommendedFlight();
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
                            getRecommendedFlight();
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

lat = 51.5;
long = -0.16666;

if (!token) {
    getToken.then(function(response){
        token = response;
        // Start functions
    }).catch(function(error){
        // Report error to page
    })
}

searchAirport('London');

// getRecommendedFlight(searchFlightData);



