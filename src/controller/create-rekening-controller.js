import {
  insert,
  insertToken,
  selectToken,
  updateToken,
  insertImage,
  selectRekening,
} from "../model/create-rekening-model.js";
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
      jenis,
    } = req.body;

    if (!email.includes("@")) {
      res.status(401).json({
        message: `Email tidak valid, harus mengandung @`,
      });
      return;
    }

    if (
      jenis !== "Rekening Tabungan" &&
      jenis !== "Rekening Giro" &&
      jenis !== "Rekening Deposito"
    ) {
      res.status(401).json({
        message: `Jenis rekening tidak valid`,
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
      jenis: jenis,
    };

    const query = await insert(data);
    console.log(`Inset account berhasil => ${query}`);

    const verifCode = Math.floor(1000 * Math.random()).toString();

    const verifCodeData = {
      id: generateId,
      token: verifCode,
      expired: new Date(Date.now() + 5 * 60 * 1000),
    };
    await mailer(
      `Halo ${nama_lengkap} Kode Verifikasi Kamu Adalah : ${verifCode} \n Jangan Beri Tahu Siapapun`,
      email
    );
    await insertToken(verifCodeData);

    res.json({
      message: `Formulir diterima kode verifikasi di kirim ke email`,
      data: {
        id: generateId,
        nama: nama_lengkap,
        jenis_rekening: jenis,
      },
    });
  } catch (err) {
    console.error(`Terjadi eror ${err.message}`);
    res.status(500).json({
      message: `Formulir gagal di terima`,
      error: err.message,
    });
  }
}

async function verifyEmail(req, res) {
  try {
    const { verif_code } = req.body;

    if (!verif_code) {
      res.status(401).json({
        message: `verif_code diperlukan`,
      });

      return;
    }

    const query = await selectToken(verif_code);

    const query_expired = new Date(query[0].expired);
    if (new Date() > query_expired) {
      res.status(400).json({
        message: `Code verifikasi kadaluwarsa`,
        expired: query_expired,
      });

      return;
    }

    const query_token = query[0].token;
    if (verif_code != query_token) {
      res.status(401).json({
        message: `Code verifikasi tidak valid`,
      });

      return;
    }

    const query_id = query[0].id;
    await updateToken(query_id, "Verified");

    res.status(200).json({
      id: query_id,
      message: `Code verifikasi valid, email terverifikasi`,
      status: "Verified",
    });
  } catch (err) {
    console.error(`Terjadi eror => ${err.message}`);
    res.status(500).json({
      message: `Gagal memverifikasi`,
      eror: err.message,
    });
  }
}

async function verifyFace(req, res) {
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}/`;

    const img_ktp_url = `${baseUrl}uploads/${req.files[`img_ktp`][0].filename}`;
    const img_wajah_url = `${baseUrl}uploads/${
      req.files[`img_face`][0].filename
    }`;

    const id = req.query.id;
    if (!id) {
      res.status(401).json({
        message: `Query id diperlukan dengan value sesuai dengan id rekening`,
      });

      return;
    }

    await insertImage(id, img_ktp_url, img_wajah_url);

    res.json({
      message: `Data wajah dan ktp berhasil di upload`,
      data: {
        ktp: img_ktp_url,
        wajah: img_wajah_url,
      },
    });
  } catch (err) {
    console.error(`Terjadi eror => ${err.message}`);
    res.status(500).json({
      message: `Data wajah dan ktp gagal di upload`,
      eror: err.message,
    });
  }
}

async function daftarPengajuan(req, res) {
  try {
    const [query] = await selectRekening();

    const data = query.map((rekening) => {
      const noKtpToByte = CryptoJS.AES.decrypt(
        rekening.no_ktp,
        process.env.CRYPTO_SECRET
      );
      const noKtpToString = noKtpToByte.toString();

      let npwpToString = null;
      if (rekening.npwp !== null) {
        const npwpToByte = CryptoJS.AES.decrypt(
          rekening.npwp,
          process.env.CRYPTO_SECRET
        );
        npwpToString = npwpToByte.toString();
      }
      return {
        ...rekening,
        no_ktp: noKtpToString,
        npwp: npwpToString,
      };
    });

    res.json({
      data: data,
      total: data.length,
    });
  } catch (err) {
    console.error(`Terjadi eror => ${err.message}`);
    res.status(500).json({
      message: `Gagal mengambil data => ${err.message}`,
      eror: err.message,
    });
  }
}

export { createRekening, verifyEmail, verifyFace, daftarPengajuan };
