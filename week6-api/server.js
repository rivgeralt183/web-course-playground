require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("./generated/prisma");

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.get("/api/events", async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: { organizer: true },
      orderBy: { id: "asc" },
    });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/events/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid event ID" });
  }

  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: { organizer: true },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/events", async (req, res) => {
  const { title, date, organizerId } = req.body;

  if (!title || !date) {
    return res.status(400).json({
      error: "title and date are required",
    });
  }

  try {
    const newEvent = await prisma.event.create({
      data: {
        title,
        date: new Date(date),
        organizerId: organizerId ? Number(organizerId) : null,
      },
      include: { organizer: true },
    });

    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/api/events/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid event ID" });
  }

  try {
    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Event not found" });
    }

    const { title, date, organizerId } = req.body;
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title: title ?? existing.title,
        date: date ? new Date(date) : existing.date,
        organizerId:
          organizerId !== undefined
            ? organizerId === null
              ? null
              : Number(organizerId)
            : existing.organizerId,
      },
      include: { organizer: true },
    });

    res.json(updatedEvent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/api/events/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid event ID" });
  }

  try {
    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Event not found" });
    }

    await prisma.event.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/api/organizers", async (req, res) => {
  try {
    const organizers = await prisma.user.findMany({
      include: { events: true },
      orderBy: { id: "asc" },
    });
    res.json(organizers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/organizers", async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      error: "name and email are required",
    });
  }

  try {
    const newOrganizer = await prisma.user.create({
      data: { name, email },
    });
    res.status(201).json(newOrganizer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server on http://localhost:3000");
});