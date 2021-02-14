const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const ROUTES = {
  users: require("./routes/api/users"),
  auth: require("./routes/api/auth"),
  chatroom: require("./routes/api/chatroom"),
  friends: require("./routes/api/friends"),
};

const {
  notFound,
  productionError,
  developmentError,
  mongooseErrors,
  catchErrors,
} = require("./handlers/errorHandlers");

app.get("/", (req, res) => {
  res.send("Api running...");
});

//Define routes
app.use("/api/users", ROUTES["users"]);
app.use("/api/auth", ROUTES["auth"]);
app.use("/api/chatroom", ROUTES["chatroom"]);
app.use("/api/friend", ROUTES["friends"]);

//import error handlers
app.use(notFound);
app.use(mongooseErrors);
app.use(catchErrors);

if (process.env.NODE_ENV === "DEVELOPMENT") app.use(developmentError);
else app.use(productionError);

module.exports = app;
