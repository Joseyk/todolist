const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const date = require(__dirname + "/date.js");
const items = ["food", "movie", "sport"];
const workItems = [];
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/", function (req, res) {
  const day = date.getDate();
  res.render("list", { title: day, items: items });
});
app.post("/", function (req, res) {
  const item = req.body.newItem;
  if (req.body.list === "work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});
app.get("/work", function (req, res) {
  res.render("list", { title: "work list", items: workItems });
});
app.get("/about", function (req, res) {
  res.render("about");
});
app.listen(5000, function () {
  console.log("server is running on port 5000");
});
