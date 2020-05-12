const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/html_editor', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    // we're connected!
    console.log('----- open ------');
});

module.exports = db;
