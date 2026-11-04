
// API URL
const API_URL = "https://jsonplaceholder.typicode.com/users";

// HTML elements
const list = document.querySelector("#user-list");
const statusText = document.querySelector("#status");
const search = document.querySelector("#search");

// Users array
let users = [];

// Render function
function render(items) {
    list.innerHTML = "";

    for (const user of items) {
        const li = document.createElement("li");

        li.textContent = `${user.name} · ${user.email}`;

        list.append(li);
    }
}

// Load users function
async function loadUsers() {
    statusText.textContent = "Loading...";

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("HTTP " + response.status);
        }

        users = await response.json();

        statusText.textContent = "";

        render(users);

    } catch (error) {
        statusText.textContent = "Error: " + error.message;
    }
}

// Load users
loadUsers();

// Live search
search.addEventListener("input", () => {

    const text = search.value.toLowerCase();

    const found = users.filter(user =>
        user.name.toLowerCase().includes(text)
    );

    render(found);

    statusText.textContent =
        found.length === 0 ? "No users found." : "";

});
