/* eslint no-console: 0 */
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.config.js');
const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;
const app = express();

if (isDeveloping) {
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  app.get('*', function response(req, res) {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
    res.end();
  });
} else {
  app.use(express.static(__dirname + '/dist'));
  app.get('*', function response(req, res) {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });
}

//Connect socket io
const http = require('http').Server(app);
const io = require('socket.io')(http);

let usersAndMessages = {
  users: [],
  messages: [],
  typingUsers: {},
  currentUser: ''
};
let names = {};
let count = 0;

function createUsername() {
  let thisUsername = 'User #' + count;
  if(!names[thisUsername]) {
    names[thisUsername] = true;
    count++;
  }
  return thisUsername;
}

io.on('connection', (socket) => {
  //Create the person's username
  let thisPersonName = createUsername();
  //Set currentUser to the just created username
  usersAndMessages.currentUser = thisPersonName;
  //Make sure socket listeners are attached before calling the callback below
  socket.on('mounted', (str) => {
    console.log(str);
    //Send data to new user
    socket.emit('getUsersAndMessages', usersAndMessages);

    //Tell connections that new user entered
    io.emit('userEntered', thisPersonName);
    usersAndMessages.users.push(thisPersonName);


    socket.on('disconnect', () => {
      //Tell connections that user left
      io.emit('userLeft', thisPersonName);
      usersAndMessages.users = usersAndMessages.users.filter((user) => {
        return user !== thisPersonName;
      });
    });
  });

  //Get message from socket and send it to all other connections
  socket.on('sendMessage', (messageObj) => {
    usersAndMessages.messages.push(messageObj);
    io.emit('receiveMessage', messageObj)
  });

  //Get user whos typing and sent it to all other connections
  socket.on('addTypingUser', (name) => {
    usersAndMessages.typingUsers[name] = true;
    io.emit('addNewUserTyping', name);
  });
  //Get user who stopped typing and sent it to all other connections
  socket.on('removeTypingUser', (name) => {
    delete usersAndMessages.typingUsers[name];
    io.emit('removeNewUserStopTyping', name);
  });

});

http.listen(3000, () => {
  console.log('listening on localhost 3000');
});








