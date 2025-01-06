import app from "./app.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({path: "./config.env"});

const DB = process.env.DATABASE_LOCAL;
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log("DB connection successful!"));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server has running on port ${port}...`);
});