var express = require("express"),
    app = express(),
    methodOverride= require("method-override"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    request = require("request");

app.set("view engine","ejs");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));

mongoose.connect('mongodb+srv://mohamed:mo01121823018@cluster0-e58to.mongodb.net/test?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

mongoose.connection.on('connected',function () {
    console.log('db connected!!');
});

var blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
});



var Blog = mongoose.model("Blog",blogSchema);

// Blog.create({
//     title:"The Mythbuster’s Guide to Saving Money on Energy Bills",
//     image:"https://www.miss-thrifty.co.uk/wp-content/uploads/2018/09/38154357964_63da2f548e_z-550x377.jpg",
//     body:"How to Save Money on Energy Bills: Advanced Level\n" +
//         "\n" +
//         "At this point, in the interests of disclosure, I should point out that my husband has been known to stage interventions, because I can get carried away.\n" +
//         "\n" +
//         "He is happy for me to tack aluminium foil behind the radiators, to reflect heat back into the room instead of into the walls."
// });

app.get('/',function (req,res) {
    res.redirect("/blogs");
});


app.get('/blogs',function (req,res) {
    Blog.find({},function (err,blogs) {
        if(err){
            console.log(err);
        }
        else{
            res.render("index",{blogs:blogs});
        }
    });
});


app.get("/blogs/new",function(req,res){
    res.render('new');
});

app.get("/blogs/:id",function (req,res) {
    Blog.findById(req.params.id ,function (err,foundBlog) {
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render('show',{blog:foundBlog});
        }
    });

});

app.get("/blogs/:id/edit",function (req,res) {
    Blog.findById(req.params.id , function (err,foundBlog) {
        if(err){
            console.log(err);
        }
        else{
            res.render('edit',{blog:foundBlog});
        }
    });
});


app.post('/blogs',function(req,res){
    Blog.create(req.body.blogs , function(err,addedBlog){
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/blogs');
        }
    });
});

app.put('/blogs/:id',function (req,res) {
    console.log(req.body.blogs);
    Blog.findByIdAndUpdate(req.params.id,req.body.blogs,function (err,newBlog) {
        if(err){
            console.log(err);
        }
        else {
            console.log(req.params.id);
            res.redirect("/blogs/"+req.params.id);
            //res.render('show',{blog:newBlog});
        }
    });
});


app.listen("3200",function () {
    console.log("Listening Now");
});