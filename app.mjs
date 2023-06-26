import express from "express";
const app = express();
import bodyParser from "body-parser";
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))
import mongoose from "mongoose";
import _ from "lodash"

import { fileURLToPath } from 'url';
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


mongoose.connect("mongodb+srv://gaminngpulkit:easy123@todolist.1vrd6ac.mongodb.net/todoListDB")
const itemSchema = ({
    name: String
})
const Item = mongoose.model("Item", itemSchema)

const item1 = new Item({
    name: "Welcome to your todoList"
})
const item2 = new Item({
    name: "Hit the + button to add some new item"
})
const item3 = new Item({
    name: "Hit this to delete an item"
})
const defaultItems = [item1, item2, item3]

const listSchema = ({
    name: String,
    items: [itemSchema]
})

const List = mongoose.model("List", listSchema)

app.set('view engine', 'ejs');

app.get("/", function (req, res) {
    Item.find()

        .then(function (items) {
            if (items.length === 0) {
                Item.insertMany(defaultItems)
                    .then(function () {
                        console.log("Successfully Add Items ")
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
                res.redirect("/")

            } else {
                res.render("list", { listTitle: "Today", newListItems: items });
            }

        })
        .catch(function (err) {
            console.log(err)
        })
})

app.get("/:customListName", function (req, res) {
    const customListName = _.capitalize(req.params.customListName)
    List.findOne({ name: customListName })
        .then(function (foundOne) {
            if (!foundOne) {
                // Create a new List
                const list = new List({
                    name: customListName,
                    items: defaultItems
                })
                list.save()
                res.redirect("/" + customListName)
            }
            else {
                // shwo an existing List
                res.render("list", { listTitle: customListName, newListItems: foundOne.items })
            }
        })
        .catch(function (err) {
            console.log(err)
        })


})

app.post("/", function (req, res) {
    let itemName = req.body.newItem;
    const listName = req.body.list
    const item = new Item({
        name: itemName
    })
    if (listName === "Today") {
        item.save()
        res.redirect("/")
    } else {
        List.findOne({ name: listName })
            .then(function (foundList) {
                foundList.items.push(item)
                foundList.save()
                res.redirect("/" + listName)
            })
    }
})

app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox
    const listName = req.body.listName
    if (listName === "Today") {
        Item.findByIdAndRemove(checkedItemId)
            .then(function () {
                console.log("Successfully Remove  Items from checklist ")
            })
            .catch(function (err) {
                console.log(err)
            })
        res.redirect("/")
    } else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } })
            .then(function (foundList) {
                res.redirect("/" + listName)
            })
            .catch(function (err) {
                console.log(err)
            })

    }


})

app.post("/work", function (req, res) {
    let item = request.body.newItem;
    workItems.push(item);
    res.redirect("/work")
})


app.listen(3000, function () {
    console.log("Server started on port 3000")
})


// wdadawd wad awdawwdvawafdvjahvdjawvdj vdjvjh j