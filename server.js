require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

// koneksi MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// schema & model
const studentSchema = new mongoose.Schema({
  nama: String,
  nilai: Number,
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const Student = mongoose.model("Student", studentSchema);
const User = mongoose.model("User", userSchema, "users");

// login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ message: "User tidak ditemukan" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Password salah" });

  res.json({ message: "Login berhasil" });
});

// get students
app.get("/students", async (req, res) => {
  const students = await Student.find().sort({ nama: 1 });
  res.json(students);
});

// add student
app.post("/students", async (req, res) => {
  const { nama, nilai } = req.body;
  const newStudent = new Student({ nama, nilai });
  await newStudent.save();
  res.json({ message: "Data ditambahkan" });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
