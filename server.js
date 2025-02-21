require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Подключение к MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Подключено к MongoDB"))
  .catch((err) => console.error("Ошибка подключения:", err));

// Модель события
const EventSchema = new mongoose.Schema({
  title: String,
  date: String,
  category: String,
});

const Event = mongoose.model("Event", EventSchema);

// 📌 API Маршруты

// Получить все события
app.get("/events", async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

// Добавить событие
app.post("/events", async (req, res) => {
  const newEvent = new Event(req.body);
  await newEvent.save();
  res.json(newEvent);
});

// Удалить событие
app.delete("/events/:id", async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ message: "Событие удалено" });
});

// Запуск сервера
app.listen(PORT, () => console.log(`🚀 Сервер запущен на порту ${PORT}`));
