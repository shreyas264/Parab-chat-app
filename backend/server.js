const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const {Server} = require("socket.io");
const socketIo = require("./socket");
const userRouter = require("./routes/userRoutes");
const groupRouter = require("./routes/groupRoutes");
const messageRouter = require("./routes/messageRoutes");
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});
// middlewares
app.use(cors({
  origin: "http://localhost:5173",  // allow frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// connect to db
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected to Db"))
  .catch((err) => console.log("Mongodb connected failed", err));

// Initialize 
socketIo(io);

// our routes
app.use('/api/users', userRouter)
app.use('/api/groups', groupRouter)
app.use('/api/messages', messageRouter)

// server start
const PORT = process.env.PORT || 5000
server.listen(PORT, console.log("Server is up and running on port", PORT))
