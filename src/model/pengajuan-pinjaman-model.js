import db from "../application/db.js";

async function insertData(data) {
    const query = await db.query(
        `
        INSERT INTO pinjaman (id, jenis_pinjaman, img_ktp, img_kk, img_surat_nikah,
        img_npwp, img_slip_surat_usaha, img_jaminan, tujuan_dana, nominal_diajukan,
        sumber_penghasilan, jangka_waktu, jadwal_wawancara) 
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
        `,
        [
            data.id,
            data.jenis_pinjaman,
            data.img_ktp,
            data.img_kk,
            data.img_surat_nikah,
            data.img_npwp,
            data.img_slip_surat_usaha,
            data.img_jaminan,
            data.tujuan_dana,
            data.nominal_diajukan,
            data.sumber_penghasilan,
            data.jangka_waktu,
            data.jadwal_wawancara
        ]
    );

    return query;
};

export {
    insertData,
}