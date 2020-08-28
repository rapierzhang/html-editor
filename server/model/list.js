import mongoose from 'mongoose'

const { Schema } = mongoose;

const listSchema = new Schema({
    pid: String,
    title: String,
    desc: String,
    preview: String,
    createTime: Number,
    updateTime: Number,
});

const ListModel = mongoose.model('list', listSchema);

export default ListModel;
