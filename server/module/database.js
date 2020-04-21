const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/html_editor');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log('----- open ------')
});

module.exports = db;

