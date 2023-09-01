const { geocode, forecast } = require("./utils");

const address = process.argv[2];
geocode(address, (error, data) => {
  if (error) {
    console.log(error);
  } else {
    forecast(data, (error, foreCastdata) => {
      if (error) {
        console.log(error);
      } else {
        console.log(data.location);
        console.log(foreCastdata);
      }
    });
  }
});
