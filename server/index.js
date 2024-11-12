const express = require("express");
const app = express();

const userRouter = require("./routes/user.js");
//const taskRouter = require("./routes/task.js");
const adminRouter = require("./routes/admin.js");
app.use(express.json());

app.use("/user",userRouter);
app.use("/admin",adminRouter);
//app.use("/course",taskRouter);

app.listen(3000 , function(){
    console.log("running on port 3000");
});
