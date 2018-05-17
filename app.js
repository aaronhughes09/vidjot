const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const app = express();

//Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/database');

//Map global promise - get rid of warning
mongoose.Promise = global.Promise;

//Connect to Mongoose
mongoose.connect(db.mongoURI, {
  useMongoClient: true
})
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));

//Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser middleware - taken from express body-parser site (github)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Method-override middleware - taken from express method-override site
app.use(methodOverride('_method'));

//express session middleware - same as above (github)
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash middleware
app.use(flash());

//Global variables middleware
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});


//Index route
app.get('/', (req, res) => {
  const title = 'Welcome';
  res.render('index', {
    title: title });
});

//About route
app.get('/about', (req, res) => {
  res.render('about');
});

//User routes
app.use('/ideas', ideas);
app.use('/users', users);


const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});