const express = require("express");
const userRouter = express.Router();
const { usermodel , taskmodel } = require("../db/db");
const jwt = require('jsonwebtoken');
const key = "punyauser123"
const { userMiddleware } = require("../middlewere/usermidd.js");
const {default: mongoose} = require("mongoose");

mongoose.connect("mongodb+srv://admin:VowyYnkBsv1ZGvQu@cluster0.vuzwp.mongodb.net/task-database")

const {z} = require("zod");
const bcrypt = require("bcrypt");

userRouter.post("/signup",async function(req,res,){
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
                role:"user"
            });
            res.json({ msg:"signup done" });
        }catch(e){
            res.status(201).json({msg: "error while user signup"});
        }
    }
})


userRouter.post("/signin",async function(req,res){
    const {email , passward} = req.body;
    try{
        const user = await usermodel.findOne({ email : email });
        if(user){
            const passmatch = await bcrypt.compare(passward , user.passward);
            if(passmatch){
                const token = await jwt.sign({id:user._id} , key);
                res.json({user_token: token , role: user.role});
            }else{
                res.json({msg:"invalid passward"});
            }
        }else{
            res.json({msg:"user dose not exist"});
        }
    }catch(e){
        res.status(202).json({msg: "invald input"});
    }
})

userRouter.get("/tasks", userMiddleware, async function (req, res) {
    try {
        const userId = req.userid;
        console.log("User ID:", userId);
        const tasks = await taskmodel.find({ asignee: userId});
        res.json({ tasks: tasks });
    } catch (e) {
        console.error("Error retrieving tasks:", e);
        res.status(500).json({ msg: "Database error", error: e.message });
    }
});



userRouter.put("/edit_task/:id",userMiddleware,async function(req,res){
    try{
        const taskId = new mongoose.Types.ObjectId(req.params.id);
        console.log('Task ID:', taskId);
        // const user = await usermodel.findById(req.userId);
        const status = req.body.status;
        const task = await taskmodel.findById(taskId);
        console.log('Task:', task);
        if(req.userId === task.assignee) {
            task.status = status;
            await task.save();
            res.json({ msg: 'Task updated' });
        }else{
            return res.status(403).json({ msg: 'Forbidden' });
        }
    }catch(e){
        res.status(500).json({
            msg : e.message
        })
    }
})


module.exports = userRouter;
