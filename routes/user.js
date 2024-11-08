const{ Router } = require("express");
const userRouter = Router();
const { usermodel, taskmodel } = require("../db/db");
const jwt = require('jsonwebtoken');
const key = "punyauser123"
const { userMiddleware } = require("../middlewere/usermidd.js");
const {default: mongoose} = require("mongoose");

mongoose.connect("mongodb+srv://punya01155:9810845969@cluster0.fm077.mongodb.net/")

const {z} = require("zod");
const bcrypt = require("bcrypt");

userRouter.post("/signup",async function(req,res,){
    const reqbody = z.object({
        email: z.string().email().toLowerCase(),
        passward: z.string(),
        username: z.string(),
        role: z.string()
    });
    const prased = reqbody.safeParse(req.body);
    if(prased){
        try{
            const{email , passward , username} = req.body;
            const hashpass = await bcrypt(passward,5);
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
    const user = await usermodel.findOne({ email : email });
    try{
        if(user){
            const passmatch = await bcrypt.compare(passward , user.passward);
            if(passmatch){
                const token = await jwt.sign({id:user._id , key});
                res.json({token: token , role: user.role});
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

userRouter.get("/tasks",userMiddleware,async function(req,res){
    try{
        const tasks = await taskmodel.findById({assignee:req.userId});
        res.json({tasks:tasks});
    }catch(e){
        res.status(500).json({msg:"database error"})
    }
})


userRouter.put("/task",userMiddleware,async function(req,res){
    
    const user = await usermodel.findById(req.userId);
    const {status,taskId} = req.body;
    const task = await taskmodel.findById(taskId);

    if(user._id.equals(task.assignee)) {
        task.status = status;
        await task.save();
        res.json({ msg: 'Task updated' });

    }else{
        return res.status(403).json({ msg: 'Forbidden' });
    }
})
