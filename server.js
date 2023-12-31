const express = require("express");
const { connectMongoose , User } = require("./conn.js");
const passport = require("passport");
const {intializingPassport} = require("./passport.js");
const expressSession = require("express-session");
const flash = require("express-flash");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(expressSession({ secret: "secret", resave:false, saveUninitialized:false, cookie:{maxAge:600000}}
));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("public"));
app.use(flash());

app.set("view engine","ejs");

connectMongoose();

intializingPassport(passport);

app.get("/",(req,res)=>{
    res.render("index");
})
app.get("/register",(req,res)=>{
    res.render("register",{messages:req.flash()});
})
app.get("/login",(req,res)=>{
    res.render("login",{messages:req.flash()});
})

app.post("/register",async (req,res)=>{
    const user = await User.findOne({username : req.body.username});   // 'user' returns null if findOne is false and returns object if findOne is true.
    if(!req.body.username || !req.body.password){
        req.flash("error","Email and Password are required");
        return res.redirect("/register");
    }
    else if(req.body.password.length<8){
        req.flash("error","Password must be of atleast 8 characters");
        return res.redirect("/register");
    }
    else{
        // return res.redirect("/register");
    if(user!=null){
        req.flash("error","User already exists");
         return res.redirect("/register");
    }
    else{
        const newUser = await User.create(req.body);
        req.flash("success","Registered succesfully");
    res.redirect("/register");
    }
    }
   
})

app.post("/login",async (req,res)=>{          //passport.authenticate("local") as middleware function

    if(!req.body.username || !req.body.password){
        req.flash("error","Email and Password are required");
        return res.redirect("/login");
    }
    else if(req.body.password.length<8){
        req.flash("error","Password must be of atleast 8 characters");
        return res.redirect("/login");
    }
    else{
        // return res.redirect("/register");
        const user = await User.findOne({username : req.body.username}); 
        if(user!=null){
            if(user.password == req.body.password){
                req.flash("success",`welcome `+` ${user.firstName}`);
                return res.redirect("/login");
            }
            else{
                req.flash("error","password does'nt matched");
            return res.redirect("/login");}
        }
        else{req.flash("error","username not found");
        return res.redirect("/login");}

    }

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