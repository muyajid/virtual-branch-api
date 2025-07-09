import express from "express";
import { register, login } from "../controller/account-controller.js";
import { authJWTVerification } from "../midleware/auth.js";
import {
  createRekening,
  verifyEmail,
  verifyFace,
  daftarPengajuan,
} from "../controller/create-rekening-controller.js";
import { upload } from "../midleware/multer.js";

const apiRoute = express.Router();

apiRoute.post("/api/auth/register", express.json(), register);
apiRoute.post("/api/auth/login", express.json(), login);

apiRoute.post("/api/rekening/pembukaan", express.json(), authJWTVerification, createRekening);
apiRoute.post("/api/rekening/verify-email", express.json(), authJWTVerification, verifyEmail);
apiRoute.use("/uploads", express.static("uploads"));
apiRoute.post("/api/rekening/verify-wajah", authJWTVerification, upload.fields([{ name: "img_ktp", maxCount: 1}, { name: "img_wajah", maxCount: 1 }]), verifyFace);
apiRoute.get("/api/rekening/daftar-pengajuan", authJWTVerification, daftarPengajuan);

export { apiRoute };
