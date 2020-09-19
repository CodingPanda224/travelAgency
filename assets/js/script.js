var  token = localStorage.getItem("travelAgencytoken");

const getToken = new Promise(function(resolve, reject) {
    // Called whenether needed to renew token or get one, 
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

function getRecommendedFlight(){
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
                        console.log('Something went wrong'); // Uses modal later on
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

getRecommendedFlight();
