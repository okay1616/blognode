const express = require('express')
const User = require("./models/User.js");
const Blog = require("./models/Blog");
const res = require('express/lib/response.js');
const app = express.Router();

const JWT = require('jsonwebtoken');
const JWT_Secret = "FirstNodeApplication";
app.post('/find', async function (req, res) {
     let result;
    
     try {
     JWT.verify(req.body.token, JWT_Secret).id;
     }
     catch (error) {
          res.send("first login");
     }
     try {
          result = await Blog.find({ _id: req.body.blogid });
          res.status(201).json(result[0]);
     }
     catch (error) {
          res.send({ error: "blog not found" });
     }

});
app.post('/GetBlogs',async function(req,res){
          let author_id;
          try {
          author_id = JWT.verify(req.body.token, JWT_Secret).id;
          }
          catch (error) {
               res.send("first login");
          }
          let offset = req.body.offset;
          let blogs = req.body.blogs;
         
          try {
              let result = await Blog.find({author_id :author_id }).skip(offset*blogs).limit(blogs);
               res.status(201).json({blogs:result,offset : req.body.offset+1 });
          }
          catch (error) {
               res.send({ error: "blog not found" });
          }
});
app.post('/add', async function (req, res) {
    
     let author_id = "";
     let author;
     try {
          author_id = JWT.verify(req.body.token, JWT_Secret).id;

     }
     catch (error) {
          res.send("first login");
     }
     
     if (req.body.blogid === "notdefine") {
          try {
               author = await User.find({ _id: author_id });

          } catch (error) {
               res.status(409).json({ message: error.message });
          }
         
          const blog = new Blog({
               author_id : author_id,
               author_name: author[0].name,
               author_img: author[0].image,
               author_desc: author[0].about,
               title: req.body.title,
               description : req.body.description,
               content: req.body.content,
               headerimglink: req.body.headerimglink,
               category: req.body.category,
               date: new Date(),
               likes: 0,
               Views: 0,
               comments: {},
               issues: {}

          });
        
          try {
               await blog.save();
               console.log("Done");
               res.status(201).json(blog);
          }
          catch (error) {
               res.send(error);
          }
     }
     else {
        let blog;
        try{
           await Blog.findOneAndUpdate({_id:req.body.blogid},{
                title : req.body.title,
                content : req.body.content,
                description : req.body.description,
                headerimglink : req.body.headerimglink,
                category : req.body.category,
                date : new Date()
           });
           blog = await Blog.find({_id:req.body.blogid});
          
           res.status(201).json(blog[0]);
        }
        catch(error)
        {
          res.send(error);
        }
        
     }

});

app.delete("/delete",async function (req,res){
     let result;
    
     try {
     JWT.verify(req.body.token, JWT_Secret).id;
     }
     catch (error) {
          res.send("first login");
     }
     try {
           await Blog.findOneAndDelete({ _id: req.body.blogid });
          res.status(201).json({status:"Done"});
     }
     catch (error) {
          res.send({ error: "blog not found" });
     }
});

app.get("/trandingblogs",async function(req,res){
     try{
        let result = await Blog.find(
          {
              "date": 
              {
                  $gte: new Date((new Date().getTime() - (15 * 24 * 60 * 60 * 1000)))
              }
          }
          ).sort({ "Views": -1 });
          res.status(201).json(result);
     }
     catch(error){
          res.send({ error: "some thing went wrong" });
     }
});

app.put("/like/:addOrNot/:id", async function (req, res) {
     const user = await Blog.findOne({ _id: req.params.id }, { _id: true, likes: true });
     if (user) {
          try {
               let like = user.likes;
               console.log(user);
               if (req.params.addOrNot == "true") {
                    like = like + 1;
               }
               else {
                    like = like - 1;
               }
               Blog.findByIdAndUpdate(user._id, { likes: like }, function () {
                    res.send({ msg: "like operation done" });
               });

          }
          catch (error) {
               res.send(error);
          }
     }
     else {
          res.send({ error: "Provide Valid User Id" });
     }
});

