const{ Router } = require("express");
const adminRouter = Router();
const { usermodel, taskmodel } = require("../db/db");
const jwt = require('jsonwebtoken');
const key = "punya123"
const { adminMiddleware } = require("../middlewere/adminmidd.js");
const {default: mongoose} = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

mongoose.connect("mongodb+srv://punya01155:9810845969@cluster0.fm077.mongodb.net/")

const {z} = require("zod");
const bcrypt = require("bcrypt");

adminRouter.post("/signup",async function(req,res,){
    const reqbody = z.object({
        email: z.string().email().toLowerCase(),
        passward: z.string(),
        username: z.string(),
        role: z.string()
    });
    const prased = reqbody.safeParse(req.body);
    if(prased){
        try{
            const{email , passward , username ,role} = req.body;
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


adminRouter.post("/signin", async function(req,res){
    const {email , passward} = req.body;
    const admin = await usermodel.findOne({email:email});
    try{
        if(admin){
            const passmatch = await bcrypt.compare(passward , admin.passward);
            if(passmatch){
                const token = await jwt.sign({id:admin._id , key});
                res.json({token: token , role: admin.role});
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

adminRouter.post("/task" , async function(req,res){
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

adminRouter.put("/task", async function(req,res){
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

adminRouter.delete("/task" , async function(req,res){
    try{
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
           res.status(404).json({ msg: 'Task not found' });
        }
         res.json({ msg: 'Task deleted' });
    }catch(e){
        res.status(201).json({msg:"task deleted"});
    }
})