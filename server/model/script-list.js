import mongoose from 'mongoose';

const { Schema } = mongoose;

// 部署脚本列表
const scriptListSchema = new Schema({
    sid: String,
    title: String,
    desc: String,
    createTime: Number,
    updateTime: Number,
});

const ScriptListModel = mongoose.model('script-list', scriptListSchema);

export default ScriptListModel;
