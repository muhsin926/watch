let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let hbs = require('express-handlebars');
let fileUpload = require('express-fileupload');
let db = require('./config/connection')
let session = require('express-session');

let usersRouter = require('./routes/users');
let adminRouter = require('./routes/admin');

let app = express();



app.use( (req,res,next) =>{
  res.header('Cache-Control','private ,no-cache, no-store, must-revalidate')
  next()
})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/', partialsDir: __dirname + '/views/partials/' }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
app.use(session({secret:"key",resave:false,saveUninitialized:true,cookie:{maxAge:120000}}));

db.connect((err) => {
  if (err) console.log("Connection error" + err);
  else console.log("Database connected");
}
);

app.use('/', usersRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
