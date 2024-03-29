const express = require('express');
const path = require('path');
const mongoose = require('mongoose'); 
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const catchAsync = require('./utils/catchAsync');
const {eventSchema} = require('./schemas.js');
const {bookSchem} = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Event = require('./models/events');
const Bookreading = require('./models/bookreadings');

const userRoutes = require('./routes/users');
const eventRoutes = require('./routes/event');
const bookRoutes = require('./routes/bookreading');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');



main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/event');
    console.log("Mongoose Connection!!!")

};

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'secret!',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires: Date.now() + 1000*60*60*24,
        maxAge: 1000*60*60*24
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes);
app.use('/events', eventRoutes);
app.use('/bookreadings', bookRoutes);

app.get('/', (req, res) => {
    res.render('home')
    //res.send('Hi')
})





app.get('/login', (req, res) =>{
    res.render('login')
})

app.get('/readingroom',  (req, res) =>{
    res.render('readingroom')
})

app.get('/studyroom', (req, res) =>{
    res.render('studyroom')
})

app.get('/blog', (req, res) =>{
    res.render('blog')
})

app.all('*', (req, res, next) =>{
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) =>{
    const { statusCode=500} = err;
    if (!err.message) err.message ='Something Went Wrong!'
    res.status(statusCode).render('error', {err})
})
   

app.listen(3000, () => {
    console.log ('Listening');
})