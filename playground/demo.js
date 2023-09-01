const fs = require("fs");

const data = fs.readFileSync("demojson.json").toString();
const dataObj = JSON.parse(data);

console.log(dataObj);
