const express = require("express");
const { connectMongoose , User } = require("./conn.js");
const passport = require("passport");
const {intializingPassport} = require("./passport.js");
const expressSession = require("express-session");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(expressSession({ secret: "secret", resave:false, saveUninitialized:false}
));
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine","ejs");

connectMongoose();

intializingPassport(passport);

app.get("/",(req,res)=>{
    res.render("index");
})
app.get("/register",(req,res)=>{
    res.render("register");
})
app.get("/login",(req,res)=>{
    res.render("login");
})

app.post("/register",async (req,res)=>{
    const user = await User.findOne({username : req.body.username});   // 'user' returns null if findOne is false and returns object if findOne is true.
    console.log(user);
    if(user!=null){
        return res.status(400).send("user already exists");
    }
    const newUser = await User.create(req.body);
    res.status(201).send(newUser);
})

app.post("/login",passport.authenticate('local', { successRedirect: '/' }),async (req,res)=>{
    // const user = await User.findOne({username : req.body.username}); 
    // if(user!=null){
    //     if(user.password == req.body.password){
    //         res.status(201).send("welcome " + user.name);
    //     }
    //     else{res.send("password does'nt matched");}
    // }
    // else{res.send("username not found");}
})
app.listen(3000 ,()=>{
    console.log("listneing on http://localhost:3000");
});