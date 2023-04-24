const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');

const taskSchema = new Schema({
    unique: { type: String, default: uuidv4 },
    title: { type: String },
    is_completed: { type: Boolean}
});

const taskModel = mongoose.model('Tasks', taskSchema);

module.exports = taskModel;
