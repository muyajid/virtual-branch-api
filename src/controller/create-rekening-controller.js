import { insert } from "../model/create-rekening-model.js";
import { v4 as uuid } from "uuid";
import CryptoJS from "crypto-js";
import dotenv from "dotenv";
import { mailer } from "../application/mailer.js";

dotenv.config();

async function createRekening(req, res) {
  try {
    const {
      nama_lengkap,
      tempat_lahir,
      tanggal_lahir,
      jenis_kelamin,
      alamat_ktp,
      alamat_domisili,
      no_ktp,
      status_pernikahan,
      pekerjaan,
      npwp,
      no_hp,
      email,
      penghasilan,
      tujuan,
      status,
    } = req.body;

    if (!email.includes("@")) {
      res.status(401).json({
        message: `Email tidak valid, harus mengandung @`,
      });
      return;
    }

    const generateId = uuid().replace(/-/g, "");
    const enkripKtp = CryptoJS.AES.encrypt(
      no_ktp.toString(),
      process.env.CRYPTO_SECRET
    ).toString();

    const enkripNpwp = npwp
      ? CryptoJS.AES.encrypt(
          npwp.toString(),
          process.env.CRYPTO_SECRET
        ).toString()
      : null;

    const data = {
      id: generateId,
      nama_lengkap: nama_lengkap,
      tempat_lahir: tempat_lahir,
      tanggal_lahir: tanggal_lahir,
      jenis_kelamin: jenis_kelamin,
      alamat_ktp: alamat_ktp,
      alamat_domisili: alamat_domisili,
      no_ktp: enkripKtp,
      status_pernikahan: status_pernikahan,
      pekerjaan: pekerjaan,
      npwp: enkripNpwp,
      no_hp: no_hp,
      email: email,
      penghasilan: penghasilan,
      tujuan: tujuan,
      status: status,
    };

    const query = await insert(data);
    console.log(`Inset account berhasil => ${query}`);

    const verifCode = Math.floor(1000 * Math.random()).toString();
    await mailer(`Kode verifikasi anda adalah ${verifCode}`, email);

    res.json({
      message: `Formulir diterima kode verifikasi di kirim ke email`,
      data: {
        id: generateId,
      },
    });
  } catch (err) {
    console.error(`Terjadi eror ${err.message}`);
    res.json({
      message: `Formulir gagal di terima`,
      erro: err.message,
    });
  }
};

export { createRekening }
