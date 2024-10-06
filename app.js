const express = require('express');
const path = require('path');
const axios = require('axios');
const { pinterest, tiktok } = require('ironman-api');
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

//For parsing encoded urls
app.use(express.urlencoded({ extended: true })); 

//to format json respose instead of minify way
app.set('json spaces', 2);


//HOMEPAGE
//like root /home of the base url or the route for that
app.get('/home', (req, res) => {
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

//REDIRECT METHOD
app.get('/redirect', (req, res) => {
  //Redirect to the url
  //well you can set status code in this since its not that important I'll be skipping that (read docs if ur curious)
  res.redirect('https://ironman.my.id');
});

//SENDFILE
app.get('/download', (req, res) => {
  res.attachment('./img/1125x2436.jpg'); // to download it
  res.send('File download');
});

//well it is what the name says
app.get('/end', (req, res) => {
  res.end(); // Ends the response without any content 
});

////////////////////////////////
//SOME DL WITH MY NPM MIGHT WORK OR NOT 
// Pinterest dl
app.get('/pinterest', async (req, res) => {
  var { url } = req.query;
  if (!url) return res.status(400).json({ error: 'need url' });
  try {
    var data = await pinterest(url);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: 'Fekd up' });
  }
});

// TikTok dl 
app.get('/tiktok', async (req, res) => {
  var url = req.query.url;
  if (!url) return res.status(404).json({ error: 'need url' });
  try {
    var data = await tiktok(url);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'fekd up' });
  }
});

//i guess that's all make a PR or anything if there is anything i left
//there is also some method like 
//app.get('/link/*
//app.get('/link/:
//you can check the docs for this stuffs


//don't ask me to explain this, use ur brain 
app.listen(PORT, () => console.log(`Api running on PORT:${PORT}`));
