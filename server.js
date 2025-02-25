require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Подключено к MongoDB"))
  .catch((err) => console.error("Ошибка подключения:", err));


const UserSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String
});

const User = mongoose.model("User", UserSchema);


const EventSchema = new mongoose.Schema({
  title: String,
  date: String,
  category: String,
});

const Event = mongoose.model("Event", EventSchema);



app.post("/register", [
    body("username").notEmpty().withMessage("Имя пользователя не может быть пустым"),
    body("email").isEmail().withMessage("Неверный формат email"),
    body("password").isLength({ min: 4 }).withMessage("Пароль должен быть минимум 4 символа")
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Этот email уже используется!" });
        }

        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.json({ message: "Регистрация успешна!" });
    } catch (err) {
        console.error("❌ Ошибка при регистрации:", err);
        res.status(500).json({ error: "Ошибка при регистрации" });
    }
});


app.post("/login", async (req, res) => {
    console.log("Пришёл запрос на /login:", req.body); 

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({ error: "Неверный email или пароль" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ error: "Неверный email или пароль" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    console.log("Отправляем токен:", token); 
    res.json({ token });
});


app.get("/events", async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

app.post("/events", async (req, res) => {
  const newEvent = new Event(req.body);
  await newEvent.save();
  res.json(newEvent);
});

app.delete("/events/:id", async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ message: "Событие удалено" });
});


app.listen(PORT, () => console.log(`🚀 Сервер запущен на порту ${PORT}`));
