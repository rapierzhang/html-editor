import mongoose from 'mongoose'

const { Schema } = mongoose;

const componentListSchema = new Schema({
    pid: String,
    title: String,
    desc: String,
    createTime: Number,
    updateTime: Number,
});

const ComponentListModel = mongoose.model('component-list', componentListSchema);

export default ComponentListModel;
