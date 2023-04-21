const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const dbconnect = require("./config/dbConfig");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const router = require("./routers/router");
const passport = require("passport");


dotenv.config({path:"./config/config.env"});

const app = express();
const PORT = process.env.PORT || 3000;

dbconnect();

app.use(morgan("dev"));

app.use(cors(corsOptions));

app.use(express.json());

app.use(session({
    secret : process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized: false,
    cookie:{
        maxAge: 1000 * 60 * 60 
    },
    rolling:true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    })
}))


require("./config/passport");

app.use(passport.initialize());
app.use(passport.session());


app.use("/api",router);

app.all("*",(req,res)=>{
    res.status(404)   
    res.type("txt").send("404 not found bitch")
    
})

app.use((err,req,res,next)=>{
    console.log(err);
    res.status(500).json({message:err.message});
});

app.listen(PORT,()=>{
    console.log("server started")
})