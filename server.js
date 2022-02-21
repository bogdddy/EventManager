const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

require('dotenv').config()

const initializePassport = require('./middlewares/passport-config');
initializePassport(passport)

const indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var eventsRouter = require('./routes/events');
const usersRouter = require('./routes/users');
const commentsRouter = require('./routes/comments');
const reservationsRouter = require('./routes/reservations');
const enclosuresRouter = require('./routes/enclosures');

const { Passport } = require('passport');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use((req, res, next) => {
  res.locals.user = req.user || null,
  res.locals.info = null,
  res.locals.error = null,
  next()
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('ddd'));
app.use(express.static(path.join(__dirname, 'public')));

// session
app.use(flash())
app.use(session({
  secret: process.env.SECRET_TOKEN,
  resave: false,
  saveUninitialized: false,
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

// include routes
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/events', eventsRouter);
app.use('/users', usersRouter);
app.use('/comments', commentsRouter);
app.use('/reservations', reservationsRouter);
app.use('/enclosures', enclosuresRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // next(createError(404));
  res.render('fourofour');
    return;
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// app port
app.listen(3000, () =>{ console.log("server running on http://localhost:3000/") })

module.exports = app;
