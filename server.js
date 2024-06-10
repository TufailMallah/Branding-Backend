const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const db = require("./models");
const authRouter = require("./routes/user.route");
const contactRouter = require("./routes/contact.route"); // Import the contact router

const app = express();

app.use(cors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
}));

app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

app.use("/api", authRouter);
app.use("/api/contact", contactRouter); // Mount the contact router

const PORT = process.env.PORT || 3000;

db.sequelize.authenticate().then(() => {
  console.log('Connection to database has been established successfully.');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(error => {
  console.error('Unable to connect to the database:', error);
});
