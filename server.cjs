const express = require('express');
const cors = require('cors');
const users = require('./backend/user.api.cjs')

const app = express();

app.use(cors()); // Add this line to enable CORS support
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(users); 

app.get('/', function(req, res) {
    res.send("This is the FIRST GET request")
});

app.put('/', function(request, response) {
    response.send("This is a PUT request")
})

app.listen(8000, function() {
    console.log("Starting app now...")
})
