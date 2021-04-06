const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require('mongoose');
const _ = require("lodash");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

mongoose.connect("mongodb+srv://admin-TimiYungEva:iamdbest12@cluster0.crp19.mongodb.net/todolistDB", { useNewUrlParser: true, useUnifiedTopology: true });

const itemSchema = new mongoose.Schema({
    name: String
})

const listSchema = new mongoose.Schema({
    name: String,
    tasks: [itemSchema]
})

const Item = mongoose.model("item", itemSchema);
const List = mongoose.model("list", listSchema);

const item1 = new Item({
    name: "This is a new item"
})
const item2 = new Item({
    name: "Hit the + button to add new items"
})
const item3 = new Item({
    name: "<-- Hit this to delete an item"
})


defaultItems = [item1, item2, item3];



app.get("/", function(req, res) {
    Item.find({}, function(err, items) {
        if (items.length === 0) {
            Item.insertMany(defaultItems, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Successfully added items");
                }
            })
            res.redirect("/");
        } else {
            res.render("list", { listTitle: "Today", toDoTasks: items });
        }
    })
})

app.post("/", function(req, res) {
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    })

    if (listName === "Today") {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({ name: listName }, function(err, foundList) {
            foundList.tasks.push(item);
            foundList.save();
            res.redirect("/" + listName);
        })
    }


})

app.post("/delete", function(req, res) {
    const checkedItem = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today") {
        Item.findByIdAndDelete(checkedItem, { useFindAndModify: false }, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("item successfully removed");
                res.redirect("/");
            }
        })
    } else {
        List.findOneAndUpdate({ name: listName }, { $pull: { tasks: { _id: checkedItem } } }, { useFindAndModify: false }, function(err, ) {
            if (!err) {
                console.log("Item deleted");
                res.redirect("/" + listName);
            }
        })
    }


})

app.get("/:customListPage", function(req, res) {
    const customListPage = _.capitalize(req.params.customListPage);

    List.findOne({ name: customListPage }, function(err, foundItem) {
        if (!err) {
            if (!foundItem) {
                const list = new List({
                    name: customListPage,
                    tasks: defaultItems
                });
                list.save();
                res.redirect("/" + customListPage);
            } else {
                res.render("list", { listTitle: foundItem.name, toDoTasks: foundItem.tasks })
            }
        }
    })

})

app.listen(3000, function() {
    console.log("Server is live");
})