app.put("/comment/:id", async function (req, res) {
     const user = await Blog.findOne({ _id: req.params.id }, { _id: true, comments: true });
     if (user) {
          try {
               let like = user.likes;
               comment = user.comments.add({ author_id: "ksdfjlk", comment: "adsds" });
               pdate(user._id, { comments: comment }, function (value) {
                    res.status(201).json("jklsf");
               });

          }
          catch (error) {
               res.send(error);
          }
     }
     else {
          res.send({ error: "Provide Valid User Id" });
     }
});

app.post("/addView",async function(req,res){
         try{
              let blog = await Blog.findOne({_id:req.body.blogid});
               await Blog.findOneAndUpdate({_id:req.body.blogid},{Views:blog.Views+1});
             
               res.status(201).send({});
         }
         catch(e){
              res.send(e);
         }
});
app.post("/addLike",async function(req,res){
     try{
          let blog = await Blog.findOne({_id:req.body.blogid});
            blog =  await Blog.findOneAndUpdate({_id:req.body.blogid},{likes:blog.likes+req.body.count});
          
           res.status(201).send({});
     }
     catch(e){
          res.send(e);
     }
});

app.post("/addIssue",async function(req,res){
     try{
         
          let blog = await Blog.findOne({_id:req.body.blogid});
           
            blog =  await Blog.findOneAndUpdate({_id:req.body.blogid},{issues : [...blog.issues,{...req.body.issue,date:new Date()}]});
           
           res.status(201).send({});
     }
     catch(e){
          res.send(e);
     }
});

app.post("/addComment",async function(req,res){
     try{
         
          let blog = await Blog.findOne({_id:req.body.blogid});
           
            blog =  await Blog.findOneAndUpdate({_id:req.body.blogid},{comments : [...blog.comments,{...req.body.comment, date : new Date()}]});
            blog = await Blog.findOne({_id:req.body.blogid});
           res.status(201).send(blog);
     }
     catch(e){
          res.send(e);
     }
});
app.post("/removeComment",async function(req,res){
     try{
          
          let blog = await Blog.findOne({_id:req.body.blogid});
          let id = req.body.commentid;
          
           let comments = blog.comments;
           
          let n = comments.length;
          let updatedcomments = [];
          for(let i=0;i<n;i++)
          {
               if(comments[i]._id != id)
               {
                   updatedcomments.push(comments[i]);
               }
          }
            
            blog =  await Blog.findOneAndUpdate({_id:req.body.blogid},{comments : updatedcomments});
            blog = await Blog.findOne({_id:req.body.blogid});
            console.log(blog);
           res.status(201).send(blog);
     }
     catch(e){
          res.send(e);
     }
});
app.post("/removeIssue",async function(req,res){
     try{
          
          let blog = await Blog.findOne({_id:req.body.blogid});
          let id = req.body.issueid;
          
           let issues = blog.issues;
           
          let n = issues.length;
          let updatedissues = [];
          for(let i=0;i<n;i++)
          {
               if(issues[i]._id != id)
               {
                   updatedissues.push(issues[i]);
               }
          }
            
            blog =  await Blog.findOneAndUpdate({_id:req.body.blogid},{issues : updatedissues});
            blog = await Blog.findOne({_id:req.body.blogid});
            console.log(blog);
           res.status(201).send(blog);
     }
     catch(e){
          res.send(e);
     }
});
app.post("/GetBlogsCategory", async function(req,res){
     
     let offset = req.body.offset;
     let blogs = req.body.blogs;
     console.log("done");
     try {
         let result = await Blog.find({category :req.body.category }).skip(offset*blogs).limit(blogs).sort({Views : -1});
         console.log(result);
          res.status(201).json({blogs:result,offset : req.body.offset+1 });
     }
     catch (error) {
          res.send({ error: "blog not found" });
     }
});
module.exports = app;