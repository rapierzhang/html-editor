const mongoose = require('mongoose');

const { Schema } = mongoose;

const componentSchema = new Schema({
    pid: String,
    title: String,
    desc: String,
    htmlTree: Object,
    iconfontUrl: String,
    iconList: Array,
    createTime: Number,
    updateTime: Number,
});

const ComponentModel = mongoose.model('component', componentSchema);

export default ComponentModel;
