let backlog_tasks, inprogress_tasks, complete_tasks, onhold_tasks;

window.onload = function () {
    backlog_tasks = document.getElementById('backlog');
    inprogress_tasks = document.getElementById('inprogress');
    complete_tasks = document.getElementById('complete');
    onhold_tasks = document.getElementById('onhold');

    getTasksFromLocalStorage();
    console.log(inprogress_tasks.innerHTML);
    var existing_tasks = document.getElementsByClassName('task');

    const close_btns = document.querySelectorAll('.close');

    close_btns.forEach((btn) => {
        btn.addEventListener('click', deleteTask);
    });

    for (let index = 0; index < existing_tasks.length; index++) {
        existing_tasks[index].addEventListener('dragstart', dragStart, false);
        existing_tasks[index].addEventListener('dragend', dragEnd, false);
    }
};

const columns = document.querySelectorAll('.task_container');

columns.forEach((column) => {
    column.addEventListener('dragover', (e) => {
        e.preventDefault();
        let draggingTask = document.querySelector('.dragging');
        let cardAfterDraggingCard = getCardAfterDraggingCard(column, e.clientY);
        if (cardAfterDraggingCard) {
            cardAfterDraggingCard.parentNode.insertBefore(
                draggingTask,
                cardAfterDraggingCard
            );
        } else {
            column.appendChild(draggingTask);
        }
    });

    column.addEventListener('dragenter', dragEnter);
    column.addEventListener('dragleave', dragLeave);
    column.addEventListener('drop', (e) => {
        e.preventDefault();
        // let draggingTask = document.querySelector('.dragging');
        // e.target.appendChild(draggingTask);
        e.target.style.border = 'none';

        deployTasktoLocalStorage();
        console.log(inprogress_tasks.innerHTML);
        console.log(e.target);
    });
});

// existing_tasks.forEach((task) => {
//     task.addEventListener('dragstart', dragStart);
//     task.addEventListener('dragend', dragEnd);
// });

const addTaskBtns = document.querySelectorAll('.add_task');
const taskInput = document.querySelectorAll('.task_input');

for (let i = 0; i < addTaskBtns.length; i++) {
    addTaskBtns[i].addEventListener('click', () => {
        if (taskInput[i].value != '') {
            const task_div = document.createElement('div');
            const input_val = taskInput[i].value;
            const txt = document.createTextNode(input_val);

            task_div.appendChild(txt);
            task_div.classList.add('task');
            task_div.setAttribute('draggable', 'true');
            task_div.addEventListener('dragstart', dragStart, false);
            task_div.addEventListener('dragend', dragEnd, false);
            const span = document.createElement('span');
            const span_txt = document.createTextNode('\u00D7');
            span.classList.add('close');
            span.appendChild(span_txt);

            task_div.appendChild(span);

            columns[i].appendChild(task_div);

            span.addEventListener('click', () => {
                document
                    .getElementById(task_div.parentNode.id)
                    .removeChild(task_div);
                deployTasktoLocalStorage();
            });

            task_div.addEventListener('dragstart', dragStart);
            task_div.addEventListener('dragend', dragEnd);
            deployTasktoLocalStorage();
            taskInput[i].value = '';
        }
    });
}

function deployTasktoLocalStorage() {
    localStorage.setItem('backlog', backlog_tasks.innerHTML);
    localStorage.setItem('inprogress', inprogress_tasks.innerHTML);
    localStorage.setItem('complete', complete_tasks.innerHTML);
    localStorage.setItem('onhold', onhold_tasks.innerHTML);
}

function getTasksFromLocalStorage() {
    backlog_tasks.innerHTML = localStorage.getItem('backlog');
    inprogress_tasks.innerHTML = localStorage.getItem('inprogress');
    complete_tasks.innerHTML = localStorage.getItem('complete');
    onhold_tasks.innerHTML = localStorage.getItem('onhold');
}

function dragStart() {
    // setTimeout(() => {
    //     this.style.display = 'none';
    // }, 0);
    this.classList.add('dragging');
}

function dragEnd() {
    setTimeout(() => {
        this.style.display = 'block';
    }, 0);
    this.classList.remove('dragging');
}

function dragEnter() {
    this.style.border = '1px dashed #ccc';
}

function dragLeave() {
    this.style.border = 'none';
}

function dragDrop(e) {
    e.preventDefault();
    e.target.style.border = 'none';
    console.log(this);
    deployTasktoLocalStorage();
}

function deleteTask() {
    let task = this.parentNode;
    document.getElementById(task.parentNode.id).removeChild(task);
    deployTasktoLocalStorage();
}

function getCardAfterDraggingCard(column, yDraggingCard) {
    let columnTasks = [...column.querySelectorAll('.task:not(.dragging)')];

    return columnTasks.reduce(
        (closestTask, nextTask) => {
            let nextTaskRect = nextTask.getBoundingClientRect();
            let offset =
                yDraggingCard - nextTaskRect.top - nextTaskRect.height / 2;

            if (offset < 0 && offset > closestTask.offset) {
                return { offset, element: nextTask };
            } else {
                return closestTask;
            }
        },
        { offset: Number.NEGATIVE_INFINITY }
    ).element;
}
