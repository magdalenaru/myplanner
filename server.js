var express = require("express");
var app = express();

 /* serves main page */
app.get("/", function(req, res) {
    res.sendFile(__dirname + '/index.html')
});

//http://localhost:5000/test
app.get("/test", function(req, res) { 
    setTimeout(function() {
        res.sendFile(__dirname + '/test.txt')
    }, 2000);
});

//http://localhost:5000/test-json
app.get("/test-json", function(req, res) { 
    setTimeout(function() {
        res.sendFile(__dirname + '/data.json')
    }, 1000);
});

/* serves all the static files */
app.get(/^(.[css|js|png|gif|jpeg|jpg|bmp])$/, function(req, res){ 
    res.sendFile( __dirname + req.params[0]); 
});

var port = process.env.PORT || 8000;
app.listen(port, function() {
    console.log("Listening on http://localhost:" + port);
});