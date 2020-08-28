import mongoose from 'mongoose'

const { Schema } = mongoose;

const pageSchema = new Schema({
    pid: String,
    title: String,
    desc: String,
    htmlTree: Object,
    iconfontUrl: String,
    iconList: Array,
    dirName: String,
    createTime: Number,
    updateTime: Number,
});

const PageModel = mongoose.model('page', pageSchema);

export default PageModel;
