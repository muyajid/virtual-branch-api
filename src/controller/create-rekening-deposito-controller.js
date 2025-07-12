import { v4 as uuid } from "uuid";
import { insertData, selectData, selectId } from "../model/create-rekening-deposito-model.js";
async function createDeposito(req, res) {
  try {
    const {
      nama_lengkap,
      alamat_lengkap,
      nomor_telepon,
      alamat_email,
      pekerjaan,
      sumber_dana,
      tujuan,
      nama_ibu,
      jangka_waktu,
      setoran_awal,
      penarikan_bunga,
    } = req.body;

    if (nomor_telepon.length < 12) {
      throw new Error("Nomor telepon tidak valid, harus 12 digit");
    }

    if (!alamat_email.includes("@")) {
      throw new Error("Alamat email tidak valid, harus mengandung '@'");
    }

    if (setoran_awal < 1000000) {
      throw new Error("Setoran awal terlalu kecil, minimal RP. 1.0000.000");
    }

    if (penarikan_bunga !== "Tiap Bulan" && penarikan_bunga !== "Jatuh Tempo") {
      throw new Error("Jenis penarikan bunga tidak valid");
    }

    const generateId = uuid().replace(/-/g, "");
    const data = {
      id: generateId,
      nama_lengkap: nama_lengkap,
      alamat_lengkap: alamat_lengkap,
      nomor_telepon: nomor_telepon,
      alamat_email: alamat_email,
      pekerjaan: pekerjaan ? pekerjaan : null,
      sumber_dana: sumber_dana,
      tujuan: tujuan,
      nama_ibu: nama_ibu,
      jangka_waktu: jangka_waktu,
      setoran_awal: setoran_awal,
      penarikan_bunga: penarikan_bunga,
    };

    await insertData(data);

    res.json({
      message: `Proses Sedang Berlangsung, Silahkan Datangi Teller Untuk Penyetoran Dana Awal Yang Sudah Di Tetapkan Sebesar RP.${setoran_awal}`,
      data: {
        id: `Tunjukan ke teller => ${generateId}`,
        nama_lengkap: nama_lengkap,
        alamat_lengkap: alamat_lengkap,
        nomor_telepon: nomor_telepon,
        alamat_email: alamat_email,
        pekerjaan: pekerjaan ? pekerjaan : null,
        sumber_dana: sumber_dana,
        tujuan: tujuan,
        nama_ibu: nama_ibu,
        jangka_waktu: jangka_waktu,
        setoran_awal: setoran_awal,
        penarikan_bunga: penarikan_bunga,
      },
    });
  } catch (err) {
    console.error(`Proses Gagal => ${err.message}`);
    res.status(500).json({
        message: `Proses Gagal`,
      eror: err.message
    })
  }
};

async function daftarDeposito(req, res) {
  try {
    const query = await selectData();
    res.json({
      data: query,
      total: query.length
    });
  } catch (err) {
    console.error(`Gagal mengambil daftar deposito => ${err.message}`);
    res.status(500).json({
      message: `Gagal mengambil daftar deposito`,
      eror: err.message
    })    
  }
}

async function searchId(req, res) {
  try {
    const { id } = req.query
    const query = await selectId(id);
    console.log(query);
    
    if (!id) {
      res.status(401).json({
        message: `Quey id diperlukan`
      })
      return;
    }

    if (query.length === 0) {
      res.status(404).json({
        message: `Id tidak ditemukan`
      })
      return;
    }

    res.json({
      message: `Id ditemukan`,
      data: query,
      total: query.length
    })
  } catch (err) {
    console.error(`Gagal mengambil data => ${err.message}`);
    res.json({
      message: `Gagal mengambil data`,
      eror: err.message
    })
  }
}
export {createDeposito, daftarDeposito, searchId }
