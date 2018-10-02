const dotenv = require("dotenv"),
  path = require("path"),
  express = require("express"),
  session = require("express-session"),
  http = require("http"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  socketIO = require("socket.io"),
  passport = require("passport"),
  passportLocal = require("./config/passport")(passport),
  flash = require("connect-flash");

const app = express(),
  port = process.env.PORT || 3000,
  config = dotenv.config();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// express-session middleware
app.use(
  session({
    secret: "secret cat",
    resave: true,
    saveUninitialized: true
  })
);
app.use(flash());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect to DB
mongoose.connect(
  `mongodb://${process.env.DB_USER}:${process.env.DB_PW}@${
    process.env.DB_HOST
  }:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  {
    useNewUrlParser: true
  }
);

// Load view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Routes
const users = require("./routes/users");
const chat = require("./routes/chat");

app.use(express.static(__dirname + "/public"));

// Server instance
const server = http.createServer(app);

// Create socket using the instance of the server
const io = socketIO(server);

// This is what hte socket.io sntax is like, we will work this later
io.on("connection", socket => {
  console.log("User connected!");

  socket.on("disconnect", () => console.log("User disconnected!"));
});

app.get("/", (req, res) => res.render("index"));
app.use("/chat", chat);
app.use("/users", users);

server.listen(port, () => console.log(`Server started on port ${port}...`));
