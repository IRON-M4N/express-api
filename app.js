const express = require('express');
const path = require('path');
var app = express();
var PORT = process.env.PORT || 3000;

//middlewares

//for parsing incoming data body request without that express cant understand body request aka post requests
app.use(express.json()); 

//if you have a html,css,js .etc in a folder then
//it'll look for a index.html in the static dir and serve that
//now it serves the html in /site endpoint 
app.use('/site', express.static('static')); 
//you can use "app.use(express.static('public'));" if you want the html to show in the root endpoint 

//HOMEPAGE like root / of the base url the route for that
app.get('/', (req, res) => {
  res.send('Konnichiwa!'); //to send text
//res.json({ msg: "Konnichiwa!" }); to send a json as response
  
});

//POST REQ
app.post('/data', (req, res) => {
  //you'll typically send data in a json body for post that's how to access that.
  var { name, age } = req.body; //like this.. 
  res.send(`Name: ${name}, Age: ${age}`); //to return what we got
});

//STREAM IMAGE/VIDEO/ANY
app.get('/image', (req, res) => {
  //headers to stream image inline witj filename
  res.setHeader('Content-Type', 'image/jpeg'); //mimetype of file
  res.setHeader('Content-Disposition', 'inline; filename="furina.jpg"');
//to send via path 
  res.sendFile(path.join(__dirname, 'img', 'furina.jpg'));
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
