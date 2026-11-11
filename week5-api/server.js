
const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Request Logger
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

// Events Data
let events = [
  { id: 1, title: "Coding Night", date: "2026-11-20" },
  { id: 2, title: "Career Talk", date: "2026-11-27" }
];

// GET: Get all events
app.get("/api/events", (req, res) => {
  res.json(events);
});

// GET: Get event by ID
app.get("/api/events/:id", (req, res) => {
  const id = Number(req.params.id);
  const event = events.find((e) => e.id === id);

  if (!event) {
    return res.status(404).json({
      error: "Event not found"
    });
  }

  res.json(event);
});

// POST: Create a new event
app.post("/api/events", (req, res) => {
  const { title, date } = req.body;

  if (!title || !date) {
    return res.status(400).json({
      error: "title and date are required"
    });
  }

  const newEvent = {
    id: Date.now(),
    title,
    date
  };

  events.push(newEvent);

  res.status(201).json(newEvent);
});

// PUT: Update an event
app.put("/api/events/:id", (req, res) => {
  const id = Number(req.params.id);
  const event = events.find((e) => e.id === id);

  if (!event) {
    return res.status(404).json({
      error: "Event not found"
    });
  }

  const { title, date } = req.body;

  event.title = title ?? event.title;
  event.date = date ?? event.date;

  res.json(event);
});

// DELETE: Delete an event
app.delete("/api/events/:id", (req, res) => {
  const id = Number(req.params.id);
  const event = events.find((e) => e.id === id);

  if (!event) {
    return res.status(404).json({
      error: "Event not found"
    });
  }

  events = events.filter((e) => e.id !== id);

  res.status(204).end();
});

// Start Server
app.listen(3000, () => {
  console.log("Server on http://localhost:3000");
});
