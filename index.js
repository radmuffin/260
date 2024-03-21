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

// Trust headers that are forwarded from the proxy so we can determine IP addresses
app.set('trust proxy', true);

// Router for service endpoints
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

// Register a new user
apiRouter.post('/auth/create', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const user = await DB.getUser(username);
  if (user) {
    res.status(409).send({ msg: 'User already exists'});
    return;
  }

  const newUser = await DB.createUser(username, password);
  setAuthCookie(res, newUser.token);
  res.status(200).json({ username : newUser.username});
});

// Get authToken for provided username and password
apiRouter.post('/auth/login', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const user = await DB.getUser(username);
  if (!user) {
    res.status(401).send({ msg: 'Invalid username'});
    return;
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    res.status(401).send({ msg: 'Invalid username or password'});
    return;
  }

  setAuthCookie(res, user.token);
  res.status(200).json({ username: user.username });
});

// Logout the user by clearing the auth token
apiRouter.delete('/auth/logout', (_req, res) => {
  res.clearCookie(authCookieName);
  res.status(200).end();
});

// returns info about a user
apiRouter.get('/user/:username', async (req, res) => {
  const user = await DB.getUser(req.params.username);
  if (!user) {
    res.status(404).send({ msg: 'User not found'});
    return;
  }
  const token = req?.cookies.token;
  res.send({ username: user.username, authenticated: token === user.token });
});

// secureApiRouter verifies credentials for endpoints
var secureApiRouter = express.Router();
apiRouter.use(secureApiRouter);

secureApiRouter.use(async (req, res, next) => {
  authToken = req.cookies[authCookieName];
  const user = await DB.getUserByToken(authToken);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

// Save story/update to the server
secureApiRouter.post('/story', async (req, res) => {
  const story = req.body;
  await DB.updateStory(story);
  res.status(200).send('Story saved successfully');
});

// Get all stories from the server 
secureApiRouter.get('/stories', async (req, res) => {
  const stories = await DB.getStories();
  res.status(200).json(stories);
});

// Default error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// let stories = [];
// function updateStories(story) { 
//   for (let i = 0; i < stories.length; i++) {
//     if (stories[i].title === story.title) {
//       stories[i] = story;
//       return;
//     }
//   }
//   stories.push(story);
// }