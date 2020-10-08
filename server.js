'use strict';

var express     = require('express');
var bodyParser  = require('body-parser');
var expect      = require('chai').expect;
var cors        = require('cors');

var apiRoutes         = require('./routes/api.js');
var fccTestingRoutes  = require('./routes/fcctesting.js');
var runner            = require('./test-runner');
var connectionURL='mongodb+srv://jordyf:jordyf123@cluster0.xft5y.mongodb.net/<dbname>?retryWrites=true&w=majority';
var mongoose=require('mongoose');
var helmet=require('helmet');
mongoose.connect(connectionURL,({useUnifiedTopology: true, useNewUrlParser: true}))
.then(()=>{
console.log("Connected to Database");
  var app = express();

  app.use('/public', express.static(process.cwd() + '/public'));
  app.use(helmet());
  app.use(cors({origin: '*'})); //For FCC testing purposes only
  
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  
  //Sample front-end
  app.route('/b/:board/')
    .get(function (req, res) {
      res.sendFile(process.cwd() + '/views/board.html');
    });
  app.route('/b/:board/:threadid')
    .get(function (req, res) {
      res.sendFile(process.cwd() + '/views/thread.html');
    });
  app.route('/boardList')
  .get((req,res)=>{
    res.sendFile(process.cwd()+'/views/boardList.html');
  })
  
  //Index page (static HTML)
  app.route('/')
    .get(function (req, res) {
      res.sendFile(process.cwd() + '/views/index.html');
    });
  
  //For FCC testing purposes
  fccTestingRoutes(app);
  
  //Routing for API 
  apiRoutes(app);
  
  //Sample Front-end
  
      
  //404 Not Found Middleware
  app.use(function(req, res, next) {
    res.status(404)
      .type('text')
      .send('Not Found');
  });
  
  //Start our server and tests!
  app.listen(process.env.PORT || 3000, function () {
    console.log("Listening on port " + process.env.PORT);
    //uncomment below to run test
    // process.env.NODE_ENV='test'; 
    if(process.env.NODE_ENV==='test') {
      console.log('Running Tests...');
      setTimeout(function () {
        try {
          runner.run();
        } catch(e) {
          var error = e;
            console.log('Tests are not valid:');
            console.log(error);
        }
      }, 1500);
    }
  });
  
  module.exports = app; //for testing  
})
.catch((err)=>{
  console.log('Failed to Connect to Database',err);
})