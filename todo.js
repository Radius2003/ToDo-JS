
const ENTER = 'Enter';
const ESC = 'Escape';
const TASK_PER_PAGE = 5;
const checkAllTask = document.querySelector('#check-box-up');
const form = document.querySelector('#header');
const inputMain = document.querySelector('#inputMain');
const buttonAdd = document.querySelector('#buttonAdd');
const list = document.querySelector('#todo-elements')
const bottomMenu = document.querySelector('#bottom-buttons')
const bottomButtons = bottomMenu.querySelectorAll('.flex-element')
const pages = document.querySelector('.pages')
const counters = pages.querySelectorAll('.counter')
let tasksArray = []
let filterName = "All"
let currentPage = 1;
let totalPages = 1;
const dbClick = 2;

const addTasks = (event) =>{
  event.preventDefault();
  let taskTextValue =replaced(inputMain.value.replace(/ +/g, " "));
  if (inputMain.value.trim() != "") {
    filterName = "All"
    bottomButtons.forEach(task => task.classList.remove('active'));
    bottomMenu.children[0].classList.add("active")
    tasksArray.push(
      {
        id: Date.now(),
        taskText: taskTextValue,
        isCompleted: false,
      }
    )
  }
  countPages()
  renderPage()
  if (totalPages > currentPage) {
    currentPage = Math.ceil(tasksArray.length / TASK_PER_PAGE)
  }
  inputMain.value = "";
  renderTask()
}

const renderTask = () => {
  counterButtons()
  renderPage()
  checkAllTask.checked = tasksArray.every(task => task.isCompleted) 
  const rend = slicePage()
  let renderElements = ""
    rend.forEach((task) => {
      renderElements += `
    <li class="task-block" id="${task.id}">
      <input class="check-box" type="checkbox" ${task.isCompleted ? 'checked' : ''}>
      <input hidden class = "newText "  minLength="1" maxLength="255" value = "${task.taskText}" >
      <pre class="task-name">${task.taskText}</pre>
      <button class="delete">X</button>
    </li>
    `
    });
  list.innerHTML = renderElements;
}

function handleClick(event) {
  const parentId = event.target.parentElement.id;
  if (event.target.className === 'delete') {
    tasksArray = tasksArray.filter(task => (task.id != parentId))
    renderTask()
  }

  if (event.target.className === 'check-box') {
    tasksArray.forEach((task) => {
      if (task.id == parentId) task.isCompleted = event.target.checked;
    });
    renderTask()
  }

  if (event.target.className === 'task-name') {
    if (event.detail == dbClick) {
      event.target.hidden = true;
      event.target.previousElementSibling.hidden = false;
      event.target.previousElementSibling.focus();
      event.target.previousElementSibling.innerText = event.target.innerText
    }
  }

}

const blurTask = (event) => {
  if (event.target.className  !== 'check-box') {
    tasksArray.forEach(task => {
      if (task.id == event.target.parentElement.id) {
        task.taskText = replaced(event.target.value.replace(/ +/g, " "))
      }
    })
  }
  renderTask()
}

const editTask = (event) => {
  if (event.code === ENTER && event.target.className !== 'check-box') {
      const parentId = event.target.parentElement.id
      tasksArray.forEach(task => {
        let inputText = task.taskText
        if (task.id === Number(parentId)) {
          task.taskText = replaced(event.target.value.replace(/ +/g, " "))
        };
      });
    renderTask()
  }
  else if (event.code === ESC) {
    renderTask()
  }
}

const allChecked = (event) => {
  tasksArray.forEach(task => {
    task.isCompleted = event.target.checked;
  });
  renderTask()
}

const filter = (event) => {
  if (event.target.className === 'flex-element') {
    filterName = event.target.id
    renderTask()
  }
  if (event.target.className == 'flex-element') {
    bottomButtons.forEach(task => task.classList.remove('active'));
    event.target.classList.add("active")
    renderTask()
  }
}
const counterButtons = () => {
  const completedCount = tasksArray.filter(task => task.isCompleted).length;
  bottomMenu.children[2].innerText = `Completed (${completedCount})`
  bottomMenu.children[1].innerText = `Active (${tasksArray.length - completedCount})`
  bottomMenu.children[0].innerText = `All (${tasksArray.length})`
}
const filterArray = () => {
  if (filterName === "All") {
    return tasksArray
  }
  else if (filterName === "Active") {
    return tasksArray.filter(task => !task.isCompleted)
  }
  else if (filterName === "Completed") {
    return tasksArray.filter(task => task.isCompleted)
  }
}

const deleteCompleted = () => {
  tasksArray = tasksArray.filter(task => !task.isCompleted)
  countPages()
  renderTask()
}

const countPages = () => {
  const filteredArr = filterArray();
  totalPages = Math.ceil(filteredArr.length / TASK_PER_PAGE)
  if (currentPage > totalPages) {
    currentPage = totalPages
    renderTask()
  }
  if (currentPage < 1) {
    currentPage = 1;
  }
}

const renderPage = () => {
  countPages()
  let createPages = `<button class='counter${(currentPage < 2) ? ' counter__active' : ''}' id = "1">1</button>`
  for (let i = 2; i <= totalPages; i++) {
    if (i < 45) {
      createPages += `<button class='counter${(currentPage === i) ? ' counter__active' : ''}' id ="${i}">${i}</button>`;
    }
  }
  pages.innerHTML = createPages;
}

const changePage = (event) => {
  if (event.target.className === 'counter') {
    currentPage = Number(event.target.id);
    renderTask()

  }

}

const slicePage = () => {
  const filteredArray = filterArray()
  const firstElement = (currentPage - 1) * TASK_PER_PAGE;
  const elementOnEnd = TASK_PER_PAGE + firstElement;
  const pagination = filteredArray.slice(firstElement, elementOnEnd)
  return pagination;
}

const replaced = (string) => {
  return string
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}


pages.addEventListener("click", changePage)
deleteAll.addEventListener("click", deleteCompleted);
bottomMenu.addEventListener("click", filter);
checkAllTask.addEventListener("click", allChecked);
list.addEventListener("blur", blurTask, true);
list.addEventListener("keydown", editTask);
list.addEventListener('click', handleClick);
buttonAdd.addEventListener("click", addTasks)
