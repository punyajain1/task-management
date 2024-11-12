const express = require("express");
const adminRouter = express.Router();
const { usermodel, taskmodel } = require("../db/db");
const jwt = require('jsonwebtoken');
const key = "punya123"
const { adminMiddleware } = require("../middlewere/adminmidd.js");
const {default: mongoose} = require("mongoose");

mongoose.connect("mongodb+srv://punyajain50:SIuDodmDCTQatABb@cluster0.x5wcx.mongodb.net/task-database")

const {z} = require("zod");
const bcrypt = require("bcrypt");

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
            res.status(201).json({msg: "error while user signup"});
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
                res.json({token: token , role: admin.role});
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

adminRouter.post("/task" ,adminMiddleware,async function(req,res){
    const adminid = req.adminid;
    const {title,description,due_date,asignee,status} = req.body;
    const task = await taskmodel.create({
        title: title,
        description: description,
        due_date: due_date,
        asignee: asignee,
        creator: adminid,
        status: status
    })

    res.json({
        message: "Task created",
        taskId: task._id
    })
})

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

adminRouter.delete("/del-task" , adminMiddleware,async function(req,res){
    const adminid = req.adminid;
    const admin = usermodel.findById(adminid);
    try{
        if(admin.role == "admin"){
            const task = await Task.findByIdAndDelete(req.params.id);
            if (!task) {
                res.status(404).json({ msg: 'Task not found' });
            }
            res.json({ msg: 'Task deleted' });
        }else{
            res.status(200).json({msg:"you are not admin"});
        }
    }catch(e){
        res.status(201).json({msg:"task deleted"});
    }
})



module.exports = adminRouter;
