token = 'tmks9Nb2Gt1bheWXgCRGGerFWjiN'; //Load respond with local memory

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
            token=response.access_token; //And then save to local memory
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

getRecommendedFlight(0); //0 is important, to keep track of # of tries
// Can also parse in Object with all of the input fields