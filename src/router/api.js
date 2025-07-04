import express from "express";
import { register, login } from "../controller/account-controller.js";
import { authJWTVerification } from "../midleware/auth.js";
import { createRekening, verifyEmail } from "../controller/create-rekening-controller.js";

const apiRoute = express.Router();

apiRoute.use(express.json());
apiRoute.post("/api/auth/register", register);
apiRoute.post("/api/auth/login", login);

apiRoute.post("/api/create-rekening", authJWTVerification, createRekening);
apiRoute.post("/api/verify-email", authJWTVerification, verifyEmail)
export { apiRoute };