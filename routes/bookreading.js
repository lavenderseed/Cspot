const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Bookreading = require('../models/bookreadings');

const {bookSchema} = require('../schemas.js');
const {isLoggedIn} = require('../middleware');

const validateBook = (req, res, next) =>{

    const {error} = bookSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
    
}


router.get('/', catchAsync(async (req, res) =>{
    const bookreadings = await Bookreading.find({});
   res.render('bookreadings/index', {bookreadings});
}));

router.get('/new', isLoggedIn,  (req, res) =>{
    res.render('bookreadings/new');
    
});



router.post('/', isLoggedIn, validateBook, catchAsync(async (req, res) =>{
    //if(!req.body.events) throw new ExpressError('invalid Events data!', 400)
    
    const bookreadings = new Bookreading (req.body.bookreadings);
    await bookreadings.save();
    req.flash('success', 'Successfully made a new book!')
    res.redirect(`/bookreadings/${bookreadings._id}`);
}));

router.get('/:id', isLoggedIn, catchAsync(async (req, res) =>{
    const bookreadings = await Bookreading.findById(req.params.id);
    if(!bookreadings){
        req.flash('error', 'Cannot find that book!');
        return res.redirect('/bookreadings');
    }
    res.render('bookreadings/show', {bookreadings});
}));

router.get('/:id/edit', catchAsync(async (req, res) =>{
    const bookreadings = await Bookreading.findById(req.params.id);
    if(!bookreadings){
        req.flash('error', 'Cannot find that book!');
        return res.redirect('/bookreadings');
    }
    res.render('bookreadings/edit', {bookreadings});
}));

router.put('/:id', validateBook, catchAsync(async(req, res) => {
    const {id} = req.params;
    const bookreading = await Bookreading.findByIdAndUpdate(id, {...req.body.bookreadings});
    req.flash('success', 'Successfuly updated book!')
    res.redirect(`/bookreadings/${bookreading._id}`);
}));

router.delete('/:id', catchAsync(async(req, res) => {
    const {id} = req.params;
    await Bookreading.findByIdAndDelete(id);
    req.flash('success', 'Successfuly delted book!')
    res.redirect('/bookreadings');
}));

module.exports = router;