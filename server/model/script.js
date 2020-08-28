import mongoose from 'mongoose';

const { Schema } = mongoose;

// 部署脚本模型
const scriptSchema = new Schema({
    sid: String,
    title: String,
    desc: String,
    script: String,
    host: String,
    username: String,
    password: String,
    modelType: String,
    deployPath: String,
    createTime: Number,
    updateTime: Number,
});

const ScriptModel = mongoose.model('script', scriptSchema);

export default ScriptModel;
