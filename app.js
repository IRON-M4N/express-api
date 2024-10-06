const express = require('express');
const path = require('path');
const axios = require('axios');
var app = express();
var PORT = process.env.PORT || 3000;

//MIDDLEWARES

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
  res.sendFile(path.join(__dirname, 'img', '1125x2436.jpg'));
});


//PIPE METHOD
app.get('/video', async (req, res) => {
  try {
    // This can be used for img, vid, aud, etc. etc.
    // To make a GET request to the direct link with response type stream
    var ress = await axios.get("https://cdn.ironman.my.id/i/didqb4.mp4", {
      responseType: 'stream', // Important shit to set it as stream
    });
    
    // Content type (explained in the route above)
    res.setHeader('Content-Type', 'video/mp4');

    // Pipe the video stream as response
    ress.data.pipe(res);
    
    // stream errror (completely optional)
    ress.data.on('error', (err) => {
      console.error('Stream error:', err);
      res.status(500).send('url fekd up');
    });
  } catch (error) {
    console.error('Request error:', error);
    res.status(500).send('Fekd up');
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
