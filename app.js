

const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
// const _ = require("lodash")
const homeStartingContent = "Lacus vel ent montesiaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const app = express();
// const { MongoClient } = require('mongodb');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

//create schema 
// const {Schema} = mongoose;
const postSchema =  ({
   title: String,
   content: String,
});

//create model 
const Post =  mongoose.model("Post",postSchema);

app.get("/", function(req,res){

   Post.find({}, function(err, posts){
      
      res.render("home", {
         
         startingContent: homeStartingContent,
         
         posts: posts
         
      });
      
   });
 });


app.get("/compose", function(req,res){
   res.render("compose" );
})


app.post("/compose", function(req, res){
   // res.render("about",{about:aboutContent});
   const post = new Post({
      title: req.body.postTitle,
      content: req.body.postBody
   });
 
   
   post.save(function(err){
      if (!err){
         res.redirect("/");
      }
   });
});

app.get("/posts/:postId", function(req, res){
   
   const requestedPostId = req.params.postId;
   
   Post.findOne({_id: requestedPostId}, function(err, post){
      res.render("post", {
         title: post.title,
         content: post.content

      });
   });
   
});


   app.post("/delete/:postId", function(req, res){
   
      // const check = req.params.del;
      const requestedPostId = req.params.postId;
      Post.findByIdAndRemove({_id: requestedPostId}, function(err){
         if(!err){
            console.log("successfully deleted");
            res.redirect("/");
          }
         });
      });

// app.delete("/posts/:postId",async function(req, res){ 
//   await Post.findByIdAndRemove(req.params.postId)
//    res.redirect("/")   
// })

// app.get("/delete", function(req,res){
//    res.render("home" );
// })

app.get("/about", function(req,res){
   res.render("about",{about:aboutContent});
})
app.get("/contact", function(req,res){
   res.render("contact",{contact:contactContent});
})


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
