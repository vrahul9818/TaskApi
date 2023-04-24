const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const TaskModel = require("./model/schema")


//files imported 


const app = express();


//port
const SERVER_PORT = process.env.PORT||8080 ;
const DB = 'mongodb+srv://rahul:rahul@cluster0.8efe9kh.mongodb.net/ops?retryWrites=true&w=majority';

//middle ware
app.use(bodyParser.json());


//connections 
mongoose.connect(DB).then(()=>{console.log("connected to mongoose atlas")}).catch((err)=>{console.log(err,"no connection")});


//routes

app.post('/v1/tasks', async (req, res) => {
    try {
      const { title } = req.body;
      const task = new TaskModel({ title, is_completed: false });
      const savedTask = await task.save();
      res.status(201).json({ id: savedTask.unique });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  

/////find tasks
app.get('/v1/tasks', async (req, res) => {
    try {
      const tasks = await TaskModel.find();
      res.status(200).json({ tasks });
    } catch (error) {
      res.status(500).json({ error: ' error with the backend' });
    }
  });
  
////id wise finding
app.get('/v1/tasks/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
      const task = await TaskModel.findOne({ unique: id });
      if (!task) {
        return res.status(404).json({ error: "There is no task at that id"
    });
      }
      return res.status(200).json(task);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: ' error with the backend' });
    }
});



//id wise delete karna

app.delete('/v1/tasks/bulk', async (req, res) => {
    const { tasks } = req.body;
    const taskIds = tasks.map(task => task.id);
    for (let i = 0; i < taskIds.length; i++) {
      const task = await TaskModel.findOneAndDelete({ unique: taskIds[i] });
      if (!task) {
        return res.status(404).send(`Task  not found`);
      }
    }
    res.sendStatus(204);
  });
  

app.delete('/v1/tasks/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
      const task = await TaskModel.findOneAndDelete({ unique: id });
      if (!task) {
        return res.status(404).json({ error: "There is no task at that id" });
      }
      return res.send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error with the backend' });
    }
});


////update 
app.put('/v1/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { title, is_completed } = req.body;
    
    try {
      const task = await TaskModel.findOneAndUpdate({ unique: id }, { title, is_completed });
      if (!task) {
        return res.status(404).json({ error: "There is no task at that id" });
      }
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: ' error with the backend' });
    }
  });
  
  ////inserting many tasks
  

  app.post('/v1/tasks/bulk', async (req, res) => {
    const { tasks } = req.body;
    const responseTasks = [];
    
    try {
      for (let i = 0; i < tasks.length; i++) {
        const task = new TaskModel({ title: tasks[i].title, is_completed: tasks[i].is_completed });
        const savedTask = await task.save();
        responseTasks.push({ id: savedTask.unique });
      }
      
      return res.status(201).json({ tasks: responseTasks });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'error with the backend' });
    }
  });
  
  
  

  
  
//server
app.listen(SERVER_PORT, (req,res)=>{
    console.log(`server started ${SERVER_PORT}`);
})

