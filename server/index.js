import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import users from "./routes/users.js";

function errorHandler(error, request, response, next) {
    console.log(error);
    return response.sendStatus(error.status || 500);
}

// Connect to MongoDB
mongoose.connect(process.env.DB_URI);
mongoose.set('strictQuery', false);

const app = express();

app.use(express.json());            // Parse requests as JSON
app.use(cors());                    // Access resources from remote hosts
app.use(express.static("build"));   // Serve static client at '/'
app.use("/users", users);           // Set up CRUD routes at '/users' defined in the 'routes' folder
app.use(errorHandler);              // Catch all errors

app.post("/echo", (res, rep) => {
    console.log("HIT!");
    return rep.json({ echo: res.body });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));