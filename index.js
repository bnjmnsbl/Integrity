var express = require("express")
var app = express();
var bodyParser = require("body-parser")
var mongo = require("mongodb").MongoClient;
var check = require("./urlCheck.js");
var mongoUrl = 'mongodb://localhost:27017/benDB'

var db;
var port = process.env.PORT;

app.use(express.static(__dirname + "/public"))
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

mongo.connect(mongoUrl, (err, database) => { 
    if(err) return console.log(err);
    db = database;
    app.listen(port, function() {
    console.log("Listening on port " + port);
})
})

app.get("/check/*", (req, res) => {
    var urlLong = req.originalUrl.substring(7);
    urlLong = check.urlAdapt(urlLong);
    console.log("after adapt URL is " +urlLong)
   
    // check if url exists in database
    db.collection("news").find({long: urlLong}).toArray(function(err,doc) {
        if (err) console.log(err);
        if (doc.length > 0){
            res.render("pages/index", {link: doc});
        } else {

        console.log("Not found");
        res.render("pages/error")
    }    
  });

});

app.get("/form", (req, res)=> {
    res.render("pages/form");
});

app.post("/quotes", (req, res) => {
    db.collection("news").save(req.body, (err, result) => {
        if (err) return console.log(err)
        console.log("Saved to DB");
        res.redirect("/home");
})
});

app.get("/home", (req, res) => {
    res.send("Home Page");
})
