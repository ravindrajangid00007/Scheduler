  
const express = require('express') ;
const route = express.Router() ;
const homeController = require('../controllers/home_controller') ;
route.get('/' , homeController.home) ;
route.post('/create-teacher', homeController.teacherCreate);
route.get('/fetch-teacher/:uuid' , homeController.fetchTeacher);
// route.use('/users', require('./users')) ;
route.post('/create-task' , homeController.createTask);
route.get('/get-tasks' , homeController.getTasks);
route.get('/delete-teacher/:uuid' , homeController.deleteTeacher);
route.get('/get-task-of-day/:date' , homeController.getTaskOfDay);
route.get('/delete-task/:uuid' , homeController.deleteTask);







module.exports = route ;