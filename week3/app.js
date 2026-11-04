
let tasks = [
  { id: 1, title: "Read MDN", done: false },
  { id: 2, title: "Do the lab", done: true }
];

const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const error = document.querySelector("#error");
const list = document.querySelector("#task-list");

// Görevleri ekranda göster
function render() {
  list.innerHTML = "";

  tasks.forEach(function(task) {
    const li = document.createElement("li");
    li.dataset.id = task.id;

    const span = document.createElement("span");
    span.textContent = task.title;

    if (task.done) {
      span.classList.add("done");
    }

    const button = document.createElement("button");
    button.textContent = "Delete";
    button.type = "button";
    button.className = "delete";

    li.append(span);
    li.append(button);

    list.append(li);
  });
}

// Sayfa açıldığında görevleri göster
render();

// Yeni görev ekleme
form.addEventListener("submit", function(event) {
  event.preventDefault();

  const title = input.value.trim();

  if (title === "") {
    error.textContent = "Please write a task.";
    return;
  }

  error.textContent = "";

  tasks.push({
    id: Date.now(),
    title: title,
    done: false
  });

  input.value = "";
  render();
});

// Görev silme ve tamamlandı olarak işaretleme
list.addEventListener("click", function(event) {

  if (event.target.classList.contains("delete")) {
    const li = event.target.closest("li");
    const id = Number(li.dataset.id);

    tasks = tasks.filter(function(task) {
      return task.id !== id;
    });

    render();
    return;
  }

  const li = event.target.closest("li");

  if (li) {
    const id = Number(li.dataset.id);

    const task = tasks.find(function(task) {
      return task.id === id;
    });

    if (task) {
      task.done = !task.done;
      render();
    }
  }

});
