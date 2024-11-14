const express = require("express");
const adminRouter = express.Router();
const { usermodel, taskmodel } = require("../db/db");
const jwt = require('jsonwebtoken');
const key = "punya123"
const { adminMiddleware } = require("../middlewere/adminmidd.js");
const {default: mongoose} = require("mongoose");

mongoose.connect("mongodb+srv://admin:VowyYnkBsv1ZGvQu@cluster0.vuzwp.mongodb.net/task-database")

const {z} = require("zod");
const bcrypt = require("bcrypt");
const { userMiddleware } = require("../middlewere/usermidd.js");

adminRouter.post("/signup",async function(req,res,){
    const reqbody = z.object({
        email: z.string().email().toLowerCase(),
        passward: z.string(),
        username: z.string()
    });
    const prased = reqbody.safeParse(req.body);
    if(prased){
        try{
            const{email , passward , username} = req.body;
            const hashpass = await bcrypt.hash(passward, 5);
            await usermodel.create({
                email:email,
                passward:hashpass,
                username: username,
                role:"admin"
            });
            res.json({ msg:"signup done" });
        }catch(e){
            res.status(201).json({msg: "error while admin signup"});
        }
    }
})


adminRouter.get("/signin", async function(req,res){
    const {email , passward} = req.body;
    try{
        const admin = await usermodel.findOne({ email : email });
        if(admin){
            const passmatch = await bcrypt.compare(passward , admin.passward);
            if(passmatch){
                const token = await jwt.sign({ id: admin._id }, key);
                res.json({admin_token: token , role: admin.role});
            }else{
                res.json({msg:"invalid passward"});
            }
        }else{
            res.json({msg:"user dose not exist"});
        }
    }catch(e) {
        res.status(400).json({ msg: "Invalid input", error: e.message });
    }
})

adminRouter.post("/task", adminMiddleware, userMiddleware, async function(req, res) {
    try {
        const adminid = new mongoose.Types.ObjectId(req.adminid);  // Ensure ObjectId type
        const userid = new mongoose.Types.ObjectId(req.userid);
        const { title, description, due_date, status } = req.body;
        const task = await taskmodel.create({
            title,
            description,
            due_date,
            asignee: userid,
            creator: adminid,
            status
        });

        res.json({ message: "Task created", taskId: task._id });
    } catch (error) {
        res.status(500).json({ message: "Task creation failed", error: error.message });
    }
});



adminRouter.put("/edit-task", async function(req,res){
    const adminid = req.adminid;
    const {title,description,due_date,asignee,status,taskId} = req.body;
    const taks = await taskmodel.updateOne({
        _id: taskId
    },{
        title: title,
        description: description,
        due_date: due_date,
        asignee: asignee,
        creator: adminid,
        status: status
    })
    res.json({msg:"task updated"});
})

adminRouter.delete("/del-task/:id", adminMiddleware, async function (req, res) {
    const adminid = req.adminid;
    try {
        const admin = await usermodel.findById(adminid);
        if(admin && admin.role==="admin"){
            const task = await Task.findByIdAndDelete(req.params.id);
            if(!task){
                return res.status(404).json({ msg: 'Task not found' });
            }
            return res.json({ msg: 'Task deleted' });
        }else{
            return res.status(403).json({ msg: "You are not an admin" });
        }
    }catch (e) {
        console.error(e);
        return res.status(500).json({ msg: "An error occurred", error: e.message });
    }
});




module.exports = adminRouter;
