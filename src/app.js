import express from "express";
import { apiRoute } from "./router/api.js";
import dotenv from "dotenv";

const app = express();

app.use("/", apiRoute);

app.listen(process.env.PORT, () => {
    console.info(`Server running on port ${process.env.PORT}`);
})
