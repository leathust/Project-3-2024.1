import app from "./app.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({path: "./.env"});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server has running on port ${port}...`);
});