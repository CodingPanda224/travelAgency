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
      console.log(response)
})
  