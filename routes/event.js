const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Event = require('../models/events');

const {eventSchema} = require('../schemas.js');
const {isLoggedIn} = require('../middleware');

const validateEvent = (req, res, next) =>{

    const {error} = eventSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
    
}


router.get('/', catchAsync(async (req, res) =>{
    const events = await Event.find({});
   res.render('events/index', {events});
}));

router.get('/new', isLoggedIn,  (req, res) =>{
    res.render('events/new');
});

router.post('/', isLoggedIn, validateEvent, catchAsync(async (req, res) =>{
    //if(!req.body.events) throw new ExpressError('invalid Events data!', 400)
    
    const events = new Event (req.body.events);
    await events.save();
    req.flash('success', 'Successfully made a new event!')
    res.redirect(`/events/${events._id}`);
}));

router.get('/:id', isLoggedIn, catchAsync(async (req, res) =>{
    const events = await Event.findById(req.params.id);
    if(!events){
        req.flash('error', 'Cannot find that event!');
        return res.redirect('/events');
    }
    res.render('events/show', {events});
}));

router.get('/:id/edit', catchAsync(async (req, res) =>{
    const events = await Event.findById(req.params.id);
    if(!events){
        req.flash('error', 'Cannot find that event!');
        return res.redirect('/events');
    }
    res.render('events/edit', {events});    
    
}));

router.put('/:id', validateEvent, catchAsync(async(req, res) => {
    const {id} = req.params;
    const event = await Event.findByIdAndUpdate(id, {...req.body.events});
    req.flash('success', 'Successfuly updated event!')
    res.redirect(`/events/${event._id}`);
}));

router.delete('/:id', catchAsync(async(req, res) => {
    const {id} = req.params;
    await Event.findByIdAndDelete(id);
    req.flash('success', 'Successfuly delted event!')
    res.redirect('/events');
}));

module.exports = router;
