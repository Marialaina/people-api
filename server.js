require("dotenv").config();

// PORT FROM .env
const { PORT = 3000, MONGODB_URL } = process.env;

// IMPORTING EXPRESS
const express = require("express");
const app = express();

// MIDDLEWARE
const cors = require("cors")
app.use(cors()); // to prevent cors errors, open access to all origins
const morgan = require("morgan");
app.use(morgan("dev")); // logging
app.use(express.json()); // parse json bodies

// IMPORTING MONGOOSE
const mongoose = require("mongoose");
// establish connection
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});
// model
const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String,
});
  
  const People = mongoose.model("People", PeopleSchema);
// connection Events
mongoose.connection
  .on("open", () => console.log("Your are connected to mongoose"))
  .on("close", () => console.log("Your are disconnected from mongoose"))
  .on("error", (error) => console.log(error));

// ROUTES
app.get("/", (req, res) => {
    res.send("Hellooo Marialaina");
});
// index
app.get("/people", async (req, res) => {
    try {
        res.json(await People.find({}));
    } catch (error){
        res.status(400).json(error);
    }
});
// people create route
app.post("/people", async (req, res) => {
    try {
        res.json(await People.create(req.body));
    } catch (error) {
        res.status(400).json(error);
    }
});
// people Update
app.put("/people/:id", async (req, res) => {
    try {
        res.json(
            await People.findByIdAndUpdate(req.params.id, req.body, { new: true}));
    } catch (error) {
        res.status(400).json(error);
    }
});

// people delete route
app.delete("/people/:id", async (req, res) => {
    try {
        res.json(await People.findByIdAndRemove(req.params.id))
    } catch (error) {
        res.status(400).json(error);
    }
});


app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));