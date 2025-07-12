import express from "express";
import { register, login } from "../controller/account-controller.js";
import { authJWTVerification } from "../midleware/auth.js";
import {
  createRekening,
  verifyEmail,
  verifyFace,
  daftarPengajuan,
} from "../controller/create-rekening-controller.js";
import {
  pengajuanPinjaman,
  daftarPinjaman,
} from "../controller/pengajuan-pinjaman-controller.js";
import { createDeposito } from "../controller/create-rekening-deposito-controller.js";
import { uploader } from "../midleware/multer.js";

const apiRoute = express.Router();

apiRoute.post("/api/auth/register", express.json(), register);
apiRoute.post("/api/auth/login", express.json(), login);

apiRoute.post(
  "/api/rekening/pembukaan",
  express.json(),
  authJWTVerification,
  createRekening
);
apiRoute.post(
  "/api/rekening/verify-email",
  express.json(),
  authJWTVerification,
  verifyEmail
);
apiRoute.use("/uploads", express.static("uploads"));
apiRoute.post(
  "/api/rekening/verify-wajah",
  authJWTVerification,
  uploader().fields([
    { name: "img_ktp", maxCount: 1 },
    { name: "img_wajah", maxCount: 1 },
  ]),
  verifyFace
);
apiRoute.get(
  "/api/rekening/daftar-pengajuan",
  authJWTVerification,
  daftarPengajuan
);

apiRoute.post(
  "/api/pinjaman/pengajuan",
  authJWTVerification,
  uploader("uploads_dokumen").fields([
    { name: "img_ktp", maxCount: 1 },
    { name: "img_kk", maxCount: 1 },
    { name: "img_surat_nikah", maxCount: 1 },
    { name: "img_npwp", maxCount: 1 },
    { name: "img_slip_surat_usaha", maxCount: 1 },
    { name: "img_jaminan", maxCount: 1 },
  ]),
  pengajuanPinjaman
);
apiRoute.use("/uploads_dokumen", express.static("uploads_dokumen"));
apiRoute.get(
  "/api/pinjaman/daftar-pengajuan",
  authJWTVerification,
  daftarPinjaman
);

apiRoute.post("/api/deposito/pembukaan",express.json(), authJWTVerification, createDeposito);

export { apiRoute };
