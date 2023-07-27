
const Joi = require('joi');

module.exports.eventSchema = Joi.object({
    events:Joi.object({
        title: Joi.string().required(),
        eventimage: Joi.string().required(),
        date:Joi.string().required(),
        duration: Joi.string().required(),
        description: Joi.string().required(),
        zoomlink: Joi.string().required(),
        
    }).required()
});

module.exports.bookSchema = Joi.object({
    bookreadings:Joi.object({
        title: Joi.string().required(),
        bookimage: Joi.string().required(),
        date:Joi.string().required(),
        duration: Joi.string().required(),
        description: Joi.string().required(),
        link: Joi.string().required(),
        
    }).required()
})