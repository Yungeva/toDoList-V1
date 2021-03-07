const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js")
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

let day = date.getDate();
var items = ["Food", "Drinks", "Snacks"];
var workItems = [];

app.get("/", function(req, res) {




    res.render("list", { listTitle: day, toDoTasks: items });
})

app.post("/", function(req, res) {
    var item = req.body.newItem;
    if (req.body.list == "WorkDay Task") {
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }

})

app.get("/work", function(req, res) {
    var workTask = "WorkDay Task";
    res.render("list", { listTitle: workTask, toDoTasks: workItems });
})


app.listen(3000, function() {
    console.log("Server is live");
})