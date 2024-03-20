const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const DB = require('./database.js');

const authCookieName = 'token';

// The service port. In production the frontend code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Use the cookie parser middleware for tracking authentication tokens
app.use(cookieParser());

// Serve up the frontend static content hosting
app.use(express.static('public'));

// Router for service endpoints
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

// Save story/update to the server
apiRouter.post('/story', (req, res) => {
  updateStories(req.body);
  res.status(200).send('Story saved successfully');
});

// Get all stories from the server
apiRouter.get('/stories', (_req, res) => {
  res.status(200).json(stories);
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

let stories = [];
function updateStories(story) { 
  for (let i = 0; i < stories.length; i++) {
    if (stories[i].title === story.title) {
      stories[i] = story;
      return;
    }
  }
  stories.push(story);
}