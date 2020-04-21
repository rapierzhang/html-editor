const mongoose = require('mongoose');

const { Schema } = mongoose;

const pageSchema = new Schema({
    id: String,
    title: String,
    desc: String,
    htmlTree: Object,
    createTime: String,
    updateTime: String,
});

const PageModel = mongoose.model('page', pageSchema)

module.exports = PageModel;
