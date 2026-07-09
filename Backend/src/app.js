const express=require('express')
const cookieParser=require('cookie-parser')
const cors=require('cors')

const authRoute=require("./Routers/auth.route")
const insurancePlanRoute=require("./Routers/insurancePlan.route")
const paymentRoute=require("./Routers/payment.route")
const policyRoute=require("./Routers/policy.route")
const userRoute=require("./Routers/user.route")
const claimRoute=require("./Routers/claim.route")
const adminRoute=require("./Routers/admin.route")
const hospitalRoute=require("./Routers/hospital.route")
const agentRoute=require("./Routers/agent.route")
const settlementRoute=require("./Routers/settlement.route")
const dashboardRoute = require("./Routers/dashboard.route");

const app=express();

app.use(cors())
app.use(express.json());
app.use(cookieParser())

app.use("/api/auth",authRoute)
app.use("/api/plans",insurancePlanRoute)
app.use("/api/payment",paymentRoute)
app.use("/api/policies",policyRoute)
app.use("/api/users",userRoute)
app.use("/api/claims",claimRoute)
app.use("/api/admin",adminRoute)
app.use("/api/hospital", hospitalRoute);
app.use("/api/agent", agentRoute);
app.use("/api/settlements",settlementRoute)
app.use("/api/dashboard", dashboardRoute);
module.exports=app;