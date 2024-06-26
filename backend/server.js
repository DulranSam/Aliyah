const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const port = process.env.PORT;
const cluster = process.env.CLUSTER;
const session = require("express-session");
const helmet = require("helmet");
const { join } = require("path");
const register = require("./routes/register");
const gemini = require("./routes/gemini");
const progression = require("./routes/progression");
const getQuestionsOnTopic = require("./routes/getQuestionsOnTopic");
const getQuestion = require("./routes/getQuestion");
const login = require("./routes/login");
const examResources = require("./routes/exam");
const addQuestion = require("./routes/addQuestion");
const courses = require("./routes/courses");
const user = require("./routes/user");
const getTopics = require("./routes/getTopics");
const learningMaterial = require("./routes/learn");
const examDashboard = require("./routes/examDashboard");
const forum = require("./routes/forum");
const morgan = require("morgan");

async function authenticated(req, res, next) {
  if (req?.session?.user) {
    const user = req.session.user;
    const foundUser = await userModel.findOne({ username: user.username });
    if (!foundUser) {
      return res.status(400).json({ Alert: "invalid user!" });
    }
    return res.status(200).json(foundUser);
  } else {
    return res.status(401).json({ Alert: "Not logged in!" });
  }
}

app.use(cors({ origin: "*" })); //allow access from anywhere for now!
app.use(morgan("combined"));
app.use(express.urlencoded());
app.use(helmet());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("<h1>Hey docker!</h1>");
});

app.set("trust proxy", 1);
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 * 60 },
  })
);

app.use("/register", register);
app.use("/login", login);
// app.use(authenticated); //uncomment during final authentication tests 🔓
app.use("/exam", examResources);
app.use("/examDashboard", examDashboard);
app.use("/addQuestion", addQuestion);
app.use("/course", courses);
app.use("/gemini", gemini);
app.use("/progression", progression);
app.use("/addQuestion", addQuestion);
app.use("/getQuestionsOnTopic", getQuestionsOnTopic);
app.use("/getQuestion", getQuestion);
app.use("/forum", forum);
app.use("/getTopics", getTopics);
app.use("/user", user);
app.use("/resources", learningMaterial);
app.use("/getTopics", getTopics);

app.use("*", (req, res) => {
  //leave this below all the other routes cuz this is the LAST RESORT JUST INCASE THE requested url is neither of the existing routes
  res.status(400);
  if (req.accepts("html")) {
    res.sendFile(join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ Alert: "404 Error" });
  } else {
    res.send("404 Error 😔");
  }
});

async function connectDB() {
  try {
    await mongoose.connect(cluster, { useNewUrlParser: true });
    console.log("Connected to Database! ");
  } catch (err) {
    console.error(err);
  }
}

app.listen(port, connectDB(), console.log(`Servers up on port ${port}`));
