const request = require("request");

const geocode = function (address, callback) {
  if (!address) {
    console.log("Please provide a valid address .");
    return;
  }
  const geoUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    address
  )}.json?access_token=pk.eyJ1IjoiZmFmYXNmIiwiYSI6ImNsbG44eWQwZzJydXozaG8zd2hhM3RmM2IifQ.s8-8ACjEXLAgcjAjJhX0mw&limit=1`;

  request({ url: geoUrl, json: true }, (error, response) => {
    if (error) {
      callback("Unable to connect to the location services .", undefined);
    } else if (response.body.features.length === 0) {
      callback("No matching results for the search query .", undefined);
    } else {
      callback(undefined, {
        longitude: response.body.features[0].center[0],
        latitude: response.body.features[0].center[1],
        location: response.body.features[0].place_name,
      });
    }
  });
};

const forecast = function ({ longitude, latitude }, callback) {
  const url = `http://api.weatherstack.com/current?access_key=0e52a2b4ef1285e068c07b129151e8c3&query=${latitude},${longitude}`;
  request({ url, json: true }, (error, response) => {
    if (error) {
      callback("Unable to connect to the weather services .", undefined);
      return;
    } else if (response.body.error) {
      callback("Unable to find the location .", undefined);
      return;
    }

    const { temperature, feelslike } = response.body.current;
    callback(
      undefined,
      `It is currently ${temperature} degrees out but it feels like ${feelslike} degrees out `
    );
  });
};

module.exports = { geocode, forecast };
