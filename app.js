
const express = require('express');
//const mongodb = require('mongodb');
const mongoose = require('mongoose');
const app = express();
// bodyParser is used to parse the payload of the incoming POST requests
const bodyParser = require('body-parser');

// reference the schemas
let Task = require('./models/task');
let Developer = require('./models/developer');

// Express should be able to render ejs templates
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//allow Express to understand the urlencoded format
app.use(express.urlencoded({
    extended: false
}));

//app.use(bodyParser.json());
// 'img' contains static assets
// it serves static files
app.use(express.static('public'));
app.use(express.static('img'));

// create an instance of MongoDB client
// const MongoClient = mongodb.MongoClient;
// define the location of the server and its port number
const url = "mongodb://" + process.argv[2] + ":27017/week7lab";
console.log("Connecting to MongoDB Server=" + url);

// let db;
// let col;
// // connect to mongoDB server
// MongoClient.connect(url, {useNewUrlParser:true, useUnifiedTopology: true}, function(err, client){
//     if (err) {
//         console.log("Err ", err);
//     } else {
//         console.log("Connected successfully to server");
//         db = client.db("week6lab");
//         col = db.collection('taskdb');
//         //db.createCollection('taskdb');   
//     }
// })

// connect to mongoose
mongoose.connect(url, function(err){
    if (err) {
        console.log("Err ", err);
    } else {
        console.log("Connected successfully to server");
    }
})

// a request to the home page
app.get('/', function(req, res){
    // transfer the file at the given path
    res.sendFile(__dirname + "/views/index.html");
});

// a request to add a new task
app.get('/newtask', function(req, res){
    res.sendFile(__dirname + "/views/newtask.html");
});
// insert a new task in db
app.post('/addtask', function(req, res){
    let taskDetails = req.body;
    //taskDetails.taskID = getNewId(); 
    taskDetails.taskDue = new Date(taskDetails.taskDue);
    let task = new Task({
        //taskId: taskDetails._id,
        taskName: taskDetails.taskName,
        taskAssign: taskDetails.taskAssign,
        taskDueDate: taskDetails.taskDue,
        taskStatus: taskDetails.taskStat,
        taskDescription: taskDetails.taskDesc
    });
    task.save(function(err){
        if (err) {
            //res.redirect('/404');
            res.redirect('/newtask');
        } else {
            res.redirect('/listtasks');
        }
    });
});

// a request to get all tasks
app.get('/listtasks', function(req, res){
    // exec indicates the end of the chain and invokes the callback function
    Task.find().populate('taskAssign').exec(function(err, data){
        if (err) {
            res.redirect('/404');
        } else {
            res.render('listtasks.html', {taskDb: data});
        }
    });
});

// a request to delete a task
app.get('/deletetask', function(req, res){
    res.sendFile(__dirname + "/views/deletetask.html");
});
// response to delete
app.post('/delete', function(req, res){
    let taskDetails = req.body;
    let id = parseInt(taskDetails.taskId);
    Task.deleteOne({_id: id}, function(err){
        if (err){
            res.redirect('/404');
        } else {
            res.redirect('/listtasks');
        }
    });
})

// a request to update a task
app.get('/updatetask', function(req, res){
    res.sendFile(__dirname + "/views/updatetask.html");
});
// response to update
app.post('/update', function(req, res){
    let taskDetails = req.body;
    console.log(taskDetails);
    
    let id = parseInt(taskDetails.taskId);
    console.log(taskDetails);
    let status = taskDetails.taskStat;
    Task.updateOne({_id: id}, {$set: {taskStatus: status}},function(err, result){
        if (err) {
            res.redirect('/404');
        } else {
            res.redirect('/listtasks');
        }
    });
})

// a request delete all complete tasks
app.get('/deleteComplete', function(req, res){
    Task.deleteOne({taskStatus: "Complete"}, function(err){
        if (err){
            res.redirect('/404');
        } else {
            res.redirect('/listtasks');
        }
    });
})

// a request delete all complete and old tasks
app.get('/deleteOldComplete', function(req, res){
    let now = new Date();
    Task.deleteMany({taskStatus: "Complete", taskDueDate: {$lt: now}}, function(err){
        if (err){
            res.redirect('/404');
        } else {
            res.redirect('/listtasks');
        }
    });
});

// a request add a new developer
app.get('/newdeveloper', function(req, res){
    res.sendFile(__dirname + "/views/newdeveloper.html");
});
// response to add developer
app.post('/adddeveloper', function(req, res){
    let developerDetails = req.body;
    let developer = new Developer({
        name: {
            firstName: developerDetails.firstName, 
            lastName: developerDetails.lastName
        },
        level: developerDetails.level,
        address: {
            state: developerDetails.state,
            suburb: developerDetails.suburb,
            street: developerDetails.street,
            unit: developerDetails.unit
        }
    });
    developer.save(function(err){
        if (err) {
            //res.redirect('/404');
            res.redirect('/newdeveloper');
        } else {
            res.redirect('/listdevelopers');
        }
    });
});

// a request list all developer
app.get('/listdevelopers', function(req, res){
    Developer.find().exec(function(err, data){
        if (err) {
            res.redirect('/404');
        } else {
            res.render('listdevelopers.html', {developerDb: data});
        }
    });
});

app.listen(8080, function(){
    console.log("Listening on port 8080!")
});

function getNewId() {
    return (Math.floor(100000 + Math.random() * 900000));
}
