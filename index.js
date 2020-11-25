import express from "express";
import bodyParser from "body-parser";

import moviesRoutes from "./routes/movies.js";

const app = express();
const PORT = 5000;
app.use(bodyParser.json());

app.use("/movies", moviesRoutes);

app.use("/", (req, res) => res.send("Hello"));

app.listen(PORT, () => console.log("Server is running"));
