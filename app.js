
const express = require('express');
const mongodb = require('mongodb');
const app = express();
// bodyParser is used to parse the payload of the incoming POST requests
const bodyParser = require('body-parser');

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
const MongoClient = mongodb.MongoClient;
// define the location of the server and its port number
const url = "mongodb://" + process.argv[2] + ":27017/";
console.log("Connecting to MongoDB Server=" + url);

let db;
let col;
// connect to mongoDB server
MongoClient.connect(url, {useNewUrlParser:true, useUnifiedTopology: true}, function(err, client){
    if (err) {
        console.log("Err ", err);
    } else {
        console.log("Connected successfully to server");
        db = client.db("week6lab");
        col = db.collection('taskdb');
        //db.createCollection('taskdb');   
    }
})

// list of tasks
// tasks = [];
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
app.post('/add', function(req, res){
    let taskDetails = req.body;
    taskDetails.taskID = getNewId(); 
    taskDetails.taskDue = new Date(taskDetails.taskDue);
    col.insertOne({
        taskId: taskDetails.taskID,
        taskName: taskDetails.taskName,
        taskAssign: taskDetails.taskAssign,
        taskDueDate: taskDetails.taskDue,
        taskStatus: taskDetails.taskStat,
        taskDescription: taskDetails.taskDesc
    });
    res.redirect('/listtasks');
});

// a request to get all tasks
app.get('/listtasks', function(req, res){
    // render a view and sends the rendered HTML string to the client
    // pass local variable tasks to the view
    col.find({}).toArray(function(err, result){
        if (err) {
            res.redirect('/404');
        } else {
            res.render('listtasks.html', {taskDb: result});
        }
    })
});

// a request to delete a task
app.get('/deletetask', function(req, res){
    res.sendFile(__dirname + "/views/deletetask.html");
});
// response to delete
app.post('/delete', function(req, res){
    let taskDetails = req.body;
    let id = parseInt(taskDetails.taskId);
    col.deleteOne({taskId: id}, function(err, obj){
        if (err) {
            res.redirect('/404');
        } else {
            res.redirect('/listtasks');
        }
    })
})

// a request to update a task
app.get('/updatetask', function(req, res){
    res.sendFile(__dirname + "/views/updatetask.html");
});
// response to update
app.post('/update', function(req, res){
    let taskDetails = req.body;
    let id = parseInt(taskDetails.taskId);
    let status = taskDetails.taskStat;
    if (status == "InProgress") {
        col.updateOne({taskId: id},{$set: {taskStatus: status}},function(err, result){
            if (err) {
                res.redirect('/404');
            } else {
                res.redirect('/listtasks');
            }
        })
    } else {
        col.deleteOne({taskId: id}, function(err, obj){
            if (err) {
                res.redirect('/404');
            } else {
                res.redirect('/listtasks');
            }
        })
    }
    
})

// a request delete all tasks
app.get('/deleteOldComplete', function(req, res){
    col.deleteMany({taskStatus: "Complete"}, function(err, result){
        if (err) {
            res.redirect('/404');
        } else {
            res.redirect('/listtasks');
        }
    })
});

app.listen(8080, function(){
    console.log("Listening on port 8080!")
});

function getNewId() {
    return (Math.floor(100000 + Math.random() * 900000));
}
