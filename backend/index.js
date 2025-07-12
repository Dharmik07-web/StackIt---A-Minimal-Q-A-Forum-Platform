const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Mock Data
let questions = [
  {
    id: 1,
    title: "How to implement JWT authentication in React with Node.js backend?",
    description:
      "<p>I'm building a full-stack application and need help implementing JWT authentication...</p>",
    tags: ["React", "JWT", "Node.js", "Authentication"],
    votes: 15,
    answers: 3,
    views: 1200,
    author: "john_doe",
    createdAt: new Date(),
  },
];
let users = [
  { id: 1, username: "john_doe", role: "user" },
  { id: 2, username: "sarah_dev", role: "user" },
  { id: 3, username: "admin", role: "admin" },
];
let tags = [
  "React",
  "JWT",
  "Node.js",
  "Authentication",
  "MongoDB",
  "Aggregation",
  "Data Analysis",
];

// Questions
app.get("/api/questions", (req, res) => {
  res.json(questions);
});
app.get("/" , (req,res)=>{
  res.render("")
})
app.post("/api/questions", (req, res) => {
  const { title, description, tags, author } = req.body;
  const newQuestion = {
    id: questions.length + 1,
    title,
    description,
    tags,
    votes: 0,
    answers: 0,
    views: 0,
    author,
    createdAt: new Date(),
  };
  questions.unshift(newQuestion);
  res.status(201).json(newQuestion);
});

// Answers (mock, not linked to questions for now)
app.get("/api/answers", (req, res) => {
  res.json([]);
});

// Tags
app.get("/api/tags", (req, res) => {
  res.json(tags);
});

// Users
app.get("/api/users", (req, res) => {
  res.json(users);
});

// Auth (mock login)
app.post("/api/auth/login", (req, res) => {
  const { username } = req.body;
  const user = users.find((u) => u.username === username);
  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
