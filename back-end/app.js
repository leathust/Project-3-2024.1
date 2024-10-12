import express from "express";
import morgan from "morgan";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();


app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// app.use('/', )
// app.use()

export default app;
