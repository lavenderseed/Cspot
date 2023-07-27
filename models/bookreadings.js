const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    title: String,
    bookimage: String,    
    date: String,
    duration: String,
    description: String,
    link: String,
    
    
    
});

module.exports = mongoose.model('Bookreading', BookSchema);