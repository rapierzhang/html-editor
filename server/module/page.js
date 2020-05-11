const mongoose = require('mongoose');

const { Schema } = mongoose;

const pageSchema = new Schema({
    pid: String,
    index: Number,
    title: String,
    desc: String,
    preview: String,
    htmlTree: Object,
    createTime: Number,
    updateTime: Number,
});

const PageModel = mongoose.model('page', pageSchema);

module.exports = PageModel;
