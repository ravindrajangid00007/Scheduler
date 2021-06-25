
const { sequelize, Teacher, Task } = require('../models');

let time = ["1AM", "2AM", "3AM", "4AM", "5AM", "6AM", "7AM", "8AM", "9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM", "10PM", "11PM", "12PM"];
module.exports.home = async function (req, res) {
    let teachers = await Teacher.findAll();
    return res.render('index', {
        time_list: time,
        teacher_list: teachers
    });
}

module.exports.teacherCreate = async function (req, res) {
    try {
        console.log(req.body)
        const { name, email } = req.body;
        let teacher = await Teacher.create({ name, email });
        // return res.json(teacher);
        return res.redirect('back');
    } catch (err) {
        console.log("ERROR", err);
    }

}

module.exports.fetchTeacher = async function (req, res) {
    try {
        let uuid = req.params.uuid;
        let teacher = await Teacher.findOne({
            where: { uuid },
            include: [Task]
        });

        console.log("teacher=", teacher);
        return res.json(teacher);
    } catch (err) {
        console.log("ERROR", err);
    }
}

module.exports.createTask = async function (req, res) {
    try {
        const { teacherUuid, date, time, content } = req.body;
        let teacher = await Teacher.findOne({
            where: { uuid: teacherUuid }
        });
        let task = await Task.create({ teacherId: teacher.id, date, time, content });
        task = await Task.findOne(
            {
                include: [Teacher],
                where: { uuid: task.uuid }
            }
        );
        if (req.xhr) {
            return res.status(200).json({
                task: task
            });
        }
        return res.redirect('back');
    } catch (err) {
        console.log(err);
    }

}

module.exports.getTasks = async function(req, res) {
    try {
        let teacherUuid = req.query.teacher_uuid;

        console.log("uuid at home controller " , teacherUuid);
        let teacher = await Teacher.findOne({ 
            where: { uuid: teacherUuid}
        });
        let tasks = await Task.findAll({
            where: {teacherId: teacher.id}
        })
        if(req.xhr){
            return res.status(200).json({
                data: tasks
            });
        }
        return res.redirect('back');
        // return res.json(tasks)
    } catch(err) {
        console.log(err);
    }
    
}
module.exports.getTaskOfDay = async function (req, res) {
    try {
        console.log(req.params.date);
    let tasks = await Task.findAll(
        {
            include: [Teacher],
            where: { date: req.params.date }
        }
    );
    return res.json(tasks);
    } catch(err) {
        console.log(err);
    }
    
}
module.exports.deleteTeacher = async function (req, res) {
    let uuid = req.params.uuid;
    console.log(uuid);
    let teacher = await Teacher.destroy({
        where: {
            uuid: uuid
        }
    });
    let tasks =  await Task.destroy({
        where: {
            teacherId: teacher.id
        }
    });
    return res.redirect('back');
}

module.exports.deleteTask = async function (req, res) {
    let uuid = req.params.uuid;
    let task = await Task.destroy({
        where: {
            uuid: uuid
        }
    });
    if (req.xhr) {
        return res.status(200).json({
            task_uuid: uuid
        })
    }
    return res.redirect('back');
}