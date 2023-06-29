const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
    title: String,    
    date: String,
    duration: String,
    description: String
    
});

module.exports = mongoose.model('Event', EventSchema);