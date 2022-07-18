const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const startingData = require(__dirname + "/quotes.json");
const random = require("mongoose-simple-random");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/quotesDB");

var quotesSchema = new mongoose.Schema({
    quoteText: String,
    quoteAuthor: String
});

quotesSchema.plugin(random);



const Quote = mongoose.model("quote", quotesSchema);

app.get("/", function(req, res) {
    Quote.findOneRandom(function(err,q){
        if(err){
            console.log(err);
            Quote.insertMany(startingData, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect("/");
                }
            });
        } else {
            res.render("index", {title: "icanhazquotes", quote: q});
        }
    });

    // Quote.findOne({}, function (err, quote) {
    //     if (err) {
    //         console.log(err);
    //     } else if (quote === null) {
    //         Quote.insertMany(startingData, function (err) {
    //             if (err) {
    //                 console.log(err);
    //             } else {
    //                 res.redirect("/");
    //             }
    //         });
    //     } else {
    //         res.render("index", {title: "icanhazquotes", quote: quote});
    //     }
    // });
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});