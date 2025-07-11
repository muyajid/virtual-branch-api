import dayjs from "dayjs";
import { v4 as uuid } from "uuid";
import { insertData, selectData } from "../model/pengajuan-pinjaman-model.js";

async function pengajuanPinjaman(req, res) {
  try {
    const {
      jenis_pinjaman,
      tujuan_dana,
      nominal_diajukan,
      sumber_penghasilan,
      jangka_waktu,
    } = req.body;

    const baseUrl = `${req.protocol}://${req.get("host")}/`;

    const img_ktp_url = `${baseUrl}uploads_dokumen/${req.files["img_ktp"][0].filename}`;
    const img_kk_url = `${baseUrl}uploads_dokumen/${req.files["img_kk"][0].filename}`;
    const img_surat_nikah_url = `${baseUrl}uploads_dokumen/${req.files["img_surat_nikah"][0].filename}`;

    const img_npwp_url = req.files["img_npwp"]?.[0]?.filename
      ? `${baseUrl}uploads_dokumen/${req.files["img_npwp"][0].filename}`
      : null;

    const img_slip_surat_usaha_url = req.files["img_slip_surat_usaha"]?.[0]
      ?.filename
      ? `${baseUrl}uploads_dokumen/${req.files["img_slip_surat_usaha"][0].filename}`
      : null;

    const img_jaminan_url = req.files["img_jaminan"]?.[0]?.filename
      ? `${baseUrl}uploads_dokumen/${req.files["img_jaminan"][0].filename}`
      : null;

    const generateId = uuid().replace(/-/g, "");
    const generateJadwal = dayjs().add(1, "day").format("DD-MM-YYYY");

    if (dayjs(jangka_waktu).isBefore(dayjs(), "day")) {
      throw new Error("Jangka waktu pinjaman tidak valid");
    }

    if (nominal_diajukan < 100000) {
      throw new Error("Nominal diajukan terlalu kecil");
    }

    if (
      jenis_pinjaman !== "Murabahah" &&
      jenis_pinjaman !== "Mudharabah" &&
      jenis_pinjaman !== "Ijarah"
    ) {
      throw new Error("Jenis pinjaman tidak tersedia");
    }

    const data = {
      id: generateId,
      jenis_pinjaman: jenis_pinjaman,
      img_ktp: img_ktp_url,
      img_kk: img_kk_url,
      img_surat_nikah: img_surat_nikah_url,
      img_npwp: img_npwp_url,
      img_slip_surat_usaha: img_slip_surat_usaha_url,
      img_jaminan: img_jaminan_url,
      tujuan_dana: tujuan_dana,
      nominal_diajukan: nominal_diajukan,
      sumber_penghasilan: sumber_penghasilan,
      jangka_waktu: jangka_waktu,
      jadwal_wawancara: generateJadwal,
    };

    await insertData(data);
    res.status(200).json({
      message: `Pengajuan pinjaman berhasil, silahkan melanjutkan ke tahap wawancara di kantor bank jateng terdekat`,
      data: {
        id: generateId,
        jenis_pinjaman: jenis_pinjaman,
        jadwal_wawancara: generateJadwal,
      },
    });
  } catch (err) {
    console.error(`Terjadi eror => ${err.message}`);
    res.json({
      message: `Pengajuan pinjaman gagal`,
      eror: err.message,
    });
  }
};

async function daftarPinjaman(req, res) {
  try {
    const query = await selectData();
    res.json({
      data: query,
      total: query.length
    });
  } catch (err) {
    console.error(`Gagal mengambil daftar pinjaman => ${err.message}`);
    res.json({
      message: `Gagal mengambil daftar pinjaman`,
      eror: err.message
    })
  }  
};


export { pengajuanPinjaman, daftarPinjaman };
