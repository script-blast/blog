//jshint esversion:6
const mongoose=require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const dotenv=require("dotenv");
dotenv.config();
mongoose.set('strictQuery', true);
const urltoconnect='mongodb+srv://' + process.env.USERID + '-' + process.env.PASSWORD +':mongo-app@cluster0.gr79ch6.mongodb.net/dairy';
mongoose.connect(urltoconnect);
const blogSchema=new mongoose.Schema({
    title:String,
    text:String
});

const blog = mongoose.model("blog",blogSchema);

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";

const app = express();

//array of blogs -> to be fetched from mongodb

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


//home route
app.get("/",function(req,res){
    var blogs=[];
    blog.find(function(err,resp){
        blogs=resp;
        res.render("home",{homepara:homeStartingContent,blogs:blogs});
    });
})

//about route
app.get("/about",function(req,res){
    res.render("about",{aboutpara:aboutContent});
})

//compose new blog page
app.get("/compose",function(req,res){
    res.render("compose");
})

//seperate blogs
app.get("/blogs/:topicname",function(req,res){
    var blogs=[];
    blog.find(function(err,resp){
        blogs=resp;
        let flag=true;
        for(let i=0;i<blogs.length;i++){
            if(blogs[i].title === req.params.topicname){
                res.render("blog",{blog:blogs[i]});
                flag=false;
                break;
            }
        }
        if(flag===true){
            res.render("error");
        }
    });
})

//new blog form
app.post("/",function(req,res){
    const newblog=new blog({
        title: req.body.title,
        text: req.body.blog
    });
    newblog.save();
    res.redirect("/");
})
app.listen(3000, function() {
    console.log(process.env.userid)
  console.log("Server started on port 3000");
});
