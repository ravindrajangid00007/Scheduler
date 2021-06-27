var notyf = new Notyf({
    duration: 1000,
    dismissible: true,
    position: {
        x: 'right',
        y: 'top'
    },
    types: [
        {
            type: 'warning',
            background: 'orange',
            icon: {
                className: 'fa-exclamation',
                tagName: 'i',
                text: 'warning'
            }
        }
    ]
});

function toggleTeacherForm() {
    $(".teacher-create-form").toggleClass("show-form");
}
function toggleTaskForm() {
    $("#task-create-form").toggleClass("highlight");
}
function toggleTasksDiv() {
    $(".all-task-of-teacher").toggleClass("show-tasks");
}
$('#add-teacher').click(toggleTeacherForm);

$('.form-close-icon').click(toggleTeacherForm);

$('.date').click(function () {
    let date = $(this).attr('date')
    $('#top-date').text(date);

    //ajax get request for tasks list of a day
    $.get("/get-task-of-day/" + date)
        .done(function (tasks) {
            $('.task').empty();
            // console.log("tasks at jquery", tasks);
            if (tasks.length > 0) {
                for (task of tasks) {
                    let dom = presentation(task);
                    $(`#${task.time}`).prepend(dom);
                    deleteTask($(' .task-delete-links', dom));
                }
                notyf.success('Your tasks are here');
            } else {
                notyf.open({
                    type: 'warning',
                    message: 'Not a single task is schedule here'
                  });
            }
        })
        .fail(function (err) {
            console.log(err);
        });

});

function presentation(task) {
    return $(`<div id="task-${task.uuid}" class="task-info-container">
        <span>${task.content}</span>
        <small>${task.Teacher.name}</small>
        <a href="/delete-task/${task.uuid}" class="task-delete-links"><i class="far fa-trash-alt"></i></a>
    </div>
`)
}


let deleteTask = function (deleteLink) {
    $(deleteLink).click(function (event) {
        event.preventDefault();
        event.stopPropagation();
        let url = $(deleteLink).prop('href');
        // console.log(url);
        $.get(url)
            .done((data) => {
                // console.log(data);
                $(`#task-${data.task_uuid}`).remove();
                $(`#task-list-${data.task_uuid}`).remove();
                notyf.success('Task delete successfully');
            })
            .fail((err) => {
                console.log(err.responseText);
            });
    });
}
let links = $(".task-delete-links");
if (links.length > 0) {
    for (link of links) {
        deleteTask(link);
    }
}


$('#add-task-button').click(function () {
    let formData = $('#task-create-form').serialize();

    var time = $('#time-selector').children("option:selected").val();
    let date = $('#date-select').val();
    let teacherOverlapExist = false;
    var promise = new Promise((resolve, reject) => {
        $.get('/get-tasks-overlapping', formData)
            .done(function (tasks) {
                for (task of tasks) {
                    if (task.time == time && task.date == date) {
                        //message teacher class is overlapping 
                        teacherOverlapExist = true;
                        notyf.error('Your tasks are overlapping');
                        toggleTaskForm();
                    }
                }
                resolve();
            })
            .fail((err) => {
                console.log(err.responseText);
            });

    });
    promise.then(() => {
        if (!teacherOverlapExist) {
            $.post('/create-task', formData)
                .done(function (data) {
                    // console.log(data);
                    toggleTaskForm();
                    let date = $('#top-date').text();
                    if (date == data.task.date) {
                        let newTask = presentation(data.task);
                        $(`#${data.task.time}`).prepend(newTask);
                        deleteTask($(' .task-delete-links', newTask));
                    }
                    notyf.success('Task added successfully');
                })
                .fail((err) => {
                    console.log(err.responseText);
                });
        }
    });
});


$('.fa-calendar-plus').click(toggleTaskForm);
$('#cancel-task-button').click(toggleTaskForm);


$('.task').click(function () {
    let time = $(this).attr('id');
    let date = $('#top-date').text();
    $('#task-create-form').trigger("reset");
    $('#time-selector').val(`${time}`);
    $('#date-select').val(`${date}`);
    toggleTaskForm();
});

$('.search-button').click(function (event) {
    // event.preventDefault();
    let formData = $('#search-teacher-form').serialize();
    // var selectedTeacher = $('#teacher-selector').children("option:selected").val();
    $.get('/get-tasks', formData)
        .done(function (tasks) {
            $('.task-list').html("");
            toggleTasksDiv();
            notyf.success('All tasks of selected Teacher');
            for (task of tasks.data) {
                let newListItem = listDom(task);
                $(`.task-list`).prepend(newListItem);
                deleteTask($(' .task-delete-links', newListItem));
            }
        })
        .fail(function (err) {
            console.log(err);
        })
});


function listDom(task) {
    return $(`<li class="task-list-items" id="task-list-${task.uuid}">
    <div>
    ${task.content}
    </div>
    <div>
    ${task.date}
    </div>
    <div>
    ${task.time}
    </div>
    <a href="/delete-task/${task.uuid}" class="task-delete-links"><i class="far fa-trash-alt"></i></a>
</li>`);
}

$('.close-tasks').click(function () {
    toggleTasksDiv();
});