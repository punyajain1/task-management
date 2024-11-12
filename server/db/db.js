const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://punyajain50:SIuDodmDCTQatABb@cluster0.x5wcx.mongodb.net/task-database");

const Schema= mongoose.Schema;
const objid= mongoose.Schema.Types.ObjectId;

const User = new Schema({
    email: {type:String , require:[true,"enter email"] , unique:true},
    passward: String,
    username: String,
    role: {type:String}
});

const Task = new Schema({
    title: String,
    description: String,
    due_date: Date,
    asignee: String,
    creator: objid,
    status: {type: String,enum: ['To Do', 'In Progress', 'Done'],default: 'To Do'},
})

const usermodel = mongoose.model("user" , User);
const taskmodel = mongoose.model("task" , Task);
module.exports = {usermodel , taskmodel}