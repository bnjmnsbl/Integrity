var express = require("express")
var app = express();
var mongo = require("mongodb").MongoClient;
var check = require("./urlCheck.js");
var mongoUrl = 'mongodb://localhost:27017/benDB'

var db;
var port = process.env.PORT;

app.use(express.static(__dirname + "/public"))
app.set("view engine", "ejs");


mongo.connect(mongoUrl, (err, database) => { 
    if(err) return console.log(err);
    db = database;
    app.listen(port, function() {
    console.log("Listening on port " + port);
})
})

app.get("/check/*", (req, res) => {
    var urlLong = req.originalUrl.substring(7);
    console.log("Got URL " + urlLong)
        
    // check if url exists in database
    db.collection("news").find({long: urlLong}).toArray(function(err,doc) {
        if (err) console.log(err);
        if (doc.length > 0){
            console.log("heyo " + doc[0].integrity);
            res.render("pages/index", {link: doc});
    } else {

        console.log("Not found");
        res.render("pages/error")
    }    
  });

});

app.get("/*", (req, res)=> {
    res.send("Home Page");
});
