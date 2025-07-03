import express from "express";
import { register, login } from "../controller/account-controller.js";

const apiRoute = express.Router();

apiRoute.use(express.json());
apiRoute.post("/api/auth/register", register);
apiRoute.post("/api/auth/login", login);

export { apiRoute };