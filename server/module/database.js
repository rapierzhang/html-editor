const mongoose = require('mongoose');
const config = require('../config/mongo.config');

const { domain, database } = config;

mongoose.connect(`mongodb://${domain}/${database}`, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    // we're connected!
    console.log('----- open ------');
});

module.exports = db;
