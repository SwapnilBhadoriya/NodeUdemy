const path = require("path");
const express = require("express");
const hbs = require("hbs");

const app = express();

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "../templates/views"));
app.use(express.static(path.join(__dirname + "/../public")));
hbs.registerPartials(path.join(__dirname, "../templates/partials"));
app.get("", (req, res) => {
  res.render("index", { title: "Weather App" });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About Me" });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    errorMessage: "Page Not Found",
  });
});
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
