//Include
const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const expressSession = require('express-session');
const connectMongo = require('connect-mongo');
const methodOverride = require('method-override');
require('dotenv/config');

/* Helpers */
const pagination = require('./helpers/pagination').pagination;
const truncate = require('./helpers/truncate').truncate;
const limit = require('./helpers/limit').limit;
const generateDate = require('./helpers/generateDate').generateDate;



const port = process.env.PORT || 5678;


//Database connection
mongoose.connect(process.env.CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  dbName:'nodeblog'
}).then(()=>{
  console.log("Sucessful connection to DB");
}).catch((err)=>{
  console.log(err);
})


const MongoStore = connectMongo(expressSession);
//Express Session
app.use(expressSession({
  secret: process.env.SECRET,
  resave: false, // session cookie get reset for every request if true
  saveUninitialized: true, 
  store: new MongoStore({ 
    mongooseConnection: mongoose.connection 
  })
}));

//File Upload (Post Image)
app.use(fileUpload({
  safeFileNames: true
}));


//Static Files
app.use(express.static('public'));
//Method Override
app.use(methodOverride('_method'));

//Handlebars Helpers
/*const hbs = exphbs.create({
  helpers: {
    generateDate: generateDate,
    limit: limit,
    truncate: truncate,
    pagination: pagination
  }
});*/


app.engine('handlebars', exphbs({
  helpers:{
    generateDate: generateDate,
    limit: limit,
    truncate: truncate,
    pagination: pagination
  }
}));
app.set('view engine', 'handlebars');


// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))

// parse application/json
app.use(express.json());
//better alternative to use is express.json()

// Display Link Middleware
app.use((req, res, next) => {
  const { userId } = req.session;
  const { isAdmin } = req.session;

  if (userId && isAdmin) {
    res.locals = {
      displayLink: true,
      adminLink:true
    }
  }else if(userId && (isAdmin==0)){
    res.locals = {
      displayLink: true,
      adminLink:false
    }
  }
  else {
    res.locals = {
      displayLink: false
    }
  }
  next();
});

// Flash Message Middleware
app.use((req, res, next) => {
  res.locals.sessionFlash = req.session.sessionFlash;
  delete req.session.sessionFlash;
  next();
});


//Routes
const main = require('./routes/main');
const posts = require('./routes/posts');
const users = require('./routes/users');
const admin = require('./routes/admin/index');

app.use('/', main);
app.use('/posts', posts);
app.use('/users', users);
app.use('/admin', admin);


//Server Create
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})


