const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
    title: String,
    eventimage: String,    
    date: String,
    duration: String,
    description: String,
    zoomlink: String,
    
    
    
});

module.exports = mongoose.model('Event', EventSchema